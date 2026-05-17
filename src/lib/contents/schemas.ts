import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
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
		company: z.string(),
		logo: z.string().optional(),
		icon: z.string().optional(),
		location: z.string().optional(),
		kind: z.enum(["professional", "campus"]).optional(),
		umbrellaOrg: z.string().optional(),
		summary: z.string().optional(),
		skills: z.array(z.string()).optional(),
		highlights: z.array(z.string())
	})
);

export const educationsSchema = z.array(
	z.object({
		period: z.string(),
		institution: z.string(),
		degree: z.string(),
		gpa: z.string().optional(),
		coursework: z.array(z.string())
	})
);

export const projectSchema = z.object({
	text: z.string(),
	description: z.string().optional(),
	thumbnail: z.string().optional(),
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
				description: z.string()
			})
		)
	})
);

export const skillsSchema = z.array(
	z.object({
		title: z.string(),
		skills: z.array(
			z.object({
				name: z.string(),
				description: z.string(),
				icon: z.string().optional()
			})
		)
	})
);

export const certificationsSchema = z.array(
	z.object({
		title: z.string(),
		issuer: z.string(),
		date: z.string(),
		expiredDate: z.string().optional(),
		credentialUrl: z.url().optional(),
		description: z.string().optional()
	})
);
