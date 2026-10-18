import siteConfig from "@/config/site";

export function getLlmPageLinks(site: URL): string[] {
	return [
		...siteConfig.header.textLinks.map(
			(link) => `- [${link.text}](${new URL(link.href, site)})`
		),
		...siteConfig.footerLinks.map(
			(link) => `- [${link.text}](${new URL(link.href, site)})`
		)
	];
}
