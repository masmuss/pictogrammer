import type { APIContext } from "astro";
import siteConfig from "@/config/site";
import { getAllPosts } from "@/lib/contents";
import { getLlmPageLinks } from "@/lib/utils/llms";
import { getPostUrl } from "@/lib/utils/post-route";

export async function GET(context: APIContext) {
	const site = context.site ?? new URL(siteConfig.homepage);
	const posts = await getAllPosts();

	const lines: string[] = [
		`# ${siteConfig.title}`,
		`> ${siteConfig.description}`,
		"",
		"## Pages",
		...getLlmPageLinks(site),
		"",
		"## Markdown",
		"Request any page with `Accept: text/markdown` to receive Markdown.",
		"Direct Markdown URLs use the page path plus `/index.md`, for example `/about/index.md`.",
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
