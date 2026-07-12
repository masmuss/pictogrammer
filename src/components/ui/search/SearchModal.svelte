<script lang="ts">
import Kbd from "./Kbd.svelte";
import SearchBar from "./SearchBar.svelte";
import SearchResultItem from "./SearchResultItem.svelte";
import type { createSearch } from "./search-state.svelte";

let { search }: { search: ReturnType<typeof createSearch> } = $props();
let dialogElement: HTMLDialogElement;

$effect(() => {
	if (search.isOpen && dialogElement && !dialogElement.open) {
		dialogElement.showModal();
		// Prevent body scroll when open
		document.body.style.overflow = "hidden";
	} else if (!search.isOpen && dialogElement && dialogElement.open) {
		dialogElement.close();
		document.body.style.overflow = "";
	}
});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogElement}
	class="border-border bg-card w-full max-w-4xl overflow-hidden rounded-xl border shadow-2xl backdrop:bg-background/80 mt-16 sm:mt-24 p-0 open:flex flex-col"
	aria-label="Search"
	aria-describedby="search-modal-instructions"
	onclose={() => search.closeSearch()}
	onclick={(e) => {
		if (e.target === dialogElement) search.closeSearch();
	}}
>
	<SearchBar {search} />

	<div class="search-results max-h-[60vh] overflow-y-auto p-2">
		{#if search.results.length > 0}
			<div
				class="text-muted-foreground p-3 text-xs font-medium tracking-wider uppercase"
			>
				{search.results.length} results found
			</div>
			<div class="space-y-1" role="listbox" aria-label="Search results">
				{#each search.results as result, i}
					<SearchResultItem {result} index={i} {search} />
				{/each}
			</div>
		{:else if search.query.trim().length >= 2}
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
		id="search-modal-instructions"
		class="border-border bg-muted/50 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs"
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
</dialog>

<style>
	dialog {
		opacity: 0;
		transform: translateY(-20px);
		transition:
			opacity 0.3s ease-out,
			transform 0.3s ease-out,
			display 0.3s allow-discrete,
			overlay 0.3s allow-discrete;
	}
	dialog[open] {
		opacity: 1;
		transform: translateY(0);

		@starting-style {
			opacity: 0;
			transform: translateY(-20px);
		}
	}

	dialog::backdrop {
		opacity: 0;
		transition:
			opacity 0.3s ease-out,
			display 0.3s allow-discrete,
			overlay 0.3s allow-discrete;
	}
	dialog[open]::backdrop {
		opacity: 1;

		@starting-style {
			opacity: 0;
		}
	}

	.search-results {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--muted)) transparent;
	}

	.search-results::-webkit-scrollbar {
		width: 8px;
	}
	.search-results::-webkit-scrollbar-track {
		background: transparent;
	}
	.search-results::-webkit-scrollbar-thumb {
		background: hsl(var(--muted));
		border-radius: 4px;
	}
	.search-results::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--muted-foreground) / 0.5);
	}
</style>
