import type { APIContext } from "astro";
import siteConfig from "@/config/site-config";
import { createOgImageResponse } from "@/lib/utils/og-image";

export const prerender = true;

const authorInitials = siteConfig.author
	.split(" ")
	.filter((_, i, arr) => i === 0 || i === arr.length - 1)
	.map((n) => n[0])
	.join("");

export async function getStaticPaths() {
	return Object.entries(siteConfig.ogPages).map(([page, og]) => ({
		params: { page },
		props: og
	}));
}

export async function GET({ props }: APIContext) {
	const { title, description } = props as {
		title: string;
		description: string;
	};

	return createOgImageResponse({
		title,
		description,
		author: siteConfig.author,
		authorInitials,
		domain: "khoirul.me"
	});
}
