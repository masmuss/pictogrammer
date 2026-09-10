export type SeoArticle = {
	publishedTime?: Date;
	modifiedTime?: Date;
	author?: string;
	tags?: string[];
};

export type SeoTwitter = {
	site?: string;
	creator?: string;
	card?: "summary" | "summary_large_image";
};

export type SeoExtraLink = {
	title?: string;
	rel: string;
	href: string;
	type?: string;
	media?: string;
	sizes?: string;
};

export type SeoBreadcrumb = {
	name: string;
	item: string;
};
