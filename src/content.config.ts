import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import {
	certificationsSchema,
	educationsSchema,
	experiencesSchema,
	postSchema,
	projectsSchema,
	seriesSchema
} from "@/lib/contents/schemas";

const post = defineCollection({
	loader: glob({ pattern: "**/**/*.{md,mdx}", base: "./src/content/post" }),
	schema: postSchema
});

const series = defineCollection({
	loader: glob({ pattern: "**/**/*.json", base: "./src/content/series" }),
	schema: seriesSchema
});

const experiences = defineCollection({
	loader: glob({ pattern: "**/**/*.json", base: "./src/content/experiences" }),
	schema: experiencesSchema
});

const educations = defineCollection({
	loader: glob({ pattern: "**/**/*.json", base: "./src/content/educations" }),
	schema: educationsSchema
});

const certifications = defineCollection({
	loader: glob({
		pattern: "**/**/*.json",
		base: "./src/content/certifications"
	}),
	schema: certificationsSchema
});

const projects = defineCollection({
	loader: glob({
		pattern: "**/**/*.json",
		base: "./src/content/projects"
	}),
	schema: projectsSchema
});

export const collections = {
	post,
	series,
	experiences,
	educations,
	certifications,
	projects
};
