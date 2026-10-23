import { CONTENT_SIGNAL } from "./config/content-signal";
import {
	appendVaryAccept,
	HTML_TYPE,
	isNegotiablePath,
	MARKDOWN_TYPE,
	markdownPath,
	type NegotiableType,
	pagePath,
	preferredType
} from "./lib/negotiation";

interface AssetsBinding {
	fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
	ASSETS: AssetsBinding;
}

function appendLink(headers: Headers, value: string): void {
	const existing = headers.get("link");
	headers.set("Link", existing ? `${existing}, ${value}` : value);
}

function withContentSignal(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("Content-Signal", CONTENT_SIGNAL);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

function createMarkdownResponse(response: Response, url: URL): Response {
	const headers = new Headers(response.headers);
	headers.set("Content-Type", "text/markdown; charset=utf-8");
	headers.set("Cache-Control", "private, no-store");
	appendVaryAccept(headers);
	appendLink(
		headers,
		`<${url.pathname}>; rel="alternate"; type="${HTML_TYPE}"`
	);

	const contentLength = headers.get("content-length");
	if (contentLength) {
		const tokens = Math.ceil(Number(contentLength) / 4);
		if (Number.isFinite(tokens)) {
			headers.set("X-Markdown-Tokens", String(tokens));
		}
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

function notAcceptable(): Response {
	const headers = new Headers({
		"Content-Type": "text/plain; charset=utf-8"
	});
	appendVaryAccept(headers);

	return new Response(
		`Not Acceptable\n\nAvailable: ${HTML_TYPE}, ${MARKDOWN_TYPE}\n`,
		{ status: 406, headers }
	);
}

function shouldNegotiate(request: Request, pathname: string): boolean {
	return (
		(request.method === "GET" || request.method === "HEAD") &&
		isNegotiablePath(pathname)
	);
}

function trailingSlashRedirect(url: URL): Response {
	const redirectUrl = new URL(url);
	redirectUrl.pathname = pagePath(url.pathname);

	return new Response(null, {
		status: 308,
		headers: { Location: redirectUrl.toString() }
	});
}

async function serveMarkdown(
	request: Request,
	url: URL,
	env: Env
): Promise<Response | null> {
	const markdownUrl = new URL(url);
	markdownUrl.pathname = markdownPath(url.pathname);

	const markdownResponse = await env.ASSETS.fetch(
		new Request(markdownUrl, request)
	);

	if (markdownResponse.status !== 200) return null;
	return createMarkdownResponse(markdownResponse, url);
}

async function appendMarkdownAlternate(
	response: Response,
	url: URL,
	env: Env
): Promise<void> {
	if (!response.headers.get("content-type")?.includes("text/html")) return;

	const markdownUrl = new URL(url);
	markdownUrl.pathname = markdownPath(url.pathname);

	const probe = await env.ASSETS.fetch(
		new Request(markdownUrl, { method: "HEAD" })
	);

	if (probe.status === 200) {
		appendLink(
			response.headers,
			`<${markdownUrl.pathname}>; rel="alternate"; type="${MARKDOWN_TYPE}"`
		);
	}
}

async function serveNegotiated(
	request: Request,
	url: URL,
	env: Env,
	choice: { accept: string | null; chosen: NegotiableType }
): Promise<Response> {
	const { accept, chosen } = choice;

	if (chosen === MARKDOWN_TYPE) {
		const markdownResponse = await serveMarkdown(request, url, env);
		if (markdownResponse) return markdownResponse;
	}

	const htmlUrl = new URL(url);
	htmlUrl.pathname = pagePath(url.pathname);
	const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl, request));
	const response = withContentSignal(
		new Response(htmlResponse.body, {
			status: htmlResponse.status,
			statusText: htmlResponse.statusText,
			headers: new Headers(htmlResponse.headers)
		})
	);
	appendVaryAccept(response.headers);

	if (htmlResponse.status !== 200) return response;

	if (chosen === MARKDOWN_TYPE && !preferredType(accept, [HTML_TYPE])) {
		return notAcceptable();
	}

	await appendMarkdownAlternate(response, url, env);
	return response;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (!shouldNegotiate(request, url.pathname)) {
			return withContentSignal(await env.ASSETS.fetch(request));
		}

		if (url.pathname !== "/" && url.pathname.endsWith("/")) {
			return withContentSignal(trailingSlashRedirect(url));
		}

		const accept = request.headers.get("accept");
		const chosen = preferredType(accept, [HTML_TYPE, MARKDOWN_TYPE]);
		if (chosen === null) return withContentSignal(notAcceptable());

		return withContentSignal(
			await serveNegotiated(request, url, env, { accept, chosen })
		);
	}
};
