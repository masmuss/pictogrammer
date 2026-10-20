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
		"# This site's content is available for search indexing, AI training,",
		"# and use as direct AI input/generation context.",
		"Content-Signal: ai-train=yes, search=yes, ai-input=yes"
	].join("\n");

	return new Response(robots, {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
