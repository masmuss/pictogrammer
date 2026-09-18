import { escapeHtml } from "./html";
import {
	loadPagefind,
	type PagefindModule,
	searchPagefind
} from "./pagefind";
import {
	MIN_QUERY_LENGTH,
	normalizeResultUrl,
	renderResultItem,
	SEARCH_DEBOUNCE_MS
} from "./search-results";
import {
	createInitialState,
	resetState,
	type SearchState
} from "./search-state";

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

class SearchController {
	private state: SearchState = createInitialState();
	private isOpen = false;
	private pagefind: PagefindModule | null = null;
	private searchRequestId = 0;
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;
	private initPromise: Promise<void> | null = null;
	private readonly el: SearchElements;

	constructor(
		private readonly dialogRoot: HTMLElement,
		private readonly trigger: HTMLElement | null
	) {
		const content = dialogRoot.querySelector<HTMLElement>(
			'[data-slot="dialog-content"]'
		);
		this.el = queryElements(content);
	}

	public init() {
		this.dialogRoot.addEventListener("dialog:change", this.onDialogChange);
		this.trigger?.addEventListener("click", this.onTriggerClick);
		document.addEventListener("keydown", this.onKeydown);
		this.el.escBtn?.addEventListener("click", this.onCloseButtonClick);
		this.el.input?.addEventListener("input", this.onInput);
		this.el.list?.addEventListener("mouseover", this.onListMouseover);
		window.__openSearch = () => this.openSearch();
		window.__closeSearch = () => this.closeSearch();
	}

	public cleanup() {
		this.dialogRoot.removeEventListener("dialog:change", this.onDialogChange);
		this.trigger?.removeEventListener("click", this.onTriggerClick);
		document.removeEventListener("keydown", this.onKeydown);
		this.el.escBtn?.removeEventListener("click", this.onCloseButtonClick);
		this.el.input?.removeEventListener("input", this.onInput);
		this.el.list?.removeEventListener("mouseover", this.onListMouseover);
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		delete window.__openSearch;
		delete window.__closeSearch;
	}

	private onDialogChange = (e: Event) => {
		const detail = (e as CustomEvent<{ open?: boolean }>).detail;
		this.isOpen = detail?.open ?? false;
		if (this.isOpen) {
			requestAnimationFrame(() => this.el.input?.focus());
		} else {
			resetState(this.state);
			this.render();
		}
	};

	private onCloseButtonClick = () => {
		this.emit("close");
	};

	private onTriggerClick = () => {
		this.openSearch();
	};

	private onInput = (e: Event) => {
		this.state.query = (e.target as HTMLInputElement).value;
		this.handleSearch();
	};

	private onListMouseover = (e: Event) => {
		const item = (e.target as HTMLElement).closest("[data-search-result]");
		if (!item) return;

		const indexAttr = item.getAttribute("data-index");
		if (!indexAttr) return;

		const idx = Number.parseInt(indexAttr, 10);
		if (idx !== this.state.selectedIndex) {
			this.state.selectedIndex = idx;
			this.render();
		}
	};

	private onKeydown = (e: KeyboardEvent) => {
		this.handleGlobalToggle(e);

		if (!this.isOpen || this.state.results.length === 0) return;

		this.handleNavigation(e);
	};

	private isToggleKeyPress(e: KeyboardEvent): boolean {
		return (e.metaKey || e.ctrlKey) && e.key === "k";
	}

	private handleGlobalToggle(e: KeyboardEvent) {
		if (!this.isToggleKeyPress(e)) return;

		e.preventDefault();
		if (this.isOpen) {
			this.emit("close");
		} else {
			this.openSearch();
		}
	}

	private emit(action: "open" | "close") {
		this.dialogRoot.dispatchEvent(
			new CustomEvent("dialog:set", {
				detail: { open: action === "open" }
			})
		);
	}

	private loadPagefind(): Promise<void> {
		if (!this.initPromise) {
			this.initPromise = loadPagefind().then((pagefind) => {
				this.pagefind = pagefind;
			});
		}
		return this.initPromise;
	}

	private openSearch() {
		this.loadPagefind();
		this.emit("open");
	}

	private closeSearch() {
		resetState(this.state);
		this.clearDebounce();
		this.render();
		this.emit("close");
	}

	private clearDebounce() {
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
	}

	private handleSearch() {
		const trimmed = this.state.query.trim();
		const requestId = ++this.searchRequestId;

		if (trimmed.length < MIN_QUERY_LENGTH) {
			this.clearDebounce();
			resetState(this.state);
			this.render();
			return;
		}

		this.clearDebounce();
		this.state.isSearching = true;
		this.render();

		this.debounceTimer = setTimeout(() => {
			this.executeSearch(trimmed, requestId);
		}, SEARCH_DEBOUNCE_MS);
	}

	private isCurrentRequest(requestId: number): boolean {
		return requestId === this.searchRequestId;
	}

	private async executeSearch(trimmed: string, requestId: number) {
		if (!this.isCurrentRequest(requestId)) return;

		try {
			if (!this.pagefind) await this.loadPagefind();
			if (!this.pagefind || !this.isCurrentRequest(requestId)) return;

			const raw = await searchPagefind(this.pagefind, trimmed);
			if (!this.isCurrentRequest(requestId)) return;

			this.state.results = raw.map(normalizeResultUrl);
			this.state.selectedIndex = this.state.results.length > 0 ? 0 : -1;
		} catch (e) {
			if (this.isCurrentRequest(requestId)) {
				console.error("Search failed", e);
			}
		} finally {
			if (this.isCurrentRequest(requestId)) {
				this.state.isSearching = false;
				this.render();
			}
		}
	}

	private render() {
		this.el.spinner?.classList.toggle("hidden", !this.state.isSearching);

		if (this.state.results.length > 0) {
			this.renderResults();
		} else if (this.state.query.trim().length >= MIN_QUERY_LENGTH) {
			this.renderEmpty();
		} else {
			this.renderHint();
		}
	}

	private renderResults() {
		this.el.hint?.classList.add("hidden");
		this.el.empty?.classList.add("hidden");
		this.el.list?.classList.remove("hidden");
		this.el.status?.classList.remove("hidden");
		if (this.el.count) {
			this.el.count.textContent = `${this.state.results.length} results found`;
		}

		if (this.el.list) {
			this.el.list.innerHTML = this.state.results
				.map((r, i) => renderResultItem(r, i, this.state.selectedIndex))
				.join("");
		}
	}

	private renderEmpty() {
		this.el.hint?.classList.add("hidden");
		this.el.empty?.classList.remove("hidden");
		if (this.el.empty) {
			this.el.empty.innerHTML = `<p class="text-muted-foreground">No results for "${escapeHtml(this.state.query)}"</p>`;
		}
		this.el.list?.classList.add("hidden");
		this.el.status?.classList.add("hidden");
	}

	private renderHint() {
		this.el.hint?.classList.remove("hidden");
		this.el.empty?.classList.add("hidden");
		this.el.list?.classList.add("hidden");
		this.el.status?.classList.add("hidden");
	}

	private handleNavigation(e: KeyboardEvent) {
		const keyActions: Record<string, () => void> = {
			ArrowDown: () => this.navigateSelection(1),
			ArrowUp: () => this.navigateSelection(-1),
			Enter: () => {
				if (this.state.selectedIndex >= 0) this.navigateToSelectedResult();
			}
		};

		const action = keyActions[e.key];
		if (action) {
			e.preventDefault();
			action();
		}
	}

	private navigateSelection(direction: number) {
		const total = this.state.results.length;
		this.state.selectedIndex =
			(this.state.selectedIndex + direction + total) % total;
		this.render();
	}

	private navigateToSelectedResult() {
		const link = this.el.list?.querySelector<HTMLAnchorElement>(
			`[data-index="${this.state.selectedIndex}"]`
		);
		if (link) {
			window.location.href = link.href;
			this.closeSearch();
		}
	}
}

let instance: SearchController | null = null;

export function initSearch(
	dialogRoot: HTMLElement,
	trigger: HTMLElement | null = null
) {
	if (instance) {
		instance.cleanup();
	}
	instance = new SearchController(dialogRoot, trigger);
	instance.init();
}
