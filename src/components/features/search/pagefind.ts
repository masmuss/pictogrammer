export interface PagefindResultData {
	url: string;
	excerpt: string;
	meta: {
		title: string;
		[key: string]: string;
	};
}

interface PagefindSearchResult {
	data: () => Promise<PagefindResultData>;
}

export interface PagefindModule {
	init: () => Promise<void>;
	search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
}

export async function loadPagefind(): Promise<PagefindModule> {
	const pagefindPath = `${import.meta.env.BASE_URL}pagefind/pagefind.js`;
	const pagefind = (await import(/* @vite-ignore */ pagefindPath)) as PagefindModule;
	await pagefind.init();
	return pagefind;
}

export async function searchPagefind(
	pagefind: PagefindModule,
	query: string,
	limit = 10
): Promise<PagefindResultData[]> {
	const search = await pagefind.search(query);
	return Promise.all(search.results.slice(0, limit).map((result) => result.data()));
}
