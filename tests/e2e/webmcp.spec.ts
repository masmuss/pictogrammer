import { expect, type Page, test } from "@playwright/test";

const EXPECTED_TOOLS = ["getSiteOverview", "searchPosts"];

function getRegisteredToolNames(page: Page): Promise<string[]> {
	return page.evaluate(() =>
		Array.from(
			(
				window as unknown as {
					__webmcpTools?: Map<string, unknown>;
				}
			).__webmcpTools?.keys() ?? []
		)
	);
}

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		type FakeTool = {
			name: string;
			execute: (
				input: unknown,
				options: { signal: AbortSignal }
			) => Promise<unknown>;
		};

		const registered = new Map<string, FakeTool>();
		(
			window as unknown as { __webmcpTools?: Map<string, FakeTool> }
		).__webmcpTools = registered;

		Object.defineProperty(document, "modelContext", {
			configurable: true,
			value: {
				registerTool: async (
					tool: FakeTool,
					options?: { signal?: AbortSignal }
				) => {
					registered.set(tool.name, tool);
					options?.signal?.addEventListener(
						"abort",
						() => registered.delete(tool.name),
						{ once: true }
					);
				}
			}
		});
	});
});

test("registers tools and re-registers them after client-side navigation", async ({
	page
}) => {
	await page.goto("/");

	await expect
		.poll(() => getRegisteredToolNames(page))
		.toEqual(EXPECTED_TOOLS);

	await page.click("nav >> text=Blog");
	await expect(page).toHaveURL(/\/blog/);

	await expect
		.poll(() => getRegisteredToolNames(page))
		.toEqual(EXPECTED_TOOLS);
});

test("searchPosts returns Pagefind results", async ({ page }) => {
	await page.goto("/");

	await expect
		.poll(() => getRegisteredToolNames(page))
		.toEqual(EXPECTED_TOOLS);

	const results = await page.evaluate(async () => {
		const tools = (
			window as unknown as {
				__webmcpTools?: Map<
					string,
					{
						execute: (
							input: unknown,
							options: { signal: AbortSignal }
						) => Promise<unknown>;
					}
				>;
			}
		).__webmcpTools;
		const tool = tools?.get("searchPosts");
		if (!tool) throw new Error("searchPosts tool is not registered");

		return tool.execute(
			{ query: "astro" },
			{ signal: new AbortController().signal }
		);
	});

	expect(Array.isArray(results)).toBe(true);
	expect(results as unknown[]).not.toHaveLength(0);
});
