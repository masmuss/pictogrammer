import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
	author: "Ahmad Musafir Khoirul Fattah",
	title: "pictogrammmer",
	subtitle: "Khoirul's Personal Website",
	description:
		"Fullstack wizard with a camera, weaving elegant websites while capturing the world through a lens. Transforming visions into digital and visual masterpieces.",
	email: "hello@khoirul.me",
	cvLink:
		"https://github.com/masmuss/curriculum-vitae/releases/latest/download/main.pdf",
	image: {
		src: "/og.png",
		alt: "Open Graph"
	},
	date: {
		locale: "id-ID",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric"
		}
	},
	socialLinks: [
		{
			text: "GitHub",
			href: "https://github.com/masmuss",
			icon: "ri--github-line",
			header: "ri--github-line"
		},
		{
			text: "Twitter",
			href: "https://x.com/rexbocho",
			icon: "ri--twitter-x-line",
			header: "ri--twitter-x-line"
		},
		{
			text: "LinkedIn",
			href: "https://www.linkedin.com/in/masmuss",
			icon: "ri--linkedin-box-line"
		},
		{
			text: "Instagram",
			href: "https://www.instagram.com/pictogrammmer",
			icon: "ri--instagram-line"
		},
		{
			text: "Threads",
			href: "https://www.threads.net/@khoe__rul",
			icon: "ri--threads-line"
		}
	],
	header: {
		logo: {
			src: "/logo.svg",
			alt: "Website Logo"
		},
		navLinks: [
			{
				text: "Home",
				href: "/",
				icon: "ri--home-line"
			},
			{
				text: "About",
				href: "/about",
				icon: "ri--user-line"
			},
			{
				text: "Blog",
				href: "/blog",
				icon: "ri--article-line"
			},
			{
				text: "Projects",
				href: "/projects",
				icon: "ri--code-line"
			},
			{
				text: "Tools",
				href: "/tools",
				icon: "ri--tools-line"
			}
		]
	},
	page: {
		blogLinks: [
			{
				text: "Blog",
				href: "/blog"
			}
		]
	}
};

export default siteConfig;
