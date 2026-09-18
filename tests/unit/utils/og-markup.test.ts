import { describe, expect, it } from "vitest";
import {
	buildOgMarkup,
	decodeHtmlEntities,
	truncateText
} from "@/lib/utils/og/markup";

describe("decodeHtmlEntities", () => {
	it("decodes named entities", () => {
		expect(decodeHtmlEntities("a &amp; b &lt;c&gt; &quot;q&quot;")).toBe(
			'a & b <c> "q"'
		);
	});

	it("decodes numeric entities", () => {
		expect(decodeHtmlEntities("&#65;&#x41;")).toBe("AA");
	});

	it("leaves unknown entities untouched", () => {
		expect(decodeHtmlEntities("&bogus;")).toBe("&bogus;");
	});

	it("returns empty input as-is", () => {
		expect(decodeHtmlEntities("")).toBe("");
	});
});

describe("truncateText", () => {
	it("keeps short text untouched", () => {
		expect(truncateText("hello", 10)).toBe("hello");
	});

	it("truncates long text with ellipsis", () => {
		expect(truncateText("hello world", 5)).toBe("hello...");
	});
});

describe("buildOgMarkup", () => {
	it("embeds title and domain", () => {
		const markup = buildOgMarkup({
			title: "Hello World",
			description: "A post",
			logoBase64: "data:image/png;base64,xxx",
			domain: "khoirul.me"
		});
		const serialized = JSON.stringify(markup);
		expect(serialized).toContain("Hello World");
		expect(serialized).toContain("khoirul.me");
	});

	it("embeds optional category and author meta", () => {
		const markup = buildOgMarkup({
			title: "T",
			description: "D",
			logoBase64: "data:image/png;base64,xxx",
			category: "notes",
			date: "2026-01-01",
			readTime: "5 min",
			author: "Khoirul",
			authorInitials: "KF"
		});
		const serialized = JSON.stringify(markup);
		expect(serialized).toContain("notes");
		expect(serialized).toContain("Khoirul");
		expect(serialized).toContain("5 min");
	});
});
