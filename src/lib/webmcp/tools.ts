import { MAX_QUERY_LENGTH, MIN_QUERY_LENGTH } from "@/lib/search/constants";
import {
	loadPagefind,
	normalizeResultUrl,
	searchPagefind
} from "@/lib/search/pagefind";
import type { ModelContextTool } from "./types";

const SEARCH_RESULT_LIMIT = 5;

function readQuery(input: { query?: unknown }): string {
	return typeof input.query === "string" ? input.query.trim() : "";
}

function queryError(query: string): string | null {
	if (query.length < MIN_QUERY_LENGTH) {
		return `Query must be at least ${MIN_QUERY_LENGTH} characters.`;
	}

	if (query.length > MAX_QUERY_LENGTH) {
		return `Query must be at most ${MAX_QUERY_LENGTH} characters.`;
	}

	return null;
}

function assertActive(signal: AbortSignal): void {
	if (signal.aborted) throw new Error("Search cancelled.");
}

export const siteOverviewTool: ModelContextTool = {
	name: "getSiteOverview",
	title: "Get site overview",
	description:
		"Returns a machine-readable overview of khoirul.me, including author info, available pages, and links to all posts and projects.",
	inputSchema: {
		type: "object",
		properties: {},
		additionalProperties: false
	},
	annotations: { readOnlyHint: true },
	async execute(_input, { signal }) {
		try {
			const response = await fetch(`${import.meta.env.BASE_URL}llms.txt`, {
				signal
			});

			if (!response.ok) {
				return `Unable to load the site overview (HTTP ${response.status}).`;
			}

			return await response.text();
		} catch (error) {
			if (signal.aborted) return "Request cancelled.";

			console.error("WebMCP site overview failed", error);
			return "Unable to load the site overview. Please try again later.";
		}
	}
};

export const searchPostsTool: ModelContextTool = {
	name: "searchPosts",
	title: "Search posts",
	description:
		"Full-text search across all blog posts on khoirul.me. Returns up to 5 matching results with titles, URLs, and excerpts.",
	inputSchema: {
		type: "object",
		properties: {
			query: {
				type: "string",
				description: "Keyword or phrase to search for",
				minLength: MIN_QUERY_LENGTH,
				maxLength: MAX_QUERY_LENGTH
			}
		},
		required: ["query"],
		additionalProperties: false
	},
	annotations: { readOnlyHint: true },
	async execute(input, { signal }) {
		const query = readQuery(input);
		const validationError = queryError(query);
		if (validationError) return { error: validationError };

		try {
			const pagefind = await loadPagefind();
			assertActive(signal);

			const results = await searchPagefind(
				pagefind,
				query,
				SEARCH_RESULT_LIMIT
			);

			return results.map((result) => {
				const normalized = normalizeResultUrl(result);
				return {
					title: normalized.meta.title,
					url: normalized.url,
					excerpt: normalized.excerpt
				};
			});
		} catch (error) {
			if (signal.aborted) return { error: "Search cancelled." };

			console.error("WebMCP search failed", error);
			return {
				error: "Search is unavailable right now. Please try again later."
			};
		}
	}
};

export const webMcpTools: ModelContextTool[] = [
	siteOverviewTool,
	searchPostsTool
];
