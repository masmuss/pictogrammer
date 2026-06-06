import { expect, test } from "@playwright/test";

/**
 * Basic E2E tests for the homepage and core global site features.
 */
test("homepage has correct title and brand", async ({ page }) => {
	await page.goto("/");

	// Verify the page title contains the brand name
	await expect(page).toHaveTitle(/pictogrammmer/);

	// Ensure author name is present on the page
	const bodyText = await page.textContent("body");
	expect(bodyText).toContain("Khoirul");
});

test("navigation to blog works", async ({ page }) => {
	await page.goto("/");

	// Click the "Blog" link in the navigation bar
	await page.click("nav >> text=Blog");

	// Verify that the URL has changed to the blog index
	await expect(page).toHaveURL(/\/blog/);
});

test("404 page shows correct content", async ({ page }) => {
	await page.goto("/non-existent-page");

	// Verify that the 404 heading is visible
	await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
	await expect(page.getByText("Frame Not Found")).toBeVisible();

	// Verify navigation link cards are visible
	await expect(page.locator("a[href='/'] h3").first()).toBeVisible();
	await expect(page.locator("a[href='/blog'] h3").first()).toBeVisible();
});

test("theme toggle changes mode", async ({ page }) => {
	await page.goto("/");

	const html = page.locator("html");

	// Locate the first dark mode toggle button (handles desktop/mobile duplicates)
	const toggle = page.locator('button[aria-label="Toggle Dark Mode"]').first();

	// Capture the initial theme state
	const isInitiallyDark = await html.evaluate((el) =>
		el.classList.contains("dark")
	);

	await toggle.click();

	// Verify that the 'dark' class was toggled on the <html> element
	if (isInitiallyDark) {
		await expect(html).not.toHaveClass(/dark/);
	} else {
		await expect(html).toHaveClass(/dark/);
	}
});

test("search modal supports open, close, no-results, and keyboard navigation", async ({
	page
}) => {
	await page.goto("/");

	const searchTrigger = page.getByRole("button", { name: "Search" });
	await searchTrigger.click();

	const modal = page.getByRole("dialog", { name: "Search" });
	await expect(modal).toBeVisible();

	const searchInput = page.getByPlaceholder("Search articles, projects...");
	await expect(searchInput).toBeFocused();

	await page.keyboard.press("Escape");
	await expect(modal).not.toBeVisible();

	await page.keyboard.press("ControlOrMeta+KeyK");
	await expect(modal).toBeVisible();

	await searchInput.fill("zzzzzzzz-no-match-987654321");
	await expect(page.getByText(/No results for/)).toBeVisible();

	await searchInput.fill("Ahmad Musafir");
	await expect(page.getByText(/\d+ results found/)).toBeVisible();

	const initialURL = page.url();
	// Click on the first search result item to navigate
	const firstResult = modal.getByTestId("search-result").first();
	await firstResult.click();

	// Verify navigation occurred by checking that the URL changed
	await page.waitForURL((url) => url.href !== initialURL);
	expect(page.url()).not.toBe(initialURL);
});
