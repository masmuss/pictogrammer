import { describe, expect, it } from "vitest";
import { sanitizeCaption } from "@/lib/utils/sanitize-caption";

describe("sanitizeCaption", () => {
	it("preserves safe links", () => {
		expect(
			sanitizeCaption('Read <a href="https://example.com" title="Example">more</a>.')
		).toBe(
			'Read <a href="https://example.com" title="Example">more</a>.'
		);
	});

	it("removes unsafe tags, attributes, and URL schemes", () => {
		const caption = [
			'<script>alert("xss")</script>',
			'<a href="javascript:alert(1)" onclick="alert(1)">unsafe</a>',
			'<span class="danger">plain text</span>'
		].join("");

		expect(sanitizeCaption(caption)).toBe(
			'<a>unsafe</a>plain text'
		);
	});
});
