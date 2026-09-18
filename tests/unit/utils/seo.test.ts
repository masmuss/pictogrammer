import { describe, expect, it } from "vitest";
import {
	formatCanonicalURL,
	normalizeDescription,
	normalizeTitle
} from "@/lib/utils/seo";

describe("normalizeTitle", () => {
	it("returns the fallback when raw is missing", () => {
		expect(normalizeTitle(undefined, "Fallback", "MySite")).toBe("Fallback");
		expect(normalizeTitle("", "Fallback", "MySite")).toBe("Fallback");
	});

	it("returns the base title untouched when it already has the site name", () => {
		expect(normalizeTitle("MySite Blog", "FB", "mysite")).toBe("MySite Blog");
	});

	it("appends the site name when missing", () => {
		expect(normalizeTitle("Hello", "FB", "MySite")).toBe("Hello | MySite");
	});

	it("truncates long titles at a word boundary", () => {
		const base =
			"A very long blog post title that definitely exceeds the sixty character budget";
		const result = normalizeTitle(base, "FB", "MySite");
		expect(result.length).toBeLessThanOrEqual(60);
		expect(result).toContain("MySite");
		expect(result).toContain("...");
	});
});

describe("normalizeDescription", () => {
	it("falls back when raw is missing", () => {
		const result = normalizeDescription(undefined, "Fallback desc", false);
		expect(result.startsWith("Fallback desc")).toBe(true);
	});

	it("pads short article descriptions with a suffix", () => {
		const result = normalizeDescription("Short.", "FB", true);
		expect(result.startsWith("Short.")).toBe(true);
		expect(result).toContain("full article");
	});

	it("pads short page descriptions differently", () => {
		const result = normalizeDescription("Short.", "FB", false);
		expect(result).toContain("Explore more");
	});

	it("truncates descriptions over the max length", () => {
		const raw = "word ".repeat(60).trim();
		const result = normalizeDescription(raw, "FB", true);
		expect(result.length).toBeLessThanOrEqual(160);
		expect(result.endsWith("...")).toBe(true);
	});
});

describe("formatCanonicalURL", () => {
	it("strips hash and trailing slash but keeps query", () => {
		expect(
			formatCanonicalURL(new URL("https://khoirul.me/blog/a/?q=1#frag"))
		).toBe("https://khoirul.me/blog/a?q=1");
	});

	it("keeps the root slash", () => {
		expect(formatCanonicalURL(new URL("https://khoirul.me/#a"))).toBe(
			"https://khoirul.me/"
		);
	});
});
