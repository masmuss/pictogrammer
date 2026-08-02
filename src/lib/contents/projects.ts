import { getEntry } from "astro:content";
import type { Project } from "@/types";

export const CATEGORY_ICONS: Record<string, string> = {
	Website: "ri--global-line",
	API: "ri--terminal-box-line",
	"Mobile App": "ri--smartphone-line",
	"Artificial Intelligence": "ri--brain-line",
	"System & Tooling": "ri--tools-line"
};

export async function getAllProjects() {
	const entry = await getEntry("projects", "index");

	if (!entry) {
		throw new Error(
			"Missing projects content at src/content/projects/index.json"
		);
	}

	return entry.data;
}

export async function getFeaturedProjects(max?: number): Promise<Project[]> {
	const allProjects = await getAllProjects();
	const featured = allProjects
		.flatMap((c) => c.projects)
		.filter((p) => p.featured)
		.slice(0, max ?? allProjects.length);

	return featured;
}
