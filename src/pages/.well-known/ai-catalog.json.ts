/**
 * ARD (Agentic Resource Discovery) manifest
 * https://agenticresourcediscovery.org/
 * https://github.com/Agent-Card/ai-catalog
 *
 * Serves /.well-known/ai-catalog.json so AI agents can discover
 * this site's capabilities and key resources.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const catalog = {
		specVersion: "0.1",
		host: {
			name: "khoirul.me",
			displayName: "Khoirul Fattah — Personal Website",
			description:
				"Personal website of Khoirul Fattah: full-stack projects with a backend focus, technical writing, and photography from Surabaya.",
			url: "https://khoirul.me",
			contact: "hello@khoirul.me"
		},
		entries: [
			{
				id: "urn:air:khoirul.me:content:llms-txt",
				displayName: "LLMs.txt Site Overview",
				description:
					"Machine-readable overview of this site for LLMs and AI agents, including all pages and posts.",
				type: "text/plain",
				url: "https://khoirul.me/llms.txt",
				representativeQueries: [
					"Who is Khoirul Fattah?",
					"What does Khoirul write about?",
					"List all blog posts on khoirul.me",
					"What projects has Khoirul built?",
					"What is pictogrammer?"
				]
			},
			{
				id: "urn:air:khoirul.me:content:llms-full-txt",
				displayName: "LLMs-Full.txt Detailed Content",
				description:
					"Full-content version of the site overview for LLMs, including complete post bodies.",
				type: "text/plain",
				url: "https://khoirul.me/llms-full.txt",
				representativeQueries: [
					"Full content of all blog posts by Khoirul Fattah",
					"Complete technical writing by Khoirul",
					"Detailed project descriptions from khoirul.me"
				]
			},
			{
				id: "urn:air:khoirul.me:feed:rss",
				displayName: "RSS Feed",
				description: "RSS feed for all blog posts on khoirul.me.",
				type: "application/rss+xml",
				url: "https://khoirul.me/rss.xml",
				representativeQueries: [
					"Latest posts from khoirul.me",
					"Subscribe to Khoirul's blog",
					"RSS feed for pictogrammer"
				]
			},
			{
				id: "urn:air:khoirul.me:discovery:api-catalog",
				displayName: "API Catalog",
				description:
					"RFC 9727 API catalog listing all machine-readable resources.",
				type: "application/linkset+json",
				url: "https://khoirul.me/.well-known/api-catalog",
				representativeQueries: [
					"What APIs does khoirul.me expose?",
					"Machine-readable resources on khoirul.me"
				]
			},
			{
				id: "urn:air:khoirul.me:discovery:sitemap",
				displayName: "Sitemap",
				description: "XML sitemap listing all pages on khoirul.me.",
				type: "application/xml",
				url: "https://khoirul.me/sitemap-index.xml",
				representativeQueries: [
					"All pages on khoirul.me",
					"Site structure of khoirul.me"
				]
			}
		]
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=3600"
		}
	});
};
