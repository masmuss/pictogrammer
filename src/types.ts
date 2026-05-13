import type { CollectionEntry } from "astro:content";

export type PostKey = "post";

export type CollectionPosts = CollectionEntry<PostKey>;

export type Education = {
	period: string;
	institution: string;
	degree: string;
	gpa?: string;
	coursework: string[];
};

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

export type Experience = {
	id: string;
	period: string;
	title: string;
	company: string;
	logo?: string;
	icon?: string;
	location?: string;
	kind?: "professional" | "campus";
	umbrellaOrg?: string;
	summary?: string;
	skills?: string[];
	highlights: string[];
};

export type Certification = {
	title: string;
	issuer: string;
	date: string;
	expiredDate?: string;
	credentialUrl?: string;
	description?: string;
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
