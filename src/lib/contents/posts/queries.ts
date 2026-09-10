import { type CollectionEntry, getCollection } from "astro:content";
import type { CollectionPosts } from "@/types";
import { getPostSection, getPostTimestamp } from "./date";

function sortPostsByDate(
	itemA: CollectionPosts,
	itemB: CollectionPosts
): number {
	return getPostTimestamp(itemB) - getPostTimestamp(itemA);
}

export async function getAllPosts(limit?: number): Promise<CollectionPosts[]> {
	const posts = await getCollection("post", ({ data }) => {
		const isNotDraft = data.draft !== true;

		return import.meta.env.PROD ? isNotDraft : true;
	});

	const sortedPosts = [...posts].sort(sortPostsByDate);

	return limit ? sortedPosts.slice(0, limit) : sortedPosts;
}

export function getRelatedPosts(
	posts: CollectionPosts[],
	currentPost: CollectionPosts,
	limit = 4
): CollectionPosts[] {
	const currentTags = currentPost.data.tags;
	const currentId = currentPost.id;
	const currentCategory = currentId.split("/")[0];

	return posts
		.filter((post) => post.id !== currentId)
		.map((post) => {
			let score = 0;

			const matchingTags = post.data.tags.filter((tag) =>
				currentTags.includes(tag)
			);
			score += matchingTags.length * 10;

			const postCategory = post.id.split("/")[0];
			if (currentCategory && postCategory && currentCategory === postCategory) {
				score += 5;
			}

			return { post, score };
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => item.post);
}

export async function getPostsByPath(
	path?: string,
	limit?: number
): Promise<CollectionPosts[]> {
	const posts = await getAllPosts();

	const filtered = posts.filter((post) => {
		const section = getPostSection(post);
		if (!path) return section !== "series";

		return section === path;
	});

	return limit ? filtered.slice(0, limit) : filtered;
}

export function getUniqueTags(posts: Array<CollectionEntry<"post">>) {
	return [...new Set(posts.flatMap((post) => post.data.tags))];
}

export function getUniqueTagsWithCount(
	posts: Array<CollectionEntry<"post">>
): Array<[string, number]> {
	return [
		...posts
			.flatMap((post) => post.data.tags)
			.reduce(
				(acc, tag) => acc.set(tag, (acc.get(tag) || 0) + 1),
				new Map<string, number>()
			)
	].sort((a, b) => {
		if (b[1] !== a[1]) return b[1] - a[1];
		return a[0].localeCompare(b[0]);
	});
}
