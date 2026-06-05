import type { CollectionPosts } from "@/types";
import { type CollectionEntry, getCollection } from "astro:content";

const AVERAGE_READING_WORDS_PER_MINUTE = 200;

export function sortPostsByDate(
	itemA: CollectionPosts,
	itemB: CollectionPosts
): number {
	return (
		new Date(itemB.data.date).getTime() - new Date(itemA.data.date).getTime()
	);
}

export async function getAllPosts(limit?: number) {
	const posts = await getCollection("post", ({ data }) => {
		const isNotDraft = data.draft !== true;
		const isPublished = new Date(data.date) <= new Date();

		return import.meta.env.PROD ? isNotDraft && isPublished : true;
	});

	const sortedPosts = posts.sort(sortPostsByDate);

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

	const postsWithScore = posts
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

	return postsWithScore;
}

export async function getPostsByPath(
	path?: string,
	limit?: number
): Promise<CollectionPosts[]> {
	const posts = await getAllPosts();

	const filtered = posts.filter((post) => {
		if (!path) return !post.id.startsWith("series/");

		return post.filePath?.includes(`/post/${path}/`);
	});

	return limit ? filtered.slice(0, limit) : filtered;
}

export function groupPostsByYear(
	posts: CollectionPosts[]
): Map<number, CollectionPosts[]> {
	const grouped = new Map<number, CollectionPosts[]>();
	for (const post of posts) {
		const year = new Date(post.data.date).getFullYear();
		if (!grouped.has(year)) {
			grouped.set(year, []);
		}
		grouped.get(year)?.push(post);
	}
	return new Map([...grouped.entries()].sort((a, b) => b[0] - a[0]));
}

export function getAllTags(posts: Array<CollectionEntry<"post">>) {
	return posts.flatMap((post) => [...post.data.tags]);
}

export function getUniqueTags(posts: Array<CollectionEntry<"post">>) {
	return [...new Set(getAllTags(posts))];
}

export function getUniqueTagsWithCount(
	posts: Array<CollectionEntry<"post">>
): Array<[string, number]> {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
			new Map<string, number>()
		)
	].sort((a, b) => {
		if (b[1] !== a[1]) return b[1] - a[1];
		return a[0].localeCompare(b[0]);
	});
}

export function getReadTimeCount(content: string): number {
	const words = content.split(/\s+/).filter((word) => word.length > 0);
	const readTime = words.length / AVERAGE_READING_WORDS_PER_MINUTE;
	return Math.ceil(readTime);
}
