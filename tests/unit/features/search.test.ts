import { describe, expect, it } from "vitest";
import {
	MIN_QUERY_LENGTH,
	normalizeResultUrl,
	SEARCH_DEBOUNCE_MS
} from "@/components/features/search/search-results";
import {
	createInitialState,
	resetState
} from "@/components/features/search/search-state";

describe("createInitialState", () => {
	it("returns a closed, empty state", () => {
		expect(createInitialState()).toEqual({
			query: "",
			results: [],
			isSearching: false,
			selectedIndex: -1
		});
	});
});

describe("resetState", () => {
	it("clears query, results, and selection", () => {
		const state = createInitialState();
		state.query = "astro";
		state.results = [
			{ url: "/blog/a/", excerpt: "e", meta: { title: "A" } }
		];
		state.isSearching = true;
		state.selectedIndex = 2;

		resetState(state);

		expect(state).toEqual(createInitialState());
	});
});

describe("normalizeResultUrl", () => {
	it("strips /dist/ prefix and trailing slash", () => {
		const result = normalizeResultUrl({
			url: "/dist/blog/a/",
			excerpt: "e",
			meta: { title: "A" }
		});
		expect(result.url).toBe("/blog/a");
	});

	it("leaves clean urls untouched", () => {
		const result = normalizeResultUrl({
			url: "/projects",
			excerpt: "e",
			meta: { title: "P" }
		});
		expect(result.url).toBe("/projects");
	});
});

describe("search thresholds", () => {
	it("requires at least 2 chars before searching", () => {
		expect(MIN_QUERY_LENGTH).toBe(2);
	});

	it("debounces rapid keystrokes", () => {
		expect(SEARCH_DEBOUNCE_MS).toBeGreaterThan(0);
	});
});
