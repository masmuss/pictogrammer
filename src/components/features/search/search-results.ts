import { escapeHtml, sanitizeExcerpt } from "./html";
import type { PagefindResultData } from "./pagefind";

export const MIN_QUERY_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 300;

export function normalizeResultUrl(r: PagefindResultData): PagefindResultData {
	return {
		...r,
		url: r.url.replace("/dist/", "/").replace(/\/$/, "")
	};
}

export function renderResultItem(
	r: PagefindResultData,
	index: number,
	selectedIndex: number
): string {
	const selected = index === selectedIndex;
	return `
      <a href="${r.url}"
         data-search-result
         data-index="${index}"
         class="group block rounded-lg p-3 transition-colors ${
						selected ? "bg-muted ring-border ring-1" : "hover:bg-muted"
					}"
         role="option"
         aria-selected="${selected}"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold ${
						selected ? "text-primary" : "group-hover:text-primary"
					}">${escapeHtml(r.meta.title)}</h3>
          <svg class="text-muted-foreground h-4 w-4 transition-transform ${
						selected ? "translate-x-1" : "group-hover:translate-x-1"
					}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <p class="text-muted-foreground mt-1 line-clamp-2 text-xs">${sanitizeExcerpt(r.excerpt)}</p>
      </a>
    `;
}
