import { expect, test } from "@playwright/test";

/**
 * E2E tests for the Blog Post detail page.
 * Verifies content rendering and navigation features.
 */
test.describe("Blog Post Details", () => {
	// Set a longer timeout due to build and navigation overhead
	test.setTimeout(60000);

	test("should load a blog post and its features", async ({ page }) => {
		// 1. Navigate to the blog index page
		await page.goto("/blog");

		// 2. Select the first blog post link from the list
		const firstPostLink = page
			.locator("[data-testid='post-preview'] a[href^='/blog/']")
			.first();
		await expect(firstPostLink).toBeVisible({ timeout: 15000 });

		// Capture the target URL for validation
		const targetUrl = await firstPostLink.getAttribute("href");
		console.log("Navigating to post:", targetUrl);

		// Click the link and wait for the URL to change to the detail page
		if (targetUrl) {
			await Promise.all([
				page.waitForURL(`**${targetUrl}`, {
					timeout: 15000,
					waitUntil: "domcontentloaded",
				}),
				firstPostLink.click(),
			]);
		} else {
			await firstPostLink.click();
		}

		// Wait for the page to fully load
		await page.waitForLoadState("domcontentloaded");

		// 3. Verify detail page rendering
		// Scroll slightly to handle large images and wait for stability
		await page.evaluate(() => window.scrollTo(0, 500));
		await page.waitForTimeout(1000);

		// Check for the presence of the article tag
		const article = page.locator("article").first();
		await expect(article).toBeVisible({ timeout: 15000 });

		// Ensure the main heading (H1) is visible
		await expect(page.locator("h1").first()).toBeVisible();

		// 4. Verify "Back to Top" button functionality
		// Scroll to the bottom to trigger the button
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(1000);

		const toTopBtn = page.locator("#to-top-btn");
		await expect(toTopBtn).toBeVisible({ timeout: 10000 });

		await toTopBtn.click();

		// Verify scroll returns to the top
		await page.waitForFunction(() => window.scrollY < 100);
		const scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeLessThan(100);
	});

	test("links externally hosted posts directly to their source", async ({
		page,
	}) => {
		await page.goto("/blog");

		const externalPostLink = page.getByRole("link", {
			name: /I Miss Being an Beginner/,
		});
		await expect(externalPostLink).toHaveAttribute(
			"href",
			"https://mkhoirul.substack.com/p/i-miss-being-an-beginner?r=6a8zq1",
		);
		await expect(externalPostLink).toHaveAccessibleName(
			/I Miss Being an Beginner.*External post/,
		);
		await expect(externalPostLink.locator("svg")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	});

	test("keeps a local redirect for externally hosted posts", async ({
		request,
	}) => {
		const response = await request.get(
			"/blog/reflections/i-miss-being-an-beginner",
		);
		const html = await response.text();

		expect(response.status()).toBe(200);
		expect(html).toContain('http-equiv="refresh"');
		expect(html).toContain(
			"https://mkhoirul.substack.com/p/i-miss-being-an-beginner",
		);
	});
});
