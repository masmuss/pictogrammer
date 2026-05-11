<script lang="ts">
	import type { createSearch, PagefindResultData } from "./search-state.svelte";

	interface Props {
		result: PagefindResultData;
		index: number;
		search: ReturnType<typeof createSearch>;
	}

	let { result, index, search }: Props = $props();
</script>

<a
	href={result.url}
	class="group block rounded-lg p-3 transition-colors {search.selectedIndex ===
	index
		? 'bg-muted ring-border ring-1'
		: 'hover:bg-muted'}"
	onclick={search.closeSearch}
>
	<div class="flex items-center justify-between">
		<h3
			class="text-sm font-semibold transition-colors {search.selectedIndex ===
			index
				? 'text-accent-cta'
				: 'group-hover:text-accent-cta'}"
		>
			{result.meta.title}
		</h3>
		<span
			class="iconify ri--arrow-right-s-line text-muted-foreground h-4 w-4 transition-transform {search.selectedIndex ===
			index
				? 'translate-x-1'
				: 'group-hover:translate-x-1'}"
		></span>
	</div>
	<p class="text-muted-foreground mt-1 line-clamp-2 text-xs">
		{@html result.excerpt}
	</p>
</a>

<style>
	:global(mark) {
		background-color: var(--accent-cta-subtle);
		color: var(--accent-cta-text);
		border-radius: 0.125rem;
		padding-left: 0.125rem;
		padding-right: 0.125rem;
		font-weight: 500;
	}
</style>
