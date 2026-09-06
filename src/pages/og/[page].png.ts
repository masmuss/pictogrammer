import type { APIContext } from "astro";
import siteConfig from "@/config/site";
import { createOgImageResponse, getAuthorInitials } from "@/lib/utils/og";

export const prerender = true;

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
		authorInitials: getAuthorInitials(siteConfig.author),
		domain: "khoirul.me"
	});
}
