import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";

// Convention: schema export name mirrors the collection key exactly
// (<key>Schema). Per-file entry collections (post, series) use z.object;
// single-index.json collections use z.array(...) of that collection's items.

function removeDupsAndLowerCase(array: string[]): string[] {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

export const postSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		description: z.string().optional(),
		coverImage: z
			.object({
				src: z.union([image(), z.url()]),
				alt: z.string()
			})
			.optional(),
		date: z
			.string()
			.or(z.date())
			.transform((val: string | number | Date) => new Date(val)),
		updatedDate: z
			.string()
			.or(z.date())
			.transform((val: string | number | Date) => new Date(val))
			.optional(),
		draft: z.boolean().default(false).optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase)
	});

export const seriesSchema = z.object({
	title: z.string(),
	description: z.string(),
	coverImage: z
		.object({
			src: z.string(),
			alt: z.string()
		})
		.optional()
});

export const experiencesSchema = z.array(
	z.object({
		id: z.string(),
		period: z.string(),
		title: z.string(),
		company: z.string()
	})
);

export const projectSchema = z.object({
	text: z.string(),
	description: z.string().optional(),
	href: z.string().optional(),
	liveHref: z.url().optional(),
	repoHref: z.url().optional(),
	featured: z.boolean().optional(),
	stacks: z.array(z.string()).optional()
});

export const projectsSchema = z.array(
	z.object({
		title: z.string(),
		projects: z.array(projectSchema)
	})
);

export const toolsSchema = z.array(
	z.object({
		title: z.string(),
		tools: z.array(
			z.object({
				name: z.string(),
				description: z.string(),
				href: z.string().optional()
			})
		)
	})
);

export const readingSchema = z.array(
	z.object({
		title: z.string(),
		author: z.string(),
		cover: z.url().optional(),
		status: z.enum(["reading", "read", "want-to-read"]),
		rating: z.number().min(1).max(5).optional(),
		url: z.url().optional(),
		dateRead: z.string().optional(),
		notes: z.string().optional()
	})
);
