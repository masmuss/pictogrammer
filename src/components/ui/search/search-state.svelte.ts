import { onDestroy, tick } from "svelte";

export interface PagefindResultData {
	url: string;
	excerpt: string;
	meta: {
		title: string;
		[key: string]: string;
	};
}

interface PagefindSearchResult {
	data: () => Promise<PagefindResultData>;
}

interface Pagefind {
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
	let previousBodyOverflow = $state<string | null>(null);
	let searchRequestId = $state(0);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let initPromise: Promise<void> | null = null;

	function initPagefind(): Promise<void> {
		if (initPromise) return initPromise;

		initPromise = (async () => {
			try {
				if (typeof window !== "undefined") {
					const pagefindPath = `${import.meta.env.BASE_URL}pagefind/pagefind.js`;
					const pf = await import(/* @vite-ignore */ pagefindPath);
					pagefind = pf as Pagefind;
					await pagefind.init();
				}
			} catch (_e) {
				console.log(
					"Pagefind index not found. This is normal in development mode. Run 'bun run build' to generate the search index."
				);
			}
		})();

		return initPromise;
	}

	// Trigger Pagefind initialization when the search modal is opened
	$effect(() => {
		if (isOpen) {
			void initPagefind();
		}
	});

	// Declarative scroll lock
	$effect(() => {
		if (isOpen) {
			if (previousBodyOverflow === null) {
				previousBodyOverflow = document.body.style.overflow;
			}
			document.body.style.overflow = "hidden";
		} else if (previousBodyOverflow !== null) {
			document.body.style.overflow = previousBodyOverflow;
			previousBodyOverflow = null;
		}
	});

	onDestroy(() => {
		if (previousBodyOverflow !== null) {
			document.body.style.overflow = previousBodyOverflow;
		}
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
	});

	$effect(() => {
		if (isOpen && searchInput) {
			void tick().then(() => searchInput?.focus());
		}
	});

	function toggleSearch() {
		isOpen = !isOpen;
	}

	function closeSearch() {
		isOpen = false;
		query = "";
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		results = [];
		selectedIndex = -1;
		isSearching = false;
	}

	async function handleSearch() {
		const trimmedQuery = query.trim();

		if (trimmedQuery.length < 2) {
			++searchRequestId;
			if (debounceTimer) {
				clearTimeout(debounceTimer);
				debounceTimer = null;
			}
			results = [];
			selectedIndex = -1;
			isSearching = false;
			return;
		}

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		const requestId = ++searchRequestId;
		isSearching = true;

		debounceTimer = setTimeout(async () => {
			if (requestId !== searchRequestId) return;

			if (!pagefind) {
				await initPagefind();
			}

			if (!pagefind || requestId !== searchRequestId) {
				isSearching = false;
				return;
			}

			try {
				const search = await pagefind.search(trimmedQuery);
				const limitedResults = search.results.slice(0, 10);
				const rawResults = await Promise.all(
					limitedResults.map((r) => r.data())
				);
				if (requestId !== searchRequestId) return;

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
				if (requestId !== searchRequestId) return;
				console.error("Search failed", e);
			} finally {
				if (requestId === searchRequestId) {
					isSearching = false;
				}
			}
		}, 300);
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
		set selectedIndex(value: number) {
			selectedIndex = value;
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
