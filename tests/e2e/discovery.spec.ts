import { expect, test } from "@playwright/test";

/**
 * Tests for site discovery features (RSS and Sitemap).
 * Ensures that the site is properly indexable and provides valid feeds.
 */
test.describe("Discovery Features", () => {
	test("RSS feed should be valid and contain posts", async ({ request }) => {
		// We use 'request' to fetch the XML directly and check its content
		const response = await request.get("/rss.xml");
		expect(response.ok()).toBeTruthy();

		const text = await response.text();

		// 1. Check for basic RSS structure
		expect(text).toContain("<rss");
		expect(text).toContain("<channel>");

		// 2. Check for site-specific info
		expect(text).toContain("pictogrammer");

		// 3. Ensure it contains at least one item (blog post)
		expect(text).toContain("<item>");
		expect(text).toContain("<title>");
		expect(text).toContain("<link>");
	});

	test("Sitemap should be valid and accessible", async ({ request }) => {
		// Astro usually generates a sitemap-index.xml or sitemap-0.xml
		const response = await request.get("/sitemap-index.xml");

		// If sitemap integration is active, this should return 200
		expect(response.ok()).toBeTruthy();

		const text = await response.text();

		// Check for standard sitemap structure
		expect(text).toContain("<sitemapindex");
		expect(text).toContain("<loc>");

		// Check if it points to a sub-sitemap (common in Astro)
		expect(text).toContain("sitemap-0.xml");

		// Verify the sub-sitemap content if possible
		const subSitemapResponse = await request.get("/sitemap-0.xml");
		if (subSitemapResponse.ok()) {
			const subText = await subSitemapResponse.text();
			expect(subText).toContain("<urlset");
			// Ensure main site links are present
			expect(subText).toContain("https://khoirul.me");
			expect(subText).toContain("/blog");
		}
	});
});
