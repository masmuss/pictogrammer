import { describe, expect, it } from "vitest";
import {
	getPostMonth,
	getPostSection,
	getPostTimestamp,
	getPostYear
} from "@/lib/contents/posts/date";
import {
	groupPostsByYear,
	groupPostsForArchive
} from "@/lib/contents/posts/grouping";
import type { CollectionPosts } from "@/types";

function createPost(
	id: string,
	date: string,
	title = id
): CollectionPosts {
	return {
		id,
		body: "",
		collection: "post",
		data: {
			title,
			date: new Date(date),
			tags: [],
			draft: false
		},
	} as CollectionPosts;
}

describe("post date helpers", () => {
	const post = createPost("reflections/example", "2025-07-20");

	it("returns the post timestamp, year, and zero-based month", () => {
		expect(getPostTimestamp(post)).toBe(post.data.date.getTime());
		expect(getPostYear(post)).toBe(2025);
		expect(getPostMonth(post)).toBe(6);
	});

	it("returns the first path segment as the post section", () => {
		expect(getPostSection(post)).toBe("reflections");
		expect(getPostSection(createPost("standalone", "2025-07-20"))).toBe(
			"standalone"
		);
	});
});

describe("groupPostsByYear", () => {
	it("orders years descending while preserving post order within each year", () => {
		const posts = [
			createPost("2024-first", "2024-01-01"),
			createPost("2025-post", "2025-01-01"),
			createPost("2024-second", "2024-12-01")
		];

		const groups = groupPostsByYear(posts);

		expect([...groups.keys()]).toEqual([2025, 2024]);
		expect(groups.get(2024)?.map((post) => post.id)).toEqual([
			"2024-first",
			"2024-second"
		]);
	});
});

describe("groupPostsForArchive", () => {
	it("groups posts by descending year and month with counts", () => {
		const posts = [
			createPost("older", "2024-01-01"),
			createPost("newer-month", "2025-07-01"),
			createPost("newer-year", "2025-08-01"),
			createPost("same-month", "2025-07-20")
		];

		const archive = groupPostsForArchive(posts);

		expect(archive).toEqual([
			{
				year: 2025,
				count: 3,
				months: [
					{
						month: 7,
						monthName: "August",
						posts: [posts[2]]
					},
					{
						month: 6,
						monthName: "July",
						posts: [posts[1], posts[3]]
					}
				]
			},
			{
				year: 2024,
				count: 1,
				months: [
					{
						month: 0,
						monthName: "January",
						posts: [posts[0]]
					}
				]
			}
		]);
	});
});
