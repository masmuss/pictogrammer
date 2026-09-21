import { getEntry } from "astro:content";
import type { z } from "astro/zod";

type SupportedCollection =
	| "experiences"
	| "projects"
	| "tools"
	| "reading";

export async function getContentEntryData<T extends z.ZodType>(
	collection: SupportedCollection,
	schema: T,
	id = "index"
): Promise<z.output<T>> {
	const entry = await getEntry(collection, id);

	if (!entry) {
		throw new Error(
			`Missing ${collection} content at content/${collection}/${id}.json`
		);
	}

	return schema.parse(entry.data);
}
