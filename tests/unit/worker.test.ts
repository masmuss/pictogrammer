import { describe, expect, it, vi } from "vitest";
import { CONTENT_SIGNAL } from "@/config/content-signal";
import worker from "@/worker";

const BASE_URL = "https://example.com";
const MARKDOWN_BODY = "# About\n";
const EXTERNAL_POST_PATH = "/blog/reflections/external-post";
const EXTERNAL_POST_URL = "https://medium.com/@author/external-post";

interface MockAssetOptions {
	missingMarkdown?: boolean;
	redirectManifest?: Record<string, string>;
}

function createAssets(options: MockAssetOptions = {}) {
	const fetch = vi.fn(async (input: RequestInfo | URL) => {
		const request =
			input instanceof Request ? input : new Request(new URL(input, BASE_URL));
		const url = new URL(request.url);
		const method = request.method;

		if (url.pathname.startsWith("/_astro/")) {
			return new Response(method === "HEAD" ? null : "console.log(1)", {
				status: 200,
				headers: { "Content-Type": "text/javascript" },
			});
		}

		if (url.pathname === "/external-post-redirects.json") {
			if (!options.redirectManifest) {
				return new Response(null, { status: 404 });
			}

			return Response.json(options.redirectManifest);
		}

		if (url.pathname.endsWith(".md")) {
			if (options.missingMarkdown || url.pathname === "/missing/index.md") {
				return new Response(null, { status: 404 });
			}

			return new Response(method === "HEAD" ? null : MARKDOWN_BODY, {
				status: 200,
				headers: {
					"Content-Type": "text/markdown",
					"Content-Length": String(MARKDOWN_BODY.length),
				},
			});
		}

		if (url.pathname === "/missing") {
			return new Response(null, {
				status: 404,
				headers: { "Content-Type": "text/html; charset=utf-8" },
			});
		}

		return new Response(
			method === "HEAD" ? null : "<html><body>page</body></html>",
			{
				status: 200,
				headers: { "Content-Type": "text/html; charset=utf-8" },
			},
		);
	});

	return { fetch };
}

function createEnv(options: MockAssetOptions = {}) {
	const assets = createAssets(options);
	return { env: { ASSETS: assets }, assets };
}

function request(path: string, accept?: string, method = "GET") {
	return new Request(`${BASE_URL}${path}`, {
		method,
		headers: accept ? { Accept: accept } : undefined,
	});
}

describe("worker content negotiation", () => {
	it("serves markdown when the client prefers it", async () => {
		const { env, assets } = createEnv();
		const response = await worker.fetch(
			request("/about", "text/markdown"),
			env,
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toBe(
			"text/markdown; charset=utf-8",
		);
		expect(response.headers.get("vary")).toBe("Accept");
		expect(response.headers.get("content-signal")).toBe(CONTENT_SIGNAL);
		expect(response.headers.get("cache-control")).toBe("private, no-store");
		expect(response.headers.get("link")).toContain(
			'</about>; rel="alternate"; type="text/html"',
		);
		expect(response.headers.get("x-markdown-tokens")).toBe("2");
		expect(await response.text()).toBe(MARKDOWN_BODY);
		expect(assets.fetch).toHaveBeenCalledWith(
			expect.objectContaining({
				url: `${BASE_URL}/about/index.md`,
			}),
		);
	});

	it.each(["text/html", "text/markdown"])(
		"redirects external posts before negotiating %s",
		async (accept) => {
			const { env, assets } = createEnv({
				redirectManifest: { [EXTERNAL_POST_PATH]: EXTERNAL_POST_URL },
			});
			const response = await worker.fetch(
				request(EXTERNAL_POST_PATH, accept),
				env,
			);

			expect(assets.fetch).toHaveBeenCalledWith(
				"/external-post-redirects.json",
			);
			expect(response.status).toBe(301);
			expect(response.headers.get("location")).toBe(EXTERNAL_POST_URL);
			expect(response.headers.get("content-signal")).toBe(CONTENT_SIGNAL);
			expect(assets.fetch).not.toHaveBeenCalledWith(
				expect.objectContaining({ url: `${BASE_URL}${EXTERNAL_POST_PATH}` }),
			);
		},
	);

	it("redirects external posts for HEAD requests", async () => {
		const { env } = createEnv({
			redirectManifest: { [EXTERNAL_POST_PATH]: EXTERNAL_POST_URL },
		});
		const response = await worker.fetch(
			request(EXTERNAL_POST_PATH, "text/html", "HEAD"),
			env,
		);

		expect(response.status).toBe(301);
		expect(response.headers.get("location")).toBe(EXTERNAL_POST_URL);
	});

	it("serves internal blog posts when the redirect manifest is missing", async () => {
		const { env, assets } = createEnv();
		const response = await worker.fetch(
			request("/blog/notes/internal-post", "text/html"),
			env,
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/html");
		expect(assets.fetch).toHaveBeenCalledWith(
			expect.objectContaining({
				url: `${BASE_URL}/blog/notes/internal-post`,
			}),
		);
	});

	it("serves HTML and advertises the markdown alternate by default", async () => {
		const { env, assets } = createEnv();
		const response = await worker.fetch(request("/about"), env);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/html");
		expect(response.headers.get("vary")).toBe("Accept");
		expect(response.headers.get("content-signal")).toBe(CONTENT_SIGNAL);
		expect(response.headers.get("link")).toContain(
			'</about/index.md>; rel="alternate"; type="text/markdown"',
		);
		expect(await response.text()).toContain("page");

		expect(assets.fetch).toHaveBeenCalledWith(
			expect.objectContaining({ url: `${BASE_URL}/about` }),
		);
	});

	it("redirects trailing slashes to the canonical page path", async () => {
		const { env, assets } = createEnv();
		const response = await worker.fetch(request("/about/"), env);

		expect(response.status).toBe(308);
		expect(response.headers.get("location")).toBe(`${BASE_URL}/about`);
		expect(response.headers.get("content-signal")).toBe(CONTENT_SIGNAL);
		expect(assets.fetch).not.toHaveBeenCalled();
	});

	it("returns 406 when neither representation is acceptable", async () => {
		const { env } = createEnv();
		const response = await worker.fetch(
			request("/about", "application/pdf"),
			env,
		);

		expect(response.status).toBe(406);
		expect(response.headers.get("vary")).toBe("Accept");
		expect(response.headers.get("content-signal")).toBe(CONTENT_SIGNAL);
		expect(await response.text()).toContain("Available: text/html");
	});

	it("falls back to HTML when markdown is missing but HTML is acceptable", async () => {
		const { env } = createEnv({ missingMarkdown: true });
		const response = await worker.fetch(
			request("/about", "text/markdown, text/html;q=0.1"),
			env,
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/html");
	});

	it("returns 406 when markdown is missing and only markdown is acceptable", async () => {
		const { env } = createEnv({ missingMarkdown: true });
		const response = await worker.fetch(
			request("/about", "text/markdown"),
			env,
		);

		expect(response.status).toBe(406);
	});

	it("preserves the 404 response for unknown pages", async () => {
		const { env } = createEnv();
		const response = await worker.fetch(
			request("/missing", "text/markdown"),
			env,
		);

		expect(response.status).toBe(404);
		expect(response.headers.get("content-type")).toContain("text/html");
	});

	it("passes static assets through without negotiation headers", async () => {
		const { env } = createEnv();
		const response = await worker.fetch(
			request("/_astro/app.js", "text/markdown"),
			env,
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toBe("text/javascript");
		expect(response.headers.get("vary")).toBeNull();
		expect(response.headers.get("content-signal")).toBe(CONTENT_SIGNAL);
	});
});
