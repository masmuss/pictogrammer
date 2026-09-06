import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { parseAndSanitizeMarkdown } from "@/config/rss";
import siteConfig from "@/config/site-config";
import { getPostsByPath } from "@/lib/contents/post";
import { getPostUrl } from "@/lib/utils/post-route";

export async function GET(context: APIContext) {
	const posts = await getPostsByPath();
	const site = context.site ?? new URL("https://khoirul.me");

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: site.toString(),
		items: posts.map((item) => ({
			title: item.data.title,
			description: item.data.description,
			link: new URL(getPostUrl(item), site).toString(),
			pubDate: new Date(item.data.date),
			content: parseAndSanitizeMarkdown(item.body ?? ""),
			author: `${siteConfig.author} <${siteConfig.email}>`,
			categories: item.data.tags
		}))
	});
}
