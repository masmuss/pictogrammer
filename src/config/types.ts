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
	icon: string;
};

export type Header = {
	logo: {
		src: string;
		alt: string;
	};
	navLinks: NavLink[];
};

export type Page = {
	blogLinks: Omit<NavLink, "icon">[];
};

export type SiteConfig = {
	author: string;
	title: string;
	subtitle: string;
	description: string;
	email: string;
	cvLink?: string;
	image: Image;
	date: DateConfig;
	socialLinks: SocialLink[];
	header: Header;
	page: Page;
};
