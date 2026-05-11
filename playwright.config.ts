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
		baseURL: "http://localhost:4321",
		trace: "on-first-retry"
	},
	/* Configure visual regression tests */
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.05, // Toleransi 5% perbedaan pixel (aman buat beda OS)
			threshold: 0.2 // Sensitivitas warna
		}
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	],
	webServer: {
		command: "bun run build && bun run preview",
		url: "http://localhost:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 180 * 1000
	}
});
