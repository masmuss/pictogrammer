import { describe, expect, it } from "vitest";
import {
	createRedirectManifest,
	excludeRedirectPageFromIndex,
	getRedirectDestination,
	updateRedirectFile,
} from "@/integrations/external-post-redirects";

const redirects = [
	{
		path: "/blog/reflections/external-post",
		destination: "https://medium.com/@author/external-post",
	},
];

describe("external post redirect build artifacts", () => {
	it("creates a path-to-destination manifest", () => {
		const manifest = createRedirectManifest(redirects);

		expect(JSON.parse(manifest)).toEqual({
			"/blog/reflections/external-post":
				"https://medium.com/@author/external-post",
		});
	});

	it("preserves existing redirects and replaces generated redirects", () => {
		const existing = [
			"# Existing rules",
			"/sitemap.xml /sitemap-index.xml 301",
			"",
			"# external-post-redirects:start",
			"/blog/old https://example.com/old 301",
			"# external-post-redirects:end",
			"",
		].join("\n");

		const updated = updateRedirectFile(existing, redirects);

		expect(updated).toBe(
			[
				"# Existing rules",
				"/sitemap.xml /sitemap-index.xml 301",
				"",
				"# external-post-redirects:start",
				"/blog/reflections/external-post https://medium.com/@author/external-post 301",
				"# external-post-redirects:end",
				"",
			].join("\n"),
		);
	});

	it("does not duplicate generated redirects on repeated builds", () => {
		const firstBuild = updateRedirectFile("", redirects);
		const secondBuild = updateRedirectFile(firstBuild, redirects);

		expect(secondBuild).toBe(firstBuild);
	});

	it("removes generated redirects when no external posts exist", () => {
		const existing = updateRedirectFile(
			"/sitemap.xml /sitemap-index.xml 301\n",
			redirects,
		);

		expect(updateRedirectFile(existing, [])).toBe(
			"/sitemap.xml /sitemap-index.xml 301\n",
		);
	});

	it("excludes redirect pages from the search index", () => {
		const html = '<html lang="en"><head></head><body></body></html>';

		expect(excludeRedirectPageFromIndex(html)).toBe(
			'<html data-pagefind-ignore="all" lang="en"><head></head><body></body></html>',
		);
	});

	it("wraps redirect fragments so Pagefind can ignore them", () => {
		const html =
			'<title>Redirecting</title><meta http-equiv="refresh" content="0;url=https://example.com">';

		expect(excludeRedirectPageFromIndex(html)).toBe(
			`<html data-pagefind-ignore="all">${html}</html>`,
		);
	});

	it("keeps the doctype before the wrapper for redirect fragments", () => {
		const html =
			'<!doctype html><title>Redirecting</title><meta http-equiv="refresh" content="0;url=https://example.com">';

		expect(excludeRedirectPageFromIndex(html)).toBe(
			`<!doctype html><html data-pagefind-ignore="all"><title>Redirecting</title><meta http-equiv="refresh" content="0;url=https://example.com"></html>`,
		);
	});

	it("reads and decodes redirect destinations", () => {
		const html =
			'<meta http-equiv="refresh" content="2;url=https://example.com/post?a=1&amp;b=2">';

		expect(getRedirectDestination(html)).toBe(
			"https://example.com/post?a=1&b=2",
		);
	});

	it("ignores pages without a meta refresh redirect", () => {
		expect(getRedirectDestination("<html><body>Post</body></html>")).toBeNull();
	});
});
