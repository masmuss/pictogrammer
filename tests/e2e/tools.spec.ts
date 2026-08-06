import { expect, test } from "@playwright/test";

test.describe("Tools Page", () => {
	test("should display structured categories and tools", async ({ page }) => {
		await page.goto("/tools");

		// Verify main heading
		await expect(
			page.getByRole("heading", { name: "Tools", level: 1 })
		).toBeVisible();

		// Verify tool categories exist
		const expectedCategories = [
			"Design",
			"Productivity",
			"Development",
			"AI Agents",
			"Workstation"
		];

		for (const category of expectedCategories) {
			await expect(
				page.getByRole("heading", { name: category, level: 2 })
			).toBeVisible();
		}

		// Verify tool entries (using known examples like VS Code, Figma, Notion)
		const expectedTools = ["VS Code", "Figma", "Notion", "Raycast"];

		for (const tool of expectedTools) {
			const toolLink = page.getByRole("heading", { name: tool, level: 3 });
			await expect(toolLink).toBeVisible();
		}

		// Ensure that there are external links for tools (most tools have them)
		const links = page.locator("a[target='_blank']");
		expect(await links.count()).toBeGreaterThan(5);
	});
});
