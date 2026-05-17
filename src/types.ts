import type { CollectionEntry } from "astro:content";

export type PostKey = "post";

export type CollectionPosts = CollectionEntry<PostKey>;

export type Experience = CollectionEntry<"experiences">["data"][number];
export type Education = CollectionEntry<"educations">["data"][number];
export type Certification = CollectionEntry<"certifications">["data"][number];

export type ProjectCollection = CollectionEntry<"projects">["data"][number];
export type Project = ProjectCollection["projects"][number];

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
