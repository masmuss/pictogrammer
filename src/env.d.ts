/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Navigator {
	userAgentData?: {
		platform: string;
		mobile: boolean;
		brands: Array<{ brand: string; version: string }>;
	};
}

interface Window {
	__openSearch?: () => void;
	__closeSearch?: () => void;
}
