import siteConfig from "@/config/site-config";
import { createOgImageResponse } from "@/lib/utils/og-image";

export const prerender = true;

const authorInitials = siteConfig.author
	.split(" ")
	.filter((_, i, arr) => i === 0 || i === arr.length - 1)
	.map((n) => n[0])
	.join("");

export async function GET() {
	return createOgImageResponse({
		title: siteConfig.title,
		description: siteConfig.description,
		author: siteConfig.author,
		authorInitials,
		domain: "khoirul.me"
	});
}
