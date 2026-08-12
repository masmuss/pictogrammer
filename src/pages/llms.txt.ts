import type { APIContext } from "astro";
import siteConfig from "@/config/site-config";
import { getAllPosts } from "@/lib/contents";
import { getPostUrl } from "@/lib/utils/post-route";

export async function GET(context: APIContext) {
	const site = context.site ?? new URL(siteConfig.homepage);
	const posts = await getAllPosts();

	const lines: string[] = [
		`# ${siteConfig.title}`,
		`> ${siteConfig.description}`,
		"",
		"## Pages",
		...siteConfig.header.textLinks.map(
			(link) => `- [${link.text}](${new URL(link.href, site)})`
		),
		...siteConfig.header.iconLinks
			.slice(0, 3)
			.map((link) => `- [${link.text}](${new URL(link.href, site)})`),
		"",
		`## Posts (${posts.length})`,
		...posts.map((post) => {
			const url = new URL(getPostUrl(post), site).href;
			return `- [${post.data.title}](${url}): ${post.data.description}`;
		})
	];

	return new Response(lines.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
