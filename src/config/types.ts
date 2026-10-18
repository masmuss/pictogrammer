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
	showInHeader?: boolean;
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
};

export type Page = {
	blogLinks: Omit<NavLink, "icon">[];
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
	footerLinks: NavLink[];
	page: Page;
	ogPages: Record<string, OgPageMeta>;
};
