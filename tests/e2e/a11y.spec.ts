import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Accessibility (a11y) tests using axe-core.
 * Ensures the site follows WCAG standards for inclusivity.
 */
test.describe("Accessibility Audit", () => {
	const pagesToAudit = [
		{ name: "Homepage", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Blog Index", path: "/blog" },
		{ name: "Projects", path: "/projects" }
	];

	for (const pageInfo of pagesToAudit) {
		test(`page "${pageInfo.name}" should not have automatically detectable accessibility violations`, async ({
			page
		}) => {
			await page.goto(pageInfo.path);

			// Wait for the page to be fully loaded and settled
			await page.waitForLoadState("domcontentloaded");

			// Force visibility and disable animations for consistent audit
			await page.addStyleTag({
				content: `
					.fade-up-section {
						opacity: 1 !important;
						transform: translateY(0) !important;
						transition: none !important;
					}
				`
			});

			// Inject axe-core and run the audit
			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
				.analyze();

			// Expect zero violations
			expect(accessibilityScanResults.violations).toEqual([]);
		});
	}
});

test("individual blog post should be accessible", async ({ page }) => {
	// Navigate to the first blog post found
	await page.goto("/blog");
	const firstPostLink = page.locator("main ul li a").first();
	await firstPostLink.click();

	await page.waitForLoadState("domcontentloaded");

	// Force visibility and disable animations for consistent audit
	await page.addStyleTag({
		content: `
			.fade-up-section {
				opacity: 1 !important;
				transform: translateY(0) !important;
				transition: none !important;
			}
		`
	});

	const accessibilityScanResults = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa"])
		.analyze();

	expect(accessibilityScanResults.violations).toEqual([]);
});
