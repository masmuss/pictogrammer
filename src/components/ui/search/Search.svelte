<script lang="ts">
import SearchModal from "./SearchModal.svelte";
import SearchTrigger from "./SearchTrigger.svelte";
import { createSearch } from "./search-state.svelte";

const search = createSearch();
</script>

<svelte:window onkeydown={search.handleKeydown} />

<SearchTrigger {search} />
<SearchModal {search} />
