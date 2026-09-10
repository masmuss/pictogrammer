import type { CollectionPosts } from "@/types";

export function getPostTimestamp(post: CollectionPosts): number {
	return post.data.date.getTime();
}

export function getPostYear(post: CollectionPosts): number {
	return post.data.date.getFullYear();
}

export function getPostMonth(post: CollectionPosts): number {
	return post.data.date.getMonth();
}
