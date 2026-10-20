/**
 * Agent Skills Discovery Index
 * https://github.com/cloudflare/agent-skills-discovery-rfc
 * https://agentskills.io/
 *
 * Serves /.well-known/agent-skills/index.json with registered
 * agent skills for this site (RFC v0.2.0 compatible).
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const index = {
		$schema: "https://agentskills.io/schema/v0.2.0/index.json",
		skills: [
			{
				name: "llms-txt",
				type: "llms-txt",
				description:
					"LLMs.txt file providing a machine-readable overview of khoirul.me for AI agents and language models.",
				url: "https://khoirul.me/llms.txt",
				sha256: null
			},
			{
				name: "rss-feed",
				type: "feed",
				description:
					"RSS feed exposing all published blog posts from khoirul.me.",
				url: "https://khoirul.me/rss.xml",
				sha256: null
			},
			{
				name: "api-catalog",
				type: "api-catalog",
				description:
					"RFC 9727 API catalog advertising all machine-readable resources and endpoints on khoirul.me.",
				url: "https://khoirul.me/.well-known/api-catalog",
				sha256: null
			},
			{
				name: "sitemap",
				type: "sitemap",
				description:
					"XML sitemap listing all public pages on khoirul.me.",
				url: "https://khoirul.me/sitemap-index.xml",
				sha256: null
			}
		]
	};

	return new Response(JSON.stringify(index, null, 2), {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=3600"
		}
	});
};
