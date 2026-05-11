<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import Kbd from "./Kbd.svelte";
	import SearchBar from "./SearchBar.svelte";
	import SearchResultItem from "./SearchResultItem.svelte";
	import type { createSearch } from "./search-state.svelte";

	let { search }: { search: ReturnType<typeof createSearch> } = $props();
</script>

{#if search.isOpen}
	<div
		class="bg-background/80 fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
		transition:fade={{ duration: 200 }}
		onclick={search.handleBackdropClick}
		role="button"
		tabindex="-1"
		onkeydown={(e) => e.key === "Escape" && search.closeSearch()}
	>
		<div
			class="border-border bg-card w-full max-w-7/12 overflow-hidden rounded-xl border shadow-2xl"
			transition:fly={{ y: -20, duration: 300 }}
		>
			<SearchBar {search} />

			<div class="max-h-[60vh] overflow-y-auto p-2">
				{#if search.results.length > 0}
					<div
						class="text-muted-foreground p-3 text-[10px] font-medium tracking-wider uppercase"
					>
						{search.results.length} results found
					</div>
					<div class="space-y-1">
						{#each search.results as result, i}
							<SearchResultItem {result} index={i} {search} />
						{/each}
					</div>
				{:else if search.query.length > 2}
					<div class="py-12 text-center">
						<span
							class="iconify ri--search-line text-muted-foreground/30 mx-auto h-8 w-8"
						></span>
						<p class="text-muted-foreground mt-4 text-sm">
							No results for "{search.query}"
						</p>
					</div>
				{:else}
					<div class="text-muted-foreground py-12 text-center">
						<p class="text-sm">Search for articles, projects, and more...</p>
					</div>
				{/if}
			</div>

			<div
				class="border-border bg-muted/50 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-[10px]"
			>
				<div class="flex items-center gap-4">
					<span class="flex items-center gap-1">
						<Kbd keys={["↵"]} class="opacity-100" />
						select
					</span>
					<span class="flex items-center gap-1">
						<Kbd keys={["↑↓"]} class="opacity-100" />
						navigate
					</span>
				</div>
				<div class="flex items-center gap-1">
					Search by <span class="text-accent-cta font-semibold">Pagefind</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
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
