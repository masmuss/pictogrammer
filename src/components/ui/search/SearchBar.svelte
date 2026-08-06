<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { createSearch } from "./search-state.svelte";

	let { search }: { search: ReturnType<typeof createSearch> } = $props();
</script>

<div class="border-border relative flex items-center border-b px-4">
	<Icon icon="ph:magnifying-glass" class="text-muted-foreground" />
	<input
		bind:this={search.searchInput}
		bind:value={search.query}
		oninput={search.handleSearch}
		type="text"
		aria-label="Search query"
		placeholder="Search articles, projects..."
		class="placeholder:text-muted-foreground h-12 w-full bg-transparent px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-md"
	/>
	{#if search.isSearching}
		<div
			class="border-accent-cta mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
		></div>
	{/if}
	<button
		onclick={search.closeSearch}
		aria-label="Close search"
		class="border-border text-muted-foreground hover:bg-muted focus-visible:ring-ring focus-visible:ring-offset-background ml-1 rounded-md border p-1.5 sm:px-1.5 sm:py-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
	>
		ESC
	</button>
</div>
