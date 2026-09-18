import type { PagefindResultData } from "./pagefind";

export interface SearchState {
	query: string;
	results: PagefindResultData[];
	isSearching: boolean;
	selectedIndex: number;
}

export function createInitialState(): SearchState {
	return {
		query: "",
		results: [],
		isSearching: false,
		selectedIndex: -1
	};
}

export function resetState(state: SearchState): void {
	state.query = "";
	state.results = [];
	state.isSearching = false;
	state.selectedIndex = -1;
}
