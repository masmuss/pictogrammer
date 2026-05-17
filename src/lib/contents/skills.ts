import { getEntry } from "astro:content";
import type { Skill, SkillCollection } from "@/types";

export type SkillsTab = {
	id: string;
	label: string;
	skills: Skill[];
};

const featuredNames = [
	"TypeScript",
	"Next.js",
	"Astro",
	"Go",
	"PostgreSQL",
	"Redis",
	"Tailwind CSS",
	"Playwright",
	"OpenTelemetry",
	"Cloudflare"
];

const slugify = (text: string) =>
	text
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

export async function getAllSkillCollections() {
	const entry = await getEntry("skills", "index");

	if (!entry) {
		throw new Error("Missing skills content at src/content/skills/index.json");
	}

	return entry.data;
}

export function getSkillsTabs(collections: SkillCollection[]): SkillsTab[] {
	const allSkills = Array.from(
		new Map(
			collections
				.flatMap((collection) => collection.skills)
				.map((skill) => [skill.name, skill])
		).values()
	);

	const featuredFromPreset = featuredNames
		.map((name) => allSkills.find((skill) => skill.name === name))
		.filter((skill): skill is Skill => Boolean(skill));

	const featuredSkills =
		featuredFromPreset.length >= 8
			? featuredFromPreset
			: allSkills.slice(0, 10);

	return [
		{ id: "featured", label: "Featured", skills: featuredSkills },
		{ id: "all", label: "All", skills: allSkills },
		...collections.map((collection) => ({
			id: slugify(collection.title),
			label: collection.title,
			skills: collection.skills
		}))
	];
}
