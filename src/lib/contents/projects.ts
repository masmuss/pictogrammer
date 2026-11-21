import type { Project } from "@/types";
import { getContentEntryData } from "./loader";
import { projectsSchema } from "./schemas";

const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Python: "#3572A5",
	Go: "#00ADD8",
	PHP: "#4F5D95",
	Rust: "#dea584",
	HTML: "#e34c26",
	CSS: "#563d7c",
	Vue: "#41b883",
	Svelte: "#ff3e00",
	Astro: "#ff5d01",
	Dart: "#00B4AB",
	Kotlin: "#A97BFF",
	Swift: "#F05138",
	Java: "#b07219",
	Ruby: "#701516",
	Shell: "#89e051",
};

export const getLanguageColor = (language: string): string =>
	LANGUAGE_COLORS[language] ?? "var(--color-muted-foreground)";

const sortByYear = (a: Project, b: Project) => (b.year ?? 0) - (a.year ?? 0);

export async function getAllProjects(): Promise<Project[]> {
	const projects = getContentEntryData("projects", projectsSchema);

	return (await projects).sort(sortByYear);
}

export async function getFeaturedProjects(max?: number): Promise<Project[]> {
	const featured = (await getAllProjects()).filter((p) => p.featured);

	return featured.slice(0, max ?? featured.length);
}
