import { expect, test } from "@playwright/test";

test.describe("Markdown content", () => {
	test("page advertises a Markdown alternate and serves it", async ({
		page,
		request
	}) => {
		await page.goto("/about");

		const alternate = page.locator(
			'link[rel="alternate"][type="text/markdown"]'
		);
		await expect(alternate).toHaveAttribute("href", "/about/index.md");

		const response = await request.get("/about/index.md");
		expect(response.ok()).toBeTruthy();

		const markdown = await response.text();
		expect(markdown).toContain('url: "https://khoirul.me/about"');
		expect(markdown).toContain("# About Me");
	});

	test("blog posts include their title in the Markdown alternate", async ({
		request
	}) => {
		const response = await request.get(
			"/blog/series/becoming-astron/island-architecture-praktik/index.md"
		);
		expect(response.ok()).toBeTruthy();

		const markdown = await response.text();
		expect(markdown).toContain('title: "Becoming Astron #14');
		expect(markdown).toContain("# Becoming Astron #14");
	});

	test("llms.txt documents Markdown negotiation", async ({ request }) => {
		const response = await request.get("/llms.txt");
		expect(response.ok()).toBeTruthy();

		expect(await response.text()).toContain("Accept: text/markdown");
	});
});
