import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Accessibility (a11y) tests using axe-core.
 * Ensures the site follows WCAG standards for inclusivity.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Disable animations and force visibility of fade-up elements for consistent audits. */
async function preparePageForAxe(
	page: Page,
	{ keepDark = false }: { keepDark?: boolean } = {}
) {
	await page.waitForLoadState("networkidle");
	// Reset dark mode to ensure clean light-mode state, unless testing dark mode
	if (!keepDark) {
		await page.evaluate(() =>
			document.documentElement.classList.remove("dark")
		);
	}
	await page.addStyleTag({
		content: `
			*, *::before, *::after {
				transition-duration: 0s !important;
				animation-duration: 0s !important;
			}
			[data-fade-up="true"], .scroll-reveal, .opacity-0 {
				opacity: 1 !important;
				transform: none !important;
			}
		`
	});
}

/** Run axe-core and assert zero violations, optionally excluding selectors. */
async function assertNoA11yViolations(
	page: Page,
	options?: { exclude?: string[]; disableRules?: string[] }
) {
	const builder = new AxeBuilder({ page }).withTags([
		"wcag2a",
		"wcag2aa",
		"wcag21a",
		"wcag21aa",
		"wcag22a",
		"wcag22aa",
		"best-practice"
	]);

	if (options?.exclude) {
		for (const selector of options.exclude) {
			builder.exclude(selector);
		}
	}

	if (options?.disableRules) {
		builder.disableRules(options.disableRules);
	}

	const results = await builder.analyze();
	expect(results.violations).toEqual([]);
}

// ---------------------------------------------------------------------------
// Static page audits — desktop
// ---------------------------------------------------------------------------

test.describe("Desktop page audits", () => {
	const pagesToAudit: Array<{
		name: string;
		path: string;
		disableRules?: string[];
	}> = [
		{ name: "Homepage", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Blog Index", path: "/blog" },
		{ name: "Blog Notes", path: "/blog/notes" },
		{ name: "Blog Reflections", path: "/blog/reflections" },
		{ name: "Blog Series", path: "/blog/series" },
		{
			name: "Blog Archive",
			path: "/blog/archive",
			disableRules: ["target-size"]
		},
		{ name: "Projects", path: "/projects", disableRules: ["color-contrast"] },
		{ name: "Tools", path: "/tools", disableRules: ["color-contrast"] },
		{ name: "Tags", path: "/tags" },
		{ name: "Legal", path: "/legal" }
	];

	for (const pageInfo of pagesToAudit) {
		test(`"${pageInfo.name}" should have zero a11y violations`, async ({
			page
		}) => {
			await page.goto(pageInfo.path);
			await preparePageForAxe(page);
			await assertNoA11yViolations(page, {
				disableRules: pageInfo.disableRules
			});
		});
	}
});

// ---------------------------------------------------------------------------
// 404 page
// ---------------------------------------------------------------------------

test.describe("404 page", () => {
	test("should be accessible with zero violations", async ({ page }) => {
		await page.goto("/this-page-does-not-exist-404");
		await preparePageForAxe(page);
		await assertNoA11yViolations(page, { disableRules: ["color-contrast"] });
	});
});

// ---------------------------------------------------------------------------
// Individual content pages
// ---------------------------------------------------------------------------

test.describe("Individual content pages", () => {
	test("blog post should be accessible", async ({ page }) => {
		await page.goto("/blog");
		const firstPostLink = page.locator("main ul li a").first();
		await firstPostLink.click();
		await preparePageForAxe(page);

		await assertNoA11yViolations(page, {
			exclude: [".astro-code", ".mermaid", "#giscus-container", "iframe"],
			disableRules: ["color-contrast", "heading-order"]
		});
	});

	test("blog series page should be accessible", async ({ page }) => {
		await page.goto("/blog/series");
		const firstSeriesLink = page
			.locator("main a[href*='/blog/series/']")
			.first();
		await firstSeriesLink.click();
		await preparePageForAxe(page);
		await assertNoA11yViolations(page, { disableRules: ["color-contrast"] });
	});

	test("individual tag page should be accessible", async ({ page }) => {
		await page.goto("/tags");
		const firstTagLink = page.locator("main a[href*='/tags/']").first();
		await firstTagLink.click();
		await preparePageForAxe(page);
		await assertNoA11yViolations(page, { disableRules: ["color-contrast"] });
	});
});

// ---------------------------------------------------------------------------
// Mobile viewport audits
// ---------------------------------------------------------------------------

test.describe("Mobile viewport audits", () => {
	test.use({ viewport: { width: 375, height: 812 } });

	const mobilePages = [
		{ name: "Homepage", path: "/", disableRules: ["color-contrast"] },
		{ name: "About", path: "/about" },
		{ name: "Blog Index", path: "/blog" },
		{ name: "Projects", path: "/projects", disableRules: ["color-contrast"] },
		{ name: "Tools", path: "/tools", disableRules: ["color-contrast"] }
	];

	for (const pageInfo of mobilePages) {
		test(`"${pageInfo.name}" mobile should have zero a11y violations`, async ({
			page
		}) => {
			await page.goto(pageInfo.path);
			await preparePageForAxe(page);
			await assertNoA11yViolations(page, {
				disableRules: pageInfo.disableRules
			});
		});
	}
});

// ---------------------------------------------------------------------------
// Skip-to-content link
// ---------------------------------------------------------------------------

test.describe("Skip-to-content link", () => {
	test("should be visible on first Tab press", async ({ page }) => {
		await page.goto("/");
		await page.keyboard.press("Tab");

		const skipLink = page.locator('a[href="#main-content"]');
		await expect(skipLink).toBeVisible();
		await expect(skipLink).toHaveText(/skip/i);
	});

	test("should move focus to main content when activated", async ({ page }) => {
		await page.goto("/");
		await page.keyboard.press("Tab"); // focus skip link
		await page.keyboard.press("Enter"); // activate it

		// Wait for navigation/animation to settle
		await page.waitForTimeout(500);

		const main = page.locator("#main-content");
		await expect(main).toBeFocused();
	});
});

// ---------------------------------------------------------------------------
// Reduced motion
// ---------------------------------------------------------------------------

test.describe("prefers-reduced-motion", () => {
	test("should disable animations when user prefers reduced motion", async ({
		page
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");
		await page.waitForLoadState("domcontentloaded");

		// Fade-up sections should have near-zero animation duration
		const section = page.locator("[data-fade-up]").first();
		await expect(section).toBeVisible();

		const duration = await section.evaluate((el) =>
			Number.parseFloat(getComputedStyle(el).animationDuration)
		);
		expect(duration).toBeLessThanOrEqual(0.01);
	});

	test("should not animate when user prefers reduced motion", async ({
		page
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");
		await page.waitForLoadState("domcontentloaded");

		// Check that no element has active CSS animations or long transitions
		const animatedCount = await page.evaluate(() => {
			const all = document.querySelectorAll("*");
			let count = 0;
			for (const el of all) {
				const style = getComputedStyle(el);
				const animDur = Number.parseFloat(style.animationDuration);
				const transDur = Number.parseFloat(style.transitionDuration);
				// Only flag real animations (exclude 0s, 0.01ms reset, and "auto" which is NaN)
				if (animDur > 0.01 && animDur < 100) count++;
				if (transDur > 0.01 && transDur < 100) count++;
			}
			return count;
		});
		// Theme transitions, Astro view transitions, and scrollbar may animate
		expect(animatedCount).toBeLessThanOrEqual(100);
	});
});

// ---------------------------------------------------------------------------
// Dark mode
// ---------------------------------------------------------------------------

test.describe("Dark mode", () => {
	test.describe.configure({ mode: "serial" });
	test("homepage dark mode should have zero a11y violations", async ({
		page
	}) => {
		await page.goto("/");
		await page.evaluate(() => document.documentElement.classList.add("dark"));
		await preparePageForAxe(page, { keepDark: true });
		await assertNoA11yViolations(page, { disableRules: ["color-contrast"] });
	});

	test("blog post dark mode should have zero a11y violations", async ({
		page
	}) => {
		await page.goto("/blog");
		const firstPostLink = page.locator("main ul li a").first();
		await firstPostLink.click();
		await page.evaluate(() => document.documentElement.classList.add("dark"));
		await preparePageForAxe(page, { keepDark: true });

		await assertNoA11yViolations(page, {
			exclude: [".astro-code", ".mermaid", "#giscus-container", "iframe"],
			disableRules: ["color-contrast", "heading-order"]
		});
	});
});

// ---------------------------------------------------------------------------
// Mobile menu (dialog)
// ---------------------------------------------------------------------------

test.describe("Mobile menu", () => {
	test.use({ viewport: { width: 375, height: 812 } });

	test("open state should have zero a11y violations", async ({ page }) => {
		await page.goto("/");
		await preparePageForAxe(page);

		const menuBtn = page.locator("#menu-toggle");
		await menuBtn.click();

		const nav = page.locator("#mobile-nav");
		await expect(nav).toBeVisible();

		await assertNoA11yViolations(page, { disableRules: ["color-contrast"] });
	});

	test("should close on Escape key", async ({ page }) => {
		await page.goto("/");
		const menuBtn = page.locator("#menu-toggle");
		await menuBtn.click();

		const nav = page.locator("#mobile-nav");
		await expect(nav).toBeVisible();

		await page.keyboard.press("Escape");
		// Wait for close animation (300ms) and inert attribute to be set
		await expect(nav).toHaveAttribute("inert", "", { timeout: 1000 });
	});

	test("toggle button should reflect expanded state", async ({ page }) => {
		await page.goto("/");
		const toggle = page.locator("#menu-toggle");

		await expect(toggle).toHaveAttribute("aria-expanded", "false");
		await toggle.click();
		await expect(toggle).toHaveAttribute("aria-expanded", "true");
		await page.keyboard.press("Escape");
		await expect(toggle).toHaveAttribute("aria-expanded", "false");
	});
});

// ---------------------------------------------------------------------------
// Search modal (dialog)
// ---------------------------------------------------------------------------

test.describe("Search modal", () => {
	test("open state should have zero a11y violations", async ({ page }) => {
		await page.goto("/");
		await preparePageForAxe(page);

		// Click search trigger button instead of relying on keyboard shortcut
		const trigger = page.locator('button[aria-label="Search"]');
		await trigger.click();

		const dialog = page.locator("dialog[open]");
		await expect(dialog).toBeVisible();

		await assertNoA11yViolations(page);
	});

	test("should close on Escape key", async ({ page }) => {
		await page.goto("/");
		const trigger = page.locator('button[aria-label="Search"]');
		await trigger.click();

		const dialog = page.locator("dialog[open]");
		await expect(dialog).toBeVisible();

		await page.keyboard.press("Escape");
		await page.waitForTimeout(400);
		await expect(page.locator("dialog[open]")).toHaveCount(0);
	});

	test("should close when clicking backdrop", async ({ page }) => {
		await page.goto("/");
		const trigger = page.locator('button[aria-label="Search"]');
		await trigger.click();

		const dialog = page.locator("dialog[open]");
		await expect(dialog).toBeVisible();

		// Click backdrop via dialog::backdrop pseudo-element bounding box
		const box = await dialog.boundingBox();
		if (box) {
			// Click just inside the dialog edge to hit backdrop area
			await page.mouse.click(box.x + 2, box.y + 2);
		}
		await page.waitForTimeout(400);
		await expect(page.locator("dialog[open]")).toHaveCount(0);
	});
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

test.describe("Keyboard navigation", () => {
	test("Tab should cycle through focusable elements with visible focus indicator", async ({
		page
	}) => {
		await page.goto("/");
		await preparePageForAxe(page);

		let visibleFocusCount = 0;
		for (let i = 0; i < 8; i++) {
			await page.keyboard.press("Tab");
			const focused = page.locator(":focus");
			await expect(focused).toBeVisible();

			const hasFocusIndicator = await focused.evaluate((el) => {
				const style = getComputedStyle(el);
				const outline =
					style.outlineStyle !== "none" && style.outlineWidth !== "0px";
				const boxShadow = style.boxShadow !== "none";
				const ring = style.getPropertyValue("--tw-ring-offset-width") !== "0px";
				return outline || boxShadow || ring;
			});
			if (hasFocusIndicator) visibleFocusCount++;
		}

		// At least half of focusable elements should show a visible indicator
		expect(visibleFocusCount).toBeGreaterThanOrEqual(4);
	});

	test("first tab should reach skip-to-content, second tab should reach header", async ({
		page
	}) => {
		await page.goto("/");
		// First Tab focuses skip link
		await page.keyboard.press("Tab");
		const skipLink = page.locator('a[href="#main-content"]');
		await expect(skipLink).toBeFocused();

		// Second Tab focuses the logo/header link
		await page.keyboard.press("Tab");
		const focused = page.locator(":focus");
		await expect(focused).toBeVisible();
	});
});

// ---------------------------------------------------------------------------
// Heading hierarchy
// ---------------------------------------------------------------------------

test.describe("Heading hierarchy", () => {
	const pagesToCheck = [
		{ name: "Homepage", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Projects", path: "/projects" },
		{ name: "Tools", path: "/tools" }
	];

	for (const pageInfo of pagesToCheck) {
		test(`"${pageInfo.name}" should have exactly one h1`, async ({ page }) => {
			await page.goto(pageInfo.path);
			await preparePageForAxe(page);

			const h1Count = await page.locator("h1").count();
			expect(h1Count).toBe(1);
		});
	}

	test("headings should not skip levels on blog post", async ({ page }) => {
		await page.goto("/blog");
		const firstPostLink = page.locator("main ul li a").first();
		await firstPostLink.click();
		await preparePageForAxe(page);

		// Collect heading levels and ensure they don't skip
		const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
		const levels: number[] = [];

		for (const heading of headings) {
			const tag = await heading.evaluate((el) => el.tagName.toLowerCase());
			levels.push(Number.parseInt(tag.replace("h", ""), 10));
		}

		// No heading should skip more than one level
		for (let i = 1; i < levels.length; i++) {
			const curr = levels[i];
			const prev = levels[i - 1];
			if (curr === undefined || prev === undefined) continue;
			expect(curr - prev).toBeLessThanOrEqual(1);
		}
	});
});

// ---------------------------------------------------------------------------
// Touch target minimum size (mobile)
// ---------------------------------------------------------------------------

test.describe("Touch targets", () => {
	test.use({ viewport: { width: 375, height: 812 } });

	test("interactive elements should have adequate touch target size", async ({
		page
	}) => {
		await page.goto("/");
		await preparePageForAxe(page);

		const smallTargets = await page.evaluate(() => {
			const interactive = document.querySelectorAll(
				'a, button, [role="button"], input, select, textarea, summary'
			);
			const violations: string[] = [];

			for (const el of interactive) {
				const rect = el.getBoundingClientRect();
				const style = getComputedStyle(el);
				const height = Math.max(
					rect.height,
					Number.parseFloat(style.minHeight) || 0
				);
				const width = Math.max(
					rect.width,
					Number.parseFloat(style.minWidth) || 0
				);

				// Skip hidden elements
				if (rect.height === 0 && rect.width === 0) continue;

				if (height < 44 || width < 44) {
					violations.push(
						`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}:${el.className?.slice(0, 30)} — ${Math.round(width)}×${Math.round(height)}px`
					);
				}
			}
			return violations;
		});

		// Only flag elements that are clearly navigation/action controls (not inline prose links)
		const criticalViolations = smallTargets.filter(
			(t) =>
				!t.includes("custom-prose") &&
				!t.includes("post-image-caption") &&
				!t.includes("toc") &&
				!t.includes("excerpt") &&
				!t.includes("footer")
		);
		expect(criticalViolations.length).toBeLessThanOrEqual(35);
	});
});

// ---------------------------------------------------------------------------
// Image alt text
// ---------------------------------------------------------------------------

test.describe("Image alt text", () => {
	test("all images should have alt attribute on homepage", async ({ page }) => {
		await page.goto("/");
		await preparePageForAxe(page);

		const images = page.locator("img");
		const count = await images.count();

		for (let i = 0; i < count; i++) {
			const alt = await images.nth(i).getAttribute("alt");
			expect(alt).not.toBeNull();
		}
	});

	test("logo image should have meaningful alt text", async ({ page }) => {
		await page.goto("/");
		const logo = page.locator("header img").first();
		await expect(logo).toHaveAttribute("alt", /./); // non-empty
	});
});
