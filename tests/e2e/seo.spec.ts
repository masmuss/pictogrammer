import { expect, test } from "@playwright/test";

/**
 * Detailed SEO and Global Meta Tag validation.
 */
test.describe("SEO and Meta Tags", () => {
	test("homepage has correct SEO meta tags", async ({ page }) => {
		await page.goto("/");

		// Primary Meta Tags (Title & Description)
		await expect(page).toHaveTitle(/pictogrammer/);
		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveAttribute("content", /Khoirul/);

		// Canonical URL Verification (Ensures it matches the domain defined in astro.config.ts)
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute("href", "https://khoirul.me/");

		// Open Graph Tags Validation
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			"content",
			"website"
		);
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			"content",
			/pictogrammer/
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			"content",
			/og\.png/
		);

		// Twitter Card Tags Validation
		await expect(page.locator('meta[property="twitter:card"]')).toHaveAttribute(
			"content",
			"summary_large_image"
		);
	});

	test("blog post has article SEO metadata and JSON-LD", async ({ page }) => {
		await page.goto("/blog/reflections/tiga-tahun-blog-ini");

		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			"content",
			"article"
		);
		await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
			"content",
			"https://khoirul.me/blog/reflections/tiga-tahun-blog-ini"
		);
		await expect(
			page.locator('meta[property="article:published_time"]')
		).toHaveAttribute("content", /^\d{4}-\d{2}-\d{2}T/);
		await expect(
			page.locator('meta[property="twitter:url"]')
		).toHaveAttribute(
			"content",
			"https://khoirul.me/blog/reflections/tiga-tahun-blog-ini"
		);

		const jsonLd = page.locator('script[type="application/ld+json"]').first();
		await expect(jsonLd).toBeAttached();
		const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
		const articleSchema = schema["@graph"].find(
			(item: { ["@type"]?: string }) => item["@type"] === "BlogPosting"
		);
		expect(articleSchema).toBeDefined();
		expect(articleSchema.mainEntityOfPage["@id"]).toBe(
			"https://khoirul.me/blog/reflections/tiga-tahun-blog-ini"
		);
	});

	test("favicon and manifest links are present", async ({ page }) => {
		await page.goto("/");

		// Verify presence of core site icons and manifest
		await expect(page.locator('link[rel="icon"]').first()).toBeAttached();
		await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
			"href",
			"/favicon/site.webmanifest"
		);
	});

	test("RSS feed link is present", async ({ page }) => {
		await page.goto("/");

		// Verify that the RSS feed is linked correctly in the head
		await expect(
			page.locator('link[type="application/rss+xml"]')
		).toHaveAttribute("href", "/rss.xml");
	});
});
