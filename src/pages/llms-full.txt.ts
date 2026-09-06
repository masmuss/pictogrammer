import type { APIContext } from "astro";
import siteConfig from "@/config/site";
import { getAllPosts } from "@/lib/contents";
import { getPostUrl } from "@/lib/utils/post-route";

export async function GET(context: APIContext) {
	const site = context.site ?? new URL(siteConfig.homepage);
	const posts = await getAllPosts();

	const lines: string[] = [
		`# ${siteConfig.title} — Full Content`,
		"",
		`> ${siteConfig.description}`,
		"",
		`**Author:** ${siteConfig.author}`,
		`**Email:** ${siteConfig.email}`,
		`**CV:** ${siteConfig.cvLink}`,
		"",
		"## Pages",
		...siteConfig.header.textLinks.map(
			(link) => `- [${link.text}](${new URL(link.href, site)})`
		),
		...siteConfig.header.iconLinks
			.slice(0, 3)
			.map((link) => `- [${link.text}](${new URL(link.href, site)})`),
		"",
		"## Social Links",
		...siteConfig.socialLinks.map((link) => `- ${link.text}: ${link.href}`),
		"",
		"---",
		"",
		`## All Posts (${posts.length})`,
		""
	];

	for (const post of posts) {
		const url = new URL(getPostUrl(post), site).href;
		const date = post.data.date.toISOString().split("T")[0];
		const updated = post.data.updatedDate
			? ` (updated ${post.data.updatedDate.toISOString().split("T")[0]})`
			: "";

		lines.push(
			`### ${post.data.title}`,
			"",
			`- **URL:** ${url}`,
			`- **Date:** ${date}${updated}`,
			post.data.tags ? `- **Tags:** ${post.data.tags.join(", ")}` : "",
			"",
			post.data.description ?? "",
			"",
			"---",
			""
		);
	}

	return new Response(lines.join("\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
