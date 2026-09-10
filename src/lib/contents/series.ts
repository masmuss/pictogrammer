import { getCollection, getEntry } from "astro:content";
import type { CollectionPosts } from "@/types";
import { getAllPosts } from "./post";
import { getPostTimestamp } from "./posts/date";

const SERIES_PREFIX = "series";

function getSeriesIdFromPostId(postId: string): string | null {
	const parts = postId.split("/");

	if (parts[0] !== SERIES_PREFIX) return null;

	const seriesId = parts[1];
	if (!seriesId) return null;

	return seriesId;
}

export async function getAllSeries() {
	return getCollection("series");
}

export async function getSeriesById(id: string) {
	return getEntry("series", id);
}

export async function getPostsBySeries(seriesId: string) {
	const posts = await getAllPosts();
	return posts
		.filter((post) => getSeriesIdFromPostId(post.id) === seriesId)
		.sort((a, b) => {
			const dateA = getPostTimestamp(a);
			const dateB = getPostTimestamp(b);

			if (dateA !== dateB) {
				return dateA - dateB;
			}

			const matchA = a.data.title.match(/#(\d+)/);
			const matchB = b.data.title.match(/#(\d+)/);
			if (matchA && matchB) {
				const a = matchA[1];
				const b = matchB[1];
				if (a && b) {
					return Number.parseInt(a, 10) - Number.parseInt(b, 10);
				}
			}

			return 0;
		});
}

export function getSeriesForPost(post: CollectionPosts) {
	return getSeriesIdFromPostId(post.id);
}
