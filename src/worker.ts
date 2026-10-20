import { CONTENT_SIGNAL } from "./config/content-signal";
import {
	appendVaryAccept,
	HTML_TYPE,
	isNegotiablePath,
	MARKDOWN_TYPE,
	markdownPath,
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

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (
			(request.method !== "GET" && request.method !== "HEAD") ||
			!isNegotiablePath(url.pathname)
		) {
			return withContentSignal(await env.ASSETS.fetch(request));
		}

		if (url.pathname !== "/" && url.pathname.endsWith("/")) {
			const redirectUrl = new URL(url);
			redirectUrl.pathname = pagePath(url.pathname);

			return withContentSignal(
				new Response(null, {
					status: 308,
					headers: { Location: redirectUrl.toString() }
				})
			);
		}

		const accept = request.headers.get("accept");
		const chosen = preferredType(accept, [HTML_TYPE, MARKDOWN_TYPE]);

		if (chosen === null) return withContentSignal(notAcceptable());

		if (chosen === MARKDOWN_TYPE) {
			const markdownUrl = new URL(url);
			markdownUrl.pathname = markdownPath(url.pathname);

			const markdownResponse = await env.ASSETS.fetch(
				new Request(markdownUrl, request)
			);

			if (markdownResponse.status === 200) {
				return withContentSignal(createMarkdownResponse(markdownResponse, url));
			}
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
			return withContentSignal(notAcceptable());
		}

		if (response.headers.get("content-type")?.includes("text/html")) {
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

		return response;
	}
};
