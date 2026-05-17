import { getEntry } from "astro:content";

export async function getAllTools() {
	const entry = await getEntry("tools", "index");

	if (!entry) {
		throw new Error("Missing tools content at src/content/tools/index.json");
	}

	return entry.data;
}
