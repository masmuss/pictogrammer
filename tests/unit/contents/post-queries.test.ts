import { describe, expect, it } from "vitest";
import {
	getRelatedPosts,
	getUniqueTags,
	getUniqueTagsWithCount
} from "@/lib/contents/posts/queries";
import type { CollectionPosts } from "@/types";

function createPost(
	id: string,
	tags: string[],
	title = id
): CollectionPosts {
	return {
		id,
		body: "",
		collection: "post",
		data: {
			title,
			date: new Date("2025-01-01"),
			tags,
			draft: false
		}
	} as CollectionPosts;
}

describe("getRelatedPosts", () => {
	it("prioritizes matching tags and category", () => {
		const currentPost = createPost(
			"reflections/current",
			["astro", "refactor"]
		);
		const sameCategory = createPost("reflections/matching", ["astro"]);
		const sameTag = createPost("notes/matching", ["astro"]);
		const unrelated = createPost("notes/unrelated", ["testing"]);

		expect(
			getRelatedPosts(
				[currentPost, unrelated, sameTag, sameCategory],
				currentPost
			)
		).toEqual([sameCategory, sameTag]);
	});

	it("excludes the current post and applies the limit", () => {
		const currentPost = createPost("notes/current", ["astro"]);
		const first = createPost("notes/first", ["astro"]);
		const second = createPost("notes/second", ["astro"]);

		expect(getRelatedPosts([currentPost, first, second], currentPost, 1)).toEqual([
			first
		]);
	});

	it("returns no posts when there are no matching signals", () => {
		const currentPost = createPost("notes/current", ["astro"]);
		const unrelated = createPost("reflections/unrelated", ["testing"]);

		expect(getRelatedPosts([currentPost, unrelated], currentPost)).toEqual([]);
	});
});

describe("tag statistics", () => {
	const posts = [
		createPost("first", ["astro", "typescript"]),
		createPost("second", ["astro", "testing"]),
		createPost("third", ["typescript"])
	];

	it("returns unique tags", () => {
		expect(getUniqueTags(posts)).toEqual(["astro", "typescript", "testing"]);
	});

	it("sorts tags by count and then alphabetically", () => {
		expect(getUniqueTagsWithCount(posts)).toEqual([
			["astro", 2],
			["typescript", 2],
			["testing", 1]
		]);
	});
});
