import siteConfig from "@/config/site-config";
import { createOgImageResponse, getAuthorInitials } from "@/lib/utils/og";

export const prerender = true;

export async function GET() {
	return createOgImageResponse({
		title: siteConfig.title,
		description: siteConfig.description,
		author: siteConfig.author,
		authorInitials: getAuthorInitials(siteConfig.author),
		domain: "khoirul.me"
	});
}
