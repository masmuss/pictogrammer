import { expect, test } from "@playwright/test";

/**
 * Visual Regression Tests (Snapshot Testing).
 * Compares the current page render against stored master images.
 * Uses a small threshold to account for minor rendering differences between OSs.
 */
test.describe("Visual Regression", () => {
	const pagesToSnapshot = [
		{ name: "Homepage", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Blog Index", path: "/blog" },
		{ name: "Projects", path: "/projects" }
	];

	for (const pageInfo of pagesToSnapshot) {
		test(`page "${pageInfo.name}" should match stored snapshot`, async ({
			page
		}) => {
			await page.goto(pageInfo.path);

			// Wait for the page to be fully loaded and settled
			await page.waitForLoadState("networkidle");

			await page.addStyleTag({
				content: `
          *, *::before, *::after {
            transition-duration: 0s !important;
            animation-duration: 0s !important;
            transition-delay: 0s !important;
            animation-delay: 0s !important;
          }
          .fade-up-section {
              opacity: 1 !important;
              transform: none !important;
          }
          /* Stabilize typography for cross-platform consistency */
          body {
            -webkit-font-smoothing: none !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeSpeed !important;
          }
          /* Force consistent line-height to prevent height accumulation differences */
          p, span, h1, h2, h3, h4, a {
            line-height: 1.5 !important;
          }
        `
			});

			// Take a full page screenshot and compare it.
			// We use a specific name to keep it organized.
			await expect(page).toHaveScreenshot(
				`${pageInfo.name.toLowerCase()}.png`,
				{
					fullPage: true,
					// Mask elements that are known to be unstable or huge font sizes
					mask: [
						page.locator('section div:has-text("20")'), // Mask the year background numbers
						page.locator("#giscus-container"), // Mask giscus if it exists
						page.locator('section:has(h2:has-text("Contribution Activity"))'), // Mask GitHub Calendar (dynamic data)
						page.locator('aside:has-text("Current Work")') // Mask current work (prone to change)
					],
					// Account for minor anti-aliasing differences between Mac and Linux
					maxDiffPixelRatio: 0.05,
					threshold: 0.2
				}
			);
		});
	}
});
