<script lang="ts">
import Icon from "@iconify/svelte";
import type { createSearch, PagefindResultData } from "./search-state.svelte";

interface Props {
	result: PagefindResultData;
	index: number;
	search: ReturnType<typeof createSearch>;
}

let { result, index, search }: Props = $props();

function sanitizeExcerpt(excerpt: string) {
	if (typeof window === "undefined") {
		return excerpt
			.replaceAll(/<(?!\/?mark\b)[^>]*>/gi, "")
			.replaceAll(/<mark\b[^>]*>/gi, "<mark>");
	}

	const template = window.document.createElement("template");
	template.innerHTML = excerpt;

	for (const element of template.content.querySelectorAll("*")) {
		if (element.tagName !== "MARK") {
			element.replaceWith(
				window.document.createTextNode(element.textContent ?? "")
			);
			continue;
		}

		for (const attr of [...element.attributes]) {
			element.removeAttribute(attr.name);
		}
	}

	return template.innerHTML;
}
</script>

<a
	href={result.url}
	data-testid="search-result"
	role="option"
	aria-selected={search.selectedIndex === index}
	class="group block rounded-lg p-3 transition-colors {search.selectedIndex ===
	index
		? 'bg-muted ring-border ring-1'
		: 'hover:bg-muted'}"
	onclick={search.closeSearch}
	onmouseenter={() => (search.selectedIndex = index)}
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
		<Icon
			icon="ph:arrow-right"
			class="text-muted-foreground h-4 w-4 transition-transform {search.selectedIndex ===
			index
				? 'translate-x-1'
				: 'group-hover:translate-x-1'}"
		/>
	</div>
	<p class="excerpt text-muted-foreground mt-1 line-clamp-2 text-xs">
		{@html sanitizeExcerpt(result.excerpt)}
	</p>
</a>

<style>
	.excerpt :global(mark) {
		background-color: var(--accent-cta-subtle);
		color: var(--accent-cta-text);
		border-radius: 0.125rem;
		padding-left: 0.125rem;
		padding-right: 0.125rem;
		font-weight: 500;
	}
</style>
