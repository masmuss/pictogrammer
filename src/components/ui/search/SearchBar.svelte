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
		placeholder="Search articles, projects..."
		class="placeholder:text-muted-foreground h-12 w-full bg-transparent px-4 text-sm outline-none"
	/>
	{#if search.isSearching}
		<div
			class="border-accent-cta mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
		></div>
	{/if}
	<button
		onclick={search.closeSearch}
		class="border-border text-muted-foreground hover:bg-muted rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
	>
		ESC
	</button>
</div>
