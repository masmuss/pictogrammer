import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";
import { describe, expect, it } from "vitest";
import { postSchema } from "@/lib/contents/schemas";

const schema = postSchema({
	image: () => z.string(),
} as unknown as SchemaContext);

const post = {
	title: "External post",
	date: "2026-11-26",
};

describe("post externalUrl", () => {
	it.each(["https://medium.com/@author/post", "http://example.com/post"])(
		"accepts %s",
		(externalUrl) => {
			const result = schema.safeParse({ ...post, externalUrl });

			expect(result.success).toBe(true);
		},
	);

	it.each(["javascript:alert(1)", "/blog/relative-post"])(
		"rejects %s",
		(externalUrl) => {
			const result = schema.safeParse({ ...post, externalUrl });

			expect(result.success).toBe(false);
		},
	);
});
