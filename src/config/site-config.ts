import type { SiteConfig } from "./types";

const siteConfig = {
	author: "Ahmad Musafir Khoirul Fattah",
	title: "pictogrammmer",
	subtitle: "Khoirul's Personal Website",
	homepage: "https://khoirul.me",
	description:
		"Fullstack wizard with a camera, weaving elegant websites while capturing the world through a lens. Transforming visions into digital and visual masterpieces.",
	email: "hello@khoirul.me",
	cvLink:
		"https://github.com/masmuss/curriculum-vitae/releases/download/latest/Ahmad_Musafir_Khoirul_Fattah_FullStack_Backend_Focused.pdf",
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
			icon: "ph:github-logo",
			header: "ph:github-logo"
		},
		{
			text: "Twitter",
			href: "https://x.com/rexbocho",
			icon: "ph:x-logo",
			header: "ph:x-logo"
		},
		{
			text: "LinkedIn",
			href: "https://www.linkedin.com/in/masmuss",
			icon: "ph:linkedin-logo"
		},
		{
			text: "Instagram",
			href: "https://www.instagram.com/pictogrammmer",
			icon: "ph:instagram-logo"
		},
		{
			text: "Threads",
			href: "https://www.threads.net/@khoe__rul",
			icon: "ph:threads-logo"
		}
	],
	header: {
		logo: {
			src: "/logo.svg",
			alt: "Website Logo"
		},
		textLinks: [
			{ text: "About", href: "/about" },
			{ text: "Blog", href: "/blog" },
			{ text: "Projects", href: "/projects" },
			{ text: "Now", href: "/now" }
		],
		iconLinks: [
			{ text: "Reading List", href: "/reading-list", icon: "ph:book" },
			{ text: "Colophon", href: "/colophon", icon: "ph:info" },
			{ text: "Tools", href: "/tools", icon: "ph:toolbox" },
			{
				text: "GitHub",
				href: "https://github.com/masmuss",
				icon: "ph:github-logo"
			},
			{ text: "Twitter", href: "https://x.com/rexbocho", icon: "ph:x-logo" },
			{ text: "RSS", href: "/rss.xml", icon: "ph:rss" }
		]
	},
	page: {
		blogLinks: [
			{
				text: "Blog",
				href: "/blog"
			}
		]
	},
	giscus: {
		repo: "masmuss/pictogrammer",
		repoId: "R_kgDOPKC8fg",
		category: "General",
		categoryId: "DIC_kwDOPKC8fs4Ct6-3",
		mapping: "title",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "bottom",
		lang: "en",
		loading: "lazy"
	},
	ogPages: {
		about: {
			title: "About",
			description:
				"Learn more about Khoirul Fattah - a full-stack developer and photographer based in Surabaya."
		},
		blog: {
			title: "Blog",
			description:
				"Read my latest blog posts on various topics including technology, programming, and personal experiences."
		},
		notes: {
			title: "Notes",
			description: "Learning notes, tutorials, and project documentation."
		},
		projects: {
			title: "Projects",
			description:
				"Explore my projects that showcase my skills and creativity in various domains."
		},
		reflections: {
			title: "Reflections",
			description: "Personal thoughts, reflections, and life experiences."
		},
		series: {
			title: "Series",
			description: "Grouped writing series organized by specific topics."
		},
		tags: {
			title: "All Tags",
			description: "A list of all the topics I've written about in my posts."
		},
		tools: {
			title: "Tools",
			description:
				"Explore the tools and software I use daily to enhance my productivity and creativity."
		},
		now: {
			title: "Now",
			description: "What I'm currently up to right now."
		},
		colophon: {
			title: "Colophon",
			description: "How this digital garden is crafted and maintained."
		},
		"reading-list": {
			title: "Reading List",
			description: "Books I've read, currently reading, or want to read."
		}
	}
} satisfies SiteConfig;

export default siteConfig;
