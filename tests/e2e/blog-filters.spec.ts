import { expect, test } from "@playwright/test";

test.describe("Blog Filters and Navigation", () => {
	test("should filter blog posts using tabs", async ({ page }) => {
		await page.goto("/blog");

		// Click the "Notes" tab
		const notesTab = page.getByRole("link", { name: "Notes", exact: true });
		await expect(notesTab).toBeVisible();
		await notesTab.click();

		// URL should change to /blog/notes
		await page.waitForURL(/\/blog\/notes/);
		expect(page.url()).toContain("/blog/notes");

		// Verify active state styling (checking for specific Tailwind active classes or aria-current)
		// Usually active tabs have aria-current="page"
		await expect(notesTab).toHaveAttribute("aria-current", "page");

		// Click the "Reflections" tab
		const reflectionsTab = page.getByRole("link", {
			name: "Reflections",
			exact: true
		});
		await expect(reflectionsTab).toBeVisible();
		await reflectionsTab.click();

		// URL should change to /blog/reflections
		await page.waitForURL(/\/blog\/reflections/);
		expect(page.url()).toContain("/blog/reflections");
		await expect(reflectionsTab).toHaveAttribute("aria-current", "page");
	});
});
