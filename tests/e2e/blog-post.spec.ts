import { expect, test } from "@playwright/test";

/**
 * E2E tests for the Blog Post detail page.
 * Verifies content rendering, Table of Contents functionality, and navigation features.
 */
test.describe("Blog Post Details", () => {
	// Set a longer timeout due to build and navigation overhead
	test.setTimeout(60000);

	test("should load a blog post and its features", async ({ page }) => {
		// 1. Navigate to the blog index page
		await page.goto("/blog");

		// 2. Select the first blog post link from the list
		const firstPostLink = page.locator("[data-testid='post-preview'] a").first();
		await expect(firstPostLink).toBeVisible({ timeout: 15000 });

		// Capture the target URL for validation
		const targetUrl = await firstPostLink.getAttribute("href");
		console.log("Navigating to post:", targetUrl);

		// Click the link and wait for the URL to change to the detail page
		if (targetUrl) {
			await Promise.all([
				page.waitForURL(`**${targetUrl}`, {
					timeout: 15000,
					waitUntil: "domcontentloaded"
				}),
				firstPostLink.click()
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

		// 4. Verify Table of Contents (TOC) - Wide screens only
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.waitForTimeout(2000); // Wait for TOC hydration

		const toc = page.locator(".toc-container");
		if (await toc.isVisible()) {
			const toggle = page.locator("#toc-toggle");
			await expect(toggle).toBeVisible();
			await toggle.click();

			// Verify TOC list visibility after toggle
			await expect(page.locator("#toc-list")).toBeVisible();
		}

		// 5. Verify "Back to Top" button functionality
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
});
