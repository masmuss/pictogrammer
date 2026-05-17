import { getEntry } from "astro:content";

export async function getAllProjects() {
	const entry = await getEntry("projects", "index");

	if (!entry) {
		throw new Error(
			"Missing projects content at src/content/projects/index.json"
		);
	}

	return entry.data;
}
