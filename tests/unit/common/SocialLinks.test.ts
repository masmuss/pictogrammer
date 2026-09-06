import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import SocialLinks from "@/components/common/SocialLinks.astro";
import siteConfig from "@/config/site";

test("SocialLinks renders all links from siteConfig", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(SocialLinks);

	// Check is all social media link texts are present in the HTML (as aria-label or sr-only)
	for (const link of siteConfig.socialLinks) {
		expect(result).toContain(link.text);
		expect(result).toContain(link.href);
	}
});

test("SocialLinks shows email when showEmail prop is true", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(SocialLinks, {
		props: { showEmail: true }
	});

	expect(result).toContain(`mailto:${siteConfig.email}`);
	expect(result).toContain("Email");
});

test("SocialLinks does not show email by default", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(SocialLinks);

	expect(result).not.toContain(`mailto:${siteConfig.email}`);
});

test("SocialLinks applies variant button correctly", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(SocialLinks, {
		props: { variant: "button" }
	});

	// Component Button with variant button will have data-variant="outline" (based on logic in SocialLinks.astro)
	expect(result).toContain('data-variant="outline"');
});
