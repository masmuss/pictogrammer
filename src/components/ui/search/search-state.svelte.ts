import { onMount } from "svelte";

export interface PagefindResultData {
	url: string;
	excerpt: string;
	meta: {
		title: string;
		[key: string]: string;
	};
}

export interface PagefindSearchResult {
	data: () => Promise<PagefindResultData>;
}

export interface Pagefind {
	init: () => Promise<void>;
	search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
}

export function createSearch() {
	let isOpen = $state(false);
	let query = $state("");
	let results = $state<PagefindResultData[]>([]);
	let isSearching = $state(false);
	let selectedIndex = $state(-1);
	let pagefind = $state<Pagefind | null>(null);
	let searchInput = $state<HTMLInputElement | null>(null);

	onMount(async () => {
		try {
			if (typeof window !== "undefined") {
				const pagefindPath = "/dist/pagefind/pagefind.js";
				// @ts-ignore
				const pf = await import(/* @vite-ignore */ pagefindPath);
				pagefind = pf as Pagefind;
				await pagefind.init();
			}
		} catch (_e) {
			console.log(
				"Pagefind index not found. This is normal in development mode. Run 'npm run build' to generate the search index."
			);
		}
	});

	// Declarative scroll lock
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	});

	function toggleSearch() {
		isOpen = !isOpen;
		if (isOpen) {
			setTimeout(() => searchInput?.focus(), 150);
		}
	}

	function closeSearch() {
		isOpen = false;
		query = "";
		results = [];
		selectedIndex = -1;
		isSearching = false;
	}

	async function handleSearch() {
		if (!pagefind || query.trim().length < 2) {
			results = [];
			selectedIndex = -1;
			isSearching = false;
			return;
		}

		isSearching = true;
		try {
			const search = await pagefind.search(query);
			const limitedResults = search.results.slice(0, 10);
			const rawResults = await Promise.all(limitedResults.map((r) => r.data()));

			results = rawResults.map((result) => {
				let url = result.url;
				if (url.startsWith("/dist/")) {
					url = url.replace("/dist/", "/");
				}
				if (url.length > 1 && url.endsWith("/")) {
					url = url.slice(0, -1);
				}
				return { ...result, url };
			});

			selectedIndex = results.length > 0 ? 0 : -1;
		} catch (e) {
			console.error("Search failed", e);
		} finally {
			isSearching = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			toggleSearch();
		}

		if (!isOpen) return;

		if (e.key === "Escape") {
			closeSearch();
		}

		if (results.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				selectedIndex = (selectedIndex + 1) % results.length;
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				selectedIndex = (selectedIndex - 1 + results.length) % results.length;
			} else if (e.key === "Enter" && selectedIndex >= 0) {
				e.preventDefault();
				const result = results[selectedIndex];
				if (result) {
					window.location.href = result.url;
					closeSearch();
				}
			}
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeSearch();
		}
	}

	return {
		get isOpen() {
			return isOpen;
		},
		set isOpen(value) {
			isOpen = value;
		},
		get query() {
			return query;
		},
		set query(value) {
			query = value;
		},
		get results() {
			return results;
		},
		get isSearching() {
			return isSearching;
		},
		get selectedIndex() {
			return selectedIndex;
		},
		get searchInput() {
			return searchInput;
		},
		set searchInput(value) {
			searchInput = value;
		},
		toggleSearch,
		closeSearch,
		handleSearch,
		handleKeydown,
		handleBackdropClick
	};
}
