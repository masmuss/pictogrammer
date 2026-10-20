import { describe, expect, it } from "vitest";
import { addMarkdownFrontmatter } from "@/lib/markdown-frontmatter";

const SITE_URL = "https://khoirul.me";

describe("addMarkdownFrontmatter", () => {
	it("adds the canonical URL and title", () => {
		expect(
			addMarkdownFrontmatter(
				"# About Me\n\nSome content.",
				"about/index.html",
				SITE_URL
			)
		).toBe(`---
url: "https://khoirul.me/about"
title: "About Me"
---

# About Me

Some content.`);
	});

	it("maps the root index to the site root", () => {
		expect(
			addMarkdownFrontmatter(
				"# Home\n",
				"index.html",
				SITE_URL
			)
		).toContain('url: "https://khoirul.me/"');
	});

	it("omits the title when there is no H1", () => {
		const result = addMarkdownFrontmatter(
			"Some content without a heading.",
			"about/index.html",
			SITE_URL
		);

		expect(result).not.toContain("title:");
		expect(result).toContain('url: "https://khoirul.me/about"');
	});

	it("supports nested pages and Windows-style paths", () => {
		const result = addMarkdownFrontmatter(
			"# A post\n",
			"blog\\notes\\post\\index.html",
			SITE_URL
		);

		expect(result).toContain(
			'url: "https://khoirul.me/blog/notes/post"'
		);
	});
});
