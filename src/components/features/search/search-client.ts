import {
	loadPagefind,
	type PagefindModule,
	searchPagefind
} from "./pagefind";
import { SearchRenderer } from "./search-render";
import {
	MIN_QUERY_LENGTH,
	normalizeResultUrl,
	SEARCH_DEBOUNCE_MS
} from "./search-results";
import {
	createInitialState,
	resetState,
	type SearchState
} from "./search-state";

class SearchController {
	private state: SearchState = createInitialState();
	private isOpen = false;
	private pagefind: PagefindModule | null = null;
	private searchRequestId = 0;
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;
	private initPromise: Promise<void> | null = null;
	private readonly renderer: SearchRenderer;

	constructor(
		private readonly dialogRoot: HTMLElement,
		private readonly trigger: HTMLElement | null
	) {
		this.renderer = new SearchRenderer(dialogRoot);
	}

	public init() {
		this.dialogRoot.addEventListener("dialog:change", this.onDialogChange);
		this.trigger?.addEventListener("click", this.onTriggerClick);
		document.addEventListener("keydown", this.onKeydown);
		this.renderer.escBtnEl?.addEventListener("click", this.onCloseButtonClick);
		this.renderer.inputEl?.addEventListener("input", this.onInput);
		this.renderer.listEl?.addEventListener("mouseover", this.onListMouseover);
		window.__openSearch = () => this.openSearch();
		window.__closeSearch = () => this.closeSearch();
	}

	public cleanup() {
		this.dialogRoot.removeEventListener("dialog:change", this.onDialogChange);
		this.trigger?.removeEventListener("click", this.onTriggerClick);
		document.removeEventListener("keydown", this.onKeydown);
		this.renderer.escBtnEl?.removeEventListener(
			"click",
			this.onCloseButtonClick
		);
		this.renderer.inputEl?.removeEventListener("input", this.onInput);
		this.renderer.listEl?.removeEventListener("mouseover", this.onListMouseover);
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		delete window.__openSearch;
		delete window.__closeSearch;
	}

	private onDialogChange = (e: Event) => {
		const detail = (e as CustomEvent<{ open?: boolean }>).detail;
		this.isOpen = detail?.open ?? false;
		if (this.isOpen) {
			this.renderer.focusInput();
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

	private render() {
		this.renderer.render(this.state);
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
		const href = this.renderer.getResultHref(this.state.selectedIndex);
		if (href) {
			window.location.href = href;
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
