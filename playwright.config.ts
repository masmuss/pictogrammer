import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI
		? [["github"], ["html", { open: "never" }]]
		: [["html", { open: "never" }]],
	use: {
		baseURL: "http://localhost:4322",
		trace: "on-first-retry",
		contextOptions: {
			reducedMotion: "reduce"
		}
	},
	/* Configure visual regression tests */
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.05, // pixel difference tolerance
			threshold: 0.2 // color tolerance
		}
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	],
	webServer: {
		command: "bun run build && bun run preview -- --port 4322",
		url: "http://localhost:4322",
		reuseExistingServer: !process.env.CI,
		timeout: 180 * 1000
	}
});
