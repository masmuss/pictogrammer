export type Image = {
	src: string;
	alt: string;
};

export type DateConfig = {
	locale: string;
	options: Intl.DateTimeFormatOptions;
};

export type SocialLink = {
	text: string;
	href: string;
	icon: string;
	header?: string;
};

export type NavLink = {
	text: string;
	href: string;
	icon?: string;
};

export type Header = {
	logo: {
		src: string;
		alt: string;
	};
	textLinks: NavLink[];
	iconLinks: NavLink[];
};

export type Page = {
	blogLinks: Omit<NavLink, "icon">[];
};

export type GiscusConfig = {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	lang: string;
	loading: string;
};

export type OgPageMeta = {
	title: string;
	description: string;
};

export type SiteConfig = {
	author: string;
	title: string;
	subtitle: string;
	homepage: string;
	description: string;
	email: string;
	cvLink?: string;
	image: Image;
	date: DateConfig;
	socialLinks: SocialLink[];
	header: Header;
	page: Page;
	giscus: GiscusConfig;
	ogPages: Record<string, OgPageMeta>;
};
