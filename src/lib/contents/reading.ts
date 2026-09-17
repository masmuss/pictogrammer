import type { CollectionEntry } from "astro:content";
import { getContentEntryData } from "./loader";
import { readingSchema } from "./schemas";

export type Book = CollectionEntry<"reading">["data"][number];

export async function getAllBooks(): Promise<Book[]> {
  return getContentEntryData("reading", readingSchema);
}
