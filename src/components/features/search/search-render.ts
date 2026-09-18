import { escapeHtml } from "./html";
import {
	MIN_QUERY_LENGTH,
	renderResultItem
} from "./search-results";
import type { SearchState } from "./search-state";

interface SearchElements {
	input: HTMLInputElement | null;
	list: HTMLDivElement | null;
	status: HTMLDivElement | null;
	count: HTMLSpanElement | null;
	empty: HTMLDivElement | null;
	hint: HTMLDivElement | null;
	spinner: HTMLDivElement | null;
	escBtn: HTMLButtonElement | null;
}

function queryElements(content: HTMLElement | null): SearchElements {
	const empty: SearchElements = {
		input: null,
		list: null,
		status: null,
		count: null,
		empty: null,
		hint: null,
		spinner: null,
		escBtn: null
	};
	if (!content) return empty;

	return {
		input: content.querySelector<HTMLInputElement>("[data-search-input]"),
		list: content.querySelector<HTMLDivElement>("[data-search-list]"),
		status: content.querySelector<HTMLDivElement>("[data-search-status]"),
		count: content.querySelector<HTMLSpanElement>("[data-search-count]"),
		empty: content.querySelector<HTMLDivElement>("[data-search-empty]"),
		hint: content.querySelector<HTMLDivElement>("[data-search-hint]"),
		spinner: content.querySelector<HTMLDivElement>("[data-search-spinner]"),
		escBtn: content.querySelector<HTMLButtonElement>("[data-search-esc]")
	};
}

export class SearchRenderer {
	private readonly el: SearchElements;

	constructor(dialogRoot: HTMLElement) {
		const content = dialogRoot.querySelector<HTMLElement>(
			'[data-slot="dialog-content"]'
		);
		this.el = queryElements(content);
	}

	get inputEl(): HTMLInputElement | null {
		return this.el.input;
	}

	get listEl(): HTMLDivElement | null {
		return this.el.list;
	}

	get escBtnEl(): HTMLButtonElement | null {
		return this.el.escBtn;
	}

	focusInput(): void {
		requestAnimationFrame(() => this.el.input?.focus());
	}

	getResultHref(index: number): string | null {
		return (
			this.el.list?.querySelector<HTMLAnchorElement>(
				`[data-index="${index}"]`
			)?.href ?? null
		);
	}

	render(state: SearchState): void {
		this.el.spinner?.classList.toggle("hidden", !state.isSearching);

		if (state.results.length > 0) {
			this.renderResults(state);
		} else if (state.query.trim().length >= MIN_QUERY_LENGTH) {
			this.renderEmpty(state);
		} else {
			this.renderHint();
		}
	}

	private renderResults(state: SearchState): void {
		this.el.hint?.classList.add("hidden");
		this.el.empty?.classList.add("hidden");
		this.el.list?.classList.remove("hidden");
		this.el.status?.classList.remove("hidden");
		if (this.el.count) {
			this.el.count.textContent = `${state.results.length} results found`;
		}

		if (this.el.list) {
			this.el.list.innerHTML = state.results
				.map((r, i) => renderResultItem(r, i, state.selectedIndex))
				.join("");
		}
	}

	private renderEmpty(state: SearchState): void {
		this.el.hint?.classList.add("hidden");
		this.el.empty?.classList.remove("hidden");
		if (this.el.empty) {
			this.el.empty.innerHTML = `<p class="text-muted-foreground">No results for "${escapeHtml(state.query)}"</p>`;
		}
		this.el.list?.classList.add("hidden");
		this.el.status?.classList.add("hidden");
	}

	private renderHint(): void {
		this.el.hint?.classList.remove("hidden");
		this.el.empty?.classList.add("hidden");
		this.el.list?.classList.add("hidden");
		this.el.status?.classList.add("hidden");
	}
}
