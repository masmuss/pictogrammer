/**
 * MCP Server Card (SEP-1649)
 * https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127
 *
 * Serves /.well-known/mcp/server-card.json advertising this site's
 * MCP capabilities to AI agents and orchestrators.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const serverCard = {
		schema_version: "1.0",
		serverInfo: {
			name: "khoirul.me",
			displayName: "Khoirul Fattah — Personal Website",
			version: "2.3.0",
			description:
				"Personal website of Khoirul Fattah: full-stack projects with a backend focus, technical writing, and photography from Surabaya.",
			contact: {
				email: "hello@khoirul.me",
				url: "https://khoirul.me/about"
			},
			license: {
				name: "MIT",
				url: "https://github.com/masmuss/pictogrammer/blob/main/LICENSE"
			}
		},
		resources: [
			{
				name: "llms-txt",
				description: "LLMs.txt machine-readable site overview",
				url: "https://khoirul.me/llms.txt",
				mimeType: "text/plain"
			},
			{
				name: "rss-feed",
				description: "RSS feed for all blog posts",
				url: "https://khoirul.me/rss.xml",
				mimeType: "application/rss+xml"
			},
			{
				name: "api-catalog",
				description: "RFC 9727 API catalog (application/linkset+json)",
				url: "https://khoirul.me/.well-known/api-catalog",
				mimeType: "application/linkset+json"
			},
			{
				name: "ard-catalog",
				description: "Agentic Resource Discovery manifest",
				url: "https://khoirul.me/.well-known/ai-catalog.json",
				mimeType: "application/json"
			}
		],
		capabilities: {
			resources: true,
			tools: false,
			prompts: false
		}
	};

	return new Response(JSON.stringify(serverCard, null, 2), {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=3600"
		}
	});
};
