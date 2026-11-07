/// <reference types="vitest/config" />

import path from "node:path";
import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["tests/unit/**/*.{test,spec}.{js,ts}"],
	},
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
});
