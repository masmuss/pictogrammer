import type { APIContext } from "astro";
import { CONTENT_SIGNAL } from "@/config/content-signal";

export function GET(context: APIContext) {
	const site = context.site ?? new URL("https://khoirul.me");
	const robots = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${new URL("sitemap-index.xml", site).href}`,
		"",
		"# Content Signals (https://contentsignals.org/)",
		`Content-Signal: ${CONTENT_SIGNAL}`
	].join("\n");

	return new Response(robots, {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
