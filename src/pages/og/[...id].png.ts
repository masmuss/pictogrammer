import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import siteConfig from "@/config/site-config";
import { getReadTimeCount } from "@/lib/contents";
import { createOgImageResponse } from "@/lib/utils/og-image";
import { getPostRouteId } from "@/lib/utils/post-route";

export const prerender = true;

export async function getStaticPaths() {
	const posts = await getCollection("post");
	return posts.map((post) => ({
		params: { id: getPostRouteId(post) },
		props: post
	}));
}

export async function GET({ props }: APIContext) {
	const { title, description, tags, date } = props.data;
	const category = tags?.[0] ?? undefined;
	const readTime = props.body
		? `${getReadTimeCount(props.body)} min read`
		: undefined;
	const authorInitials = siteConfig.author
		.split(" ")
		.filter((_, i, arr) => i === 0 || i === arr.length - 1)
		.map((n) => n[0])
		.join("");

	return createOgImageResponse({
		title,
		description,
		decodeEntities: true,
		category,
		date: new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		}),
		readTime,
		author: siteConfig.author,
		authorInitials,
		domain: "khoirul.me"
	});
}
