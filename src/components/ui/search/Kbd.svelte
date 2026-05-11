<script lang="ts">
	interface Props {
		keys: string[];
		class?: string;
	}

	let { keys, class: className = "" }: Props = $props();
</script>

<span
	class="border-border bg-muted/50 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium opacity-50 {className}"
>
	{#each keys as key}
		<kbd class="font-sans">{key}</kbd>
	{/each}
</span>
