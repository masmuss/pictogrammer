<script lang="ts">
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	interface PagefindResultData {
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

	let isOpen = $state(false);
	let query = $state("");
	let results = $state<PagefindResultData[]>([]);
	let isSearching = $state(false);
	let selectedIndex = $state(-1);
	let pagefind = $state<Pagefind | null>(null);
	let searchInput = $state<HTMLInputElement | null>(null);

	onMount(async () => {
		// Load pagefind
		try {
			if (typeof window !== "undefined") {
				// Use a template literal to prevent Vite from trying to resolve this at build time
				const pagefindPath = "/dist/pagefind/pagefind.js";
				// @ts-ignore
				const pf = await import(/* @vite-ignore */ pagefindPath);
				pagefind = pf as Pagefind;
				await pagefind.init();
			}
		} catch (e) {
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

	function toggleSearch() {
		isOpen = !isOpen;
		if (isOpen) {
			// focus input after transition
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
			// Limit to 10 results for performance, or show all if desired
			const limitedResults = search.results.slice(0, 10);
			const rawResults = await Promise.all(limitedResults.map((r) => r.data()));

			// Sanitize URLs: remove /dist/ prefix and handle trailing slashes
			results = rawResults.map((result) => {
				let url = result.url;

				// Remove /dist/ prefix if it exists (common issue with some Pagefind setups)
				if (url.startsWith("/dist/")) {
					url = url.replace("/dist/", "/");
				}

				// Handle trailing slash based on site config (trailingSlash: "never")
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

	// Handle click outside
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeSearch();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Trigger Button -->
<button
	type="button"
	onclick={toggleSearch}
	class="group/button hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:ms-4 lg:w-auto lg:px-2 lg:py-1"
	aria-label="Search"
>
	<span class="iconify ri--search-line h-4 w-4"></span>
	<span class="ml-2 hidden text-xs lg:inline-block">Search</span>
	<span
		class="border-border bg-muted/50 ml-2 hidden items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium opacity-50 lg:flex"
	>
		<kbd class="font-sans">⌘</kbd>
		<kbd class="font-sans">K</kbd>
	</span>
</button>

{#if isOpen}
	<div
		class="bg-background/80 fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 backdrop-blur-lg sm:pt-24"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		role="button"
		tabindex="-1"
		onkeydown={(e) => e.key === "Escape" && closeSearch()}
	>
		<div
			class="border-border bg-card w-full max-w-7/12 overflow-hidden rounded-xl border shadow-2xl"
			transition:fly={{ y: -20, duration: 300 }}
		>
			<div class="border-border relative flex items-center border-b px-4">
				<span class="iconify ri--search-line text-muted-foreground h-5 w-5"
				></span>
				<input
					bind:this={searchInput}
					bind:value={query}
					oninput={handleSearch}
					type="text"
					placeholder="Search articles, projects..."
					class="placeholder:text-muted-foreground h-12 w-full bg-transparent px-4 text-sm outline-none"
				/>
				{#if isSearching}
					<div
						class="border-accent-cta mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
					></div>
				{/if}
				<button
					onclick={closeSearch}
					class="border-border text-muted-foreground hover:bg-muted rounded-md border px-1.5 py-0.5 text-xs font-medium"
				>
					ESC
				</button>
			</div>

			<div class="max-h-[60vh] overflow-y-auto p-2">
				{#if results.length > 0}
					<div
						class="text-muted-foreground p-3 text-sm font-medium tracking-wider uppercase"
					>
						{results.length} results found
					</div>
					<div class="space-y-1">
						{#each results as result, i}
							<a
								href={result.url}
								class="group block rounded-lg p-3 transition-colors {selectedIndex ===
								i
									? 'bg-muted ring-border ring-1'
									: 'hover:bg-muted'}"
								onclick={closeSearch}
							>
								<div class="flex items-center justify-between">
									<h3
										class="text-sm font-semibold transition-colors {selectedIndex ===
										i
											? 'text-accent-cta'
											: 'group-hover:text-accent-cta'}"
									>
										{result.meta.title}
									</h3>
									<span
										class="iconify ri--arrow-right-s-line text-muted-foreground h-4 w-4 transition-transform {selectedIndex ===
										i
											? 'translate-x-1'
											: 'group-hover:translate-x-1'}"
									></span>
								</div>
								<p class="text-muted-foreground mt-1 line-clamp-2 text-xs">
									{@html result.excerpt}
								</p>
							</a>
						{/each}
					</div>
				{:else if query.length > 2}
					<div class="py-12 text-center">
						<span
							class="iconify ri--search-line text-muted-foreground/30 mx-auto h-8 w-8"
						></span>
						<p class="text-muted-foreground mt-4 text-sm">
							No results for "{query}"
						</p>
					</div>
				{:else}
					<div class="text-muted-foreground py-12 text-center">
						<p class="text-sm">Search for articles, projects, and more...</p>
					</div>
				{/if}
			</div>

			<div
				class="border-border bg-muted/50 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-sm"
			>
				<div class="flex items-center gap-4">
					<span class="flex items-center gap-1">
						<kbd class="border-border bg-background rounded border px-1 text-xs"
							>↵</kbd
						>
						select
					</span>
					<span class="flex items-center gap-1">
						<kbd class="border-border bg-background rounded border px-1 text-xs"
							>↑↓</kbd
						> navigate
					</span>
				</div>
				<div class="flex items-center gap-1 text-xs">
					Search by <span class="text-accent-cta font-semibold">Pagefind</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Optional: Custom scrollbar for results */
	div::-webkit-scrollbar {
		width: 8px;
	}
	div::-webkit-scrollbar-track {
		background: transparent;
	}
	div::-webkit-scrollbar-thumb {
		background: hsl(var(--muted));
		border-radius: 4px;
	}
	div::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--muted-foreground) / 0.5);
	}
</style>
