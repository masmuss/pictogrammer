import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import {
	certificationsSchema,
	educationsSchema,
	experiencesSchema,
	postSchema,
	projectsSchema,
	seriesSchema,
	skillsSchema,
	toolsSchema
} from "@/lib/contents/schemas";

const post = defineCollection({
	loader: glob({
		pattern: "**/**/*.{md,mdx}",
		base: "./src/content/post",
		deferRender: true
	}),
	schema: postSchema
});

const series = defineCollection({
	loader: glob({ pattern: "**/**/*.json", base: "./src/content/series" }),
	schema: seriesSchema
});

const experiences = defineCollection({
	loader: glob({
		pattern: "**/**/*.json",
		base: "./src/content/experiences"
	}),
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

const skills = defineCollection({
	loader: glob({
		pattern: "**/**/*.json",
		base: "./src/content/skills"
	}),
	schema: skillsSchema
});

const tools = defineCollection({
	loader: glob({
		pattern: "**/**/*.json",
		base: "./src/content/tools"
	}),
	schema: toolsSchema
});

export const collections = {
	post,
	series,
	experiences,
	educations,
	certifications,
	projects,
	skills,
	tools
};
