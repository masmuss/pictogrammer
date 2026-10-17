import type { Project } from "@/types";
import { getContentEntryData } from "./loader";
import { projectsSchema } from "./schemas";

export async function getAllProjects(): Promise<Project[]> {
	const projects = getContentEntryData("projects", projectsSchema);

	return (await projects)
		.flatMap((category) => category.projects)
		.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export async function getFeaturedProjects(max?: number): Promise<Project[]> {
	const featured = (await getAllProjects()).filter((p) => p.featured);

	return featured.slice(0, max ?? featured.length);
}
