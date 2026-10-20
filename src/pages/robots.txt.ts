import type { APIContext } from "astro";

export function GET(context: APIContext) {
	const site = context.site ?? new URL("https://khoirul.me");
	const robots = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${new URL("sitemap-index.xml", site).href}`,
		"",
		"# Content Signals (https://contentsignals.org/)",
		"# This site's content is available for search indexing but not for AI training",
		"# or use as direct AI input/generation context.",
		"Content-Signal: ai-train=no, search=yes, ai-input=no"
	].join("\n");

	return new Response(robots, {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
