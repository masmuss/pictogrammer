import { getEntry } from "astro:content";
import type { Project } from "@/types";

export const CATEGORY_ICONS: Record<string, string> = {
	Website: "globe",
	API: "terminal-window",
	"Mobile App": "mobile-device",
	"Artificial Intelligence": "brain",
	"System & Tooling": "toolbox"
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
