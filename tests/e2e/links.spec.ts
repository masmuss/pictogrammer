import { expect, test } from "@playwright/test";

/**
 * Internal Link Integrity Test.
 * Ensures that all internal links on the homepage lead to valid pages (status 2xx or 3xx).
 */
test.describe("Link Integrity", () => {
	test("all internal links on the homepage should be valid", async ({
		page,
		request,
	}) => {
		await page.goto("/");

		// 1. Collect all anchor tags
		const anchors = page.locator("a");
		const allLinks = await anchors.all();

		// 2. Filter for unique internal links
		const internalLinks = new Set<string>();

		for (const link of allLinks) {
			const href = await link.getAttribute("href");

			if (href) {
				// We only care about internal links
				// Ignore external URLs, mailto, tel, and anchor fragments
				if (href.startsWith("/") && !href.startsWith("//")) {
					internalLinks.add(href);
				} else if (href.startsWith("https://khoirul.me")) {
					const path = href.replace("https://khoirul.me", "");
					internalLinks.add(path || "/");
				}
			}
		}

		console.log(`Found ${internalLinks.size} unique internal links to check.`);

		// 3. Check each internal link for a valid response
		const linkChecks = Array.from(internalLinks).map(async (path) => {
			// We use the 'request' object for faster checking (no full page render)
			const response = await request.get(path);

			// Expect 2xx (OK) or 3xx (Redirect) status codes
			if (!response.ok() && response.status() !== 304) {
				console.error(
					`Broken link found: ${path} returned status ${response.status()}`,
				);
			}

			expect(
				response.status(),
				`Link "${path}" should not be broken`,
			).toBeLessThan(400);
		});

		await Promise.all(linkChecks);
	});
});
