import type { APIContext } from "astro";

export function GET(context: APIContext) {
	const site = context.site ?? new URL("https://khoirul.me");
	const robots = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${new URL("sitemap-index.xml", site).href}`
	].join("\n");

	return new Response(robots, {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
