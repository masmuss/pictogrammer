import type { Project } from "@/types";
import { getContentEntryData } from "./loader";
import { projectsSchema } from "./schemas";

export async function getAllProjects() {
	return getContentEntryData("projects", projectsSchema);
}

export async function getFeaturedProjects(max?: number): Promise<Project[]> {
	const allProjects = await getAllProjects();
	const featured = allProjects
		.flatMap((c) => c.projects)
		.filter((p) => p.featured)
		.slice(0, max ?? allProjects.length);

	return featured;
}
