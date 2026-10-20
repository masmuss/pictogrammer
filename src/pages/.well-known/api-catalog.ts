/**
 * RFC 9727: API Catalog
 * https://www.rfc-editor.org/rfc/rfc9727
 *
 * Serves /.well-known/api-catalog with application/linkset+json,
 * advertising available APIs and machine-readable resources on this site.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const catalog = {
		linkset: [
			{
				anchor: "https://khoirul.me",
				// llms.txt: human+AI-readable site overview
				describedby: [
					{
						href: "https://khoirul.me/llms.txt",
						type: "text/plain"
					},
					{
						href: "https://khoirul.me/llms-full.txt",
						type: "text/plain"
					}
				],
				// RSS feed
				alternate: [
					{
						href: "https://khoirul.me/rss.xml",
						type: "application/rss+xml"
					}
				],
				// Sitemap
				"https://www.iana.org/assignments/relation/sitemap": [
					{
						href: "https://khoirul.me/sitemap-index.xml"
					}
				]
			},
			{
				anchor: "https://khoirul.me/blog",
				"service-doc": [
					{
						href: "https://khoirul.me/llms.txt",
						type: "text/plain"
					}
				]
			}
		]
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			"Content-Type": "application/linkset+json",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=3600"
		}
	});
};
