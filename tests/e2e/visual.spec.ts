import { expect, test } from "@playwright/test";

/**
 * Visual Regression Tests (Snapshot Testing).
 * Compares the current page render against stored master images.
 * Uses a small threshold to account for minor rendering differences between OSs.
 */
test.describe("Visual Regression - Pages", () => {
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
			await page.waitForLoadState("domcontentloaded");

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
            font-family: Arial, sans-serif !important; /* Use a common font */
          }
          /* Force consistent line-height to prevent height accumulation differences */
          p, span, h1, h2, h3, h4, a, li {
            line-height: 1.5 !important;
            letter-spacing: normal !important;
          }
        `
			});

			// Take a full page screenshot and compare it.
			await expect(page).toHaveScreenshot(
				`${pageInfo.name.toLowerCase()}.png`,
				{
					fullPage: true,
					mask: [
						page.locator('section div:has-text("20")'), // Mask the year background numbers
						page.locator("#giscus-container"), // Mask giscus
						page.locator('section:has(h2:has-text("Contribution Activity"))'), // Mask GitHub Calendar
						page.locator('aside:has-text("Current Work")') // Mask current work
					],
					maxDiffPixelRatio: 0.3, // High tolerance for full pages
					threshold: 0.3
				}
			);
		});
	}
});

test.describe("Visual Regression - Atomic Components", () => {
	const components = [
		{ name: "Hero", path: "/", selector: '[data-testid="hero-section"]' },
		{ name: "About Text", path: "/", selector: '[data-testid="about-text"]' },
		{
			name: "Featured Project",
			path: "/",
			selector: '[data-testid="featured-project-item"]'
		},
		{
			name: "Experience Item",
			path: "/about",
			selector: '[data-testid="experience-item"]'
		},
		{
			name: "Education Item",
			path: "/about",
			selector: '[data-testid="education-item"]'
		},
		{
			name: "Certification Item",
			path: "/about",
			selector: '[data-testid="certification-item"]'
		},
		{
			name: "Post Preview",
			path: "/",
			selector: '[data-testid="post-preview"]'
		},
		{
			name: "Series Item",
			path: "/blog/series",
			selector: '[data-testid="series-item"]'
		},
		{ name: "Tool Item", path: "/tools", selector: '[data-testid="tool-item"]' }
	];

	for (const comp of components) {
		test(`component "${comp.name}" should match stored snapshot`, async ({
			page
		}) => {
			await page.goto(comp.path);
			await page.waitForLoadState("domcontentloaded");

			// Stabilize animations and fonts
			await page.addStyleTag({
				content: `
          .fade-up-section {
              opacity: 1 !important;
              transform: none !important;
              transition: none !important;
          }
          body, * {
            font-family: Arial, sans-serif !important;
            letter-spacing: normal !important;
          }
        `
			});

			const element = page.locator(comp.selector).first();
			await expect(element).toBeVisible();

			await expect(element).toHaveScreenshot(
				`comp-${comp.name.toLowerCase().replace(/\s+/g, "-")}.png`,
				{
					maxDiffPixelRatio: 0.1, // Relaxed for components
					threshold: 0.2
				}
			);
		});
	}
});
