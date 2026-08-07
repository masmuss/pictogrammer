import { expect, test } from "@playwright/test";

/**
 * Table-Driven Test data for main site pages.
 * Includes path and expected primary heading for each page.
 */
const mainPages = [
	{ name: "About", path: "/about", expectedHeading: "About" },
	{ name: "Projects", path: "/projects", expectedHeading: "Projects" },
	{ name: "Tools", path: "/tools", expectedHeading: "Tools" },
	{ name: "Blog Index", path: "/blog", expectedHeading: "Blog" },
	{ name: "Notes", path: "/blog/notes", expectedHeading: "Notes" },
	{
		name: "Reflections",
		path: "/blog/reflections",
		expectedHeading: "Reflections"
	},
	{ name: "Tags Index", path: "/tags", expectedHeading: "Tags" },
	{ name: "Now", path: "/now", expectedHeading: "Now" },
	{ name: "Colophon", path: "/colophon", expectedHeading: "Colophon" }
];

/**
 * Sanity and SEO checks for all top-level main pages.
 * Ensures pages load, contain correct headings, and meet basic SEO requirements.
 */
test.describe("Main Pages Sanity & SEO Check", () => {
	for (const pageInfo of mainPages) {
		test(`page "${pageInfo.name}" should have correct content and SEO`, async ({
			page
		}) => {
			await page.goto(pageInfo.path);

			// 1. Content Verification
			await expect(page.locator("header")).toBeVisible();
			const heading = page.locator("h1, h2").first();
			await expect(heading).toContainText(
				new RegExp(pageInfo.expectedHeading, "i")
			);

			// 2. SEO Verification
			// Verify that the page title contains the expected heading
			await expect(page).toHaveTitle(new RegExp(pageInfo.expectedHeading, "i"));

			// Ensure meta description is present and of sufficient length
			const description = page.locator('meta[name="description"]');
			await expect(description).toHaveAttribute("content", /.{30,}/);

			// Ensure Canonical URL points to the production domain
			const canonical = page.locator('link[rel="canonical"]');
			await expect(canonical).toHaveAttribute("href", /https:\/\/khoirul\.me/);

			// Ensure footer is rendered, indicating the page reached the end
			await expect(page.locator("footer")).toBeVisible();
		});
	}
});

/**
 * Verifies that clicking an individual tag leads to a valid tag detail page.
 */
test("individual tag page should load and have SEO", async ({ page }) => {
	await page.goto("/tags");

	// Select the first available tag link
	const firstTag = page.locator('main a[href^="/tags/"]').first();
	if (await firstTag.isVisible()) {
		const rawTagName = await firstTag.textContent();
		// Clean the tag name by removing symbols and post counts (e.g., "#tech 32" -> "tech")
		const cleanTagName = rawTagName?.replace(/[#\d]/g, "").trim();

		await firstTag.click();

		// Verify the tag detail page heading
		const heading = page.locator("h1, h2").first();
		await expect(heading).toContainText(new RegExp(cleanTagName || "", "i"));

		// Verify tag page SEO
		await expect(page).toHaveTitle(new RegExp(cleanTagName || "", "i"));
		await expect(page.locator('meta[name="description"]')).toBeAttached();
	}
});
