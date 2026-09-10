import type { CollectionPosts } from "@/types";
import { getPostMonth, getPostYear } from "./date";

export function groupPostsByYear(
	posts: CollectionPosts[]
): Map<number, CollectionPosts[]> {
	const grouped = new Map<number, CollectionPosts[]>();
	for (const post of posts) {
		const year = getPostYear(post);
		const yearPosts = grouped.get(year) ?? [];
		yearPosts.push(post);
		grouped.set(year, yearPosts);
	}

	return new Map([...grouped.entries()].sort((a, b) => b[0] - a[0]));
}

export type YearGroup = {
	year: number;
	months: MonthGroup[];
	count: number;
};

export type MonthGroup = {
	month: number;
	monthName: string;
	posts: CollectionPosts[];
};

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
] as const;

export function groupPostsForArchive(posts: CollectionPosts[]): YearGroup[] {
	const grouped = new Map<number, Map<number, CollectionPosts[]>>();

	for (const post of posts) {
		const year = getPostYear(post);
		const month = getPostMonth(post);

		let yearPosts = grouped.get(year);
		if (!yearPosts) {
			yearPosts = new Map();
			grouped.set(year, yearPosts);
		}

		let monthPosts = yearPosts.get(month);
		if (!monthPosts) {
			monthPosts = [];
			yearPosts.set(month, monthPosts);
		}

		monthPosts.push(post);
	}

	return Array.from(grouped.entries())
		.sort(([a], [b]) => b - a)
		.map(([year, monthsMap]) => {
			const months = Array.from(monthsMap.entries())
				.sort(([a], [b]) => b - a)
				.map(([month, monthPosts]) => ({
					month,
					monthName: MONTH_NAMES[month] ?? "Unknown",
					posts: monthPosts
				}));
			const count = months.reduce(
				(total, month) => total + month.posts.length,
				0
			);
			return { year, months, count };
		});
}
