import type { CollectionEntry } from "astro:content";

export type PostKey = "post";

export type CollectionPosts = CollectionEntry<PostKey>;

export type Experience = CollectionEntry<"experiences">["data"][number];
export type Education = CollectionEntry<"educations">["data"][number];
export type Certification = CollectionEntry<"certifications">["data"][number];

export type Project = {
	text: string;
	description?: string;
	thumbnail?: string;
	href?: string;
	liveHref?: string;
	repoHref?: string;
	featured?: boolean;
};

export type ProjectCollection = {
	title: string;
	projects: Project[];
};

export type PaginationLink = {
	url: string;
	text?: string;
	srLabel?: string;
};

export type AdmonitionType =
	| "tip"
	| "note"
	| "important"
	| "caution"
	| "warning";
