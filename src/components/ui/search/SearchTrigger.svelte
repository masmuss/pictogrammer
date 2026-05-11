<script lang="ts">
	import Kbd from "./Kbd.svelte";
	import type { createSearch } from "./search-state.svelte";

	let { search }: { search: ReturnType<typeof createSearch> } = $props();

	const platform =
		typeof navigator === "undefined"
			? ""
			: ("userAgentData" in navigator
					? ((navigator as Navigator & { userAgentData?: { platform?: string } })
							.userAgentData?.platform ?? "")
					: navigator.platform);
	const isApplePlatform =
		/Mac|iPhone|iPad|iPod/i.test(platform);
	const modifierKey = isApplePlatform ? "⌘" : "Ctrl";
</script>

<button
	type="button"
	onclick={search.toggleSearch}
	class="group/button hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:ms-4 lg:w-auto lg:px-2 lg:py-1"
	aria-label="Search"
>
	<span class="iconify ri--search-line h-4 w-4"></span>
	<span class="ml-2 hidden text-xs lg:inline-block">Search</span>
	<Kbd keys={[modifierKey, "K"]} class="ml-2 hidden lg:flex" />
</button>
