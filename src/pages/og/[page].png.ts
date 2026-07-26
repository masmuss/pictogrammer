import type { APIContext } from "astro";
import { createOgImageResponse } from "@/lib/utils/og-image";

export const prerender = true;

const STATIC_PAGE_OG = {
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
		description:
			"Daftar seri tulisan yang dikelompokkan berdasarkan topik tertentu."
	},
	tags: {
		title: "All Tags",
		description: "A list of all the topics I've written about in my posts."
	},
	tools: {
		title: "Tools",
		description:
			"Explore the tools and software I use daily to enhance my productivity and creativity."
	}
} satisfies Record<string, { title: string; description: string }>;

export async function getStaticPaths() {
	return Object.entries(STATIC_PAGE_OG).map(([page, og]) => ({
		params: { page },
		props: og
	}));
}

export async function GET({ props }: APIContext) {
	const { title, description } = props as {
		title: string;
		description: string;
	};

	return createOgImageResponse({
		title,
		description
	});
}
