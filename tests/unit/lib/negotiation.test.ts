import { describe, expect, it } from "vitest";
import {
	appendVaryAccept,
	HTML_TYPE,
	isNegotiablePath,
	MARKDOWN_TYPE,
	markdownPath,
	pagePath,
	parseAccept,
	preferredType
} from "@/lib/negotiation";

const PRODUCES = [HTML_TYPE, MARKDOWN_TYPE];

describe("parseAccept", () => {
	it("parses media types, q-values, and specificity", () => {
		expect(parseAccept("text/markdown;q=0.8, text/html, */*;q=0.1")).toEqual([
			{ type: "text/markdown", q: 0.8, specificity: 2 },
			{ type: "text/html", q: 1, specificity: 2 },
			{ type: "*/*", q: 0.1, specificity: 0 }
		]);
	});

	it("ignores empty entries", () => {
		expect(parseAccept(", , text/html")).toEqual([
			{ type: "text/html", q: 1, specificity: 2 }
		]);
	});
});

describe("preferredType", () => {
	it("defaults to HTML without an Accept header", () => {
		expect(preferredType(null, PRODUCES)).toBe(HTML_TYPE);
	});

	it("selects markdown when it has the highest q-value", () => {
		expect(
			preferredType(
				"text/html;q=0.5, text/markdown;q=0.9",
				PRODUCES
			)
		).toBe(MARKDOWN_TYPE);
	});

	it("uses client order to break ties", () => {
		expect(preferredType("text/markdown, */*", PRODUCES)).toBe(
			MARKDOWN_TYPE
		);
	});

	it("honors explicit rejection over a wildcard", () => {
		expect(
			preferredType("text/markdown;q=0, */*;q=1", PRODUCES)
		).toBe(HTML_TYPE);
	});

	it("returns null when nothing is acceptable", () => {
		expect(preferredType("application/pdf", PRODUCES)).toBeNull();
	});
});

describe("appendVaryAccept", () => {
	it("adds Accept when Vary is missing", () => {
		const headers = new Headers();
		appendVaryAccept(headers);
		expect(headers.get("vary")).toBe("Accept");
	});

	it("appends Accept without duplicating it", () => {
		const headers = new Headers({ Vary: "Accept-Encoding" });
		appendVaryAccept(headers);
		expect(headers.get("vary")).toBe("Accept-Encoding, Accept");

		appendVaryAccept(headers);
		expect(headers.get("vary")).toBe("Accept-Encoding, Accept");
	});
});

describe("markdownPath", () => {
	it("maps root and page paths to index.md siblings", () => {
		expect(markdownPath("/")).toBe("/index.md");
		expect(markdownPath("/about")).toBe("/about/index.md");
		expect(markdownPath("/about/")).toBe("/about/index.md");
		expect(markdownPath("/blog/post/")).toBe("/blog/post/index.md");
	});
});

describe("pagePath", () => {
	it("normalizes page routes without a trailing slash", () => {
		expect(pagePath("/")).toBe("/");
		expect(pagePath("/about")).toBe("/about");
		expect(pagePath("/about/")).toBe("/about");
		expect(pagePath("/blog/post/")).toBe("/blog/post");
	});
});

describe("isNegotiablePath", () => {
	it("accepts HTML page routes", () => {
		expect(isNegotiablePath("/")).toBe(true);
		expect(isNegotiablePath("/about")).toBe(true);
		expect(isNegotiablePath("/blog/post")).toBe(true);
	});

	it("rejects static assets and non-page routes", () => {
		expect(isNegotiablePath("/404")).toBe(false);
		expect(isNegotiablePath("/_astro/app.js")).toBe(false);
		expect(isNegotiablePath("/pagefind/pagefind.js")).toBe(false);
		expect(isNegotiablePath("/.well-known/llms.txt")).toBe(false);
		expect(isNegotiablePath("/llms.txt")).toBe(false);
		expect(isNegotiablePath("/auth.md")).toBe(false);
		expect(isNegotiablePath("/favicon/site.webmanifest")).toBe(false);
	});
});
