// @ts-check

import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import remarkAbbr from "@richardtowers/remark-abbr";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import astroMermaid from "astro-mermaid";
import pagefind from "astro-pagefind";
import rehypeExternalLinks from "rehype-external-links";
import remarkDeflist from "remark-deflist";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkSupersub from "remark-supersub";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions";
import { remarkGithubCard } from "./src/plugins/remark-github-card";

// https://astro.build/config
export default defineConfig({
	site: "https://khoirul.me",
	trailingSlash: "never",
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "iA Writer Quattro",
			cssVariable: "--font-ia-writer-quattro",
			weights: [400, 500, 600, 700],
			styles: ["normal", "italic"],
			fallbacks: ["sans-serif"],
			display: "swap",
			formats: ["woff2"]
		},
		{
			provider: fontProviders.fontsource(),
			name: "IBM Plex Mono",
			cssVariable: "--font-ibm-plex-mono",
			styles: ["normal", "italic"],
			fallbacks: ["monospace"],
			display: "swap",
			formats: ["woff2"]
		}
	],
	integrations: [
		astroMermaid({
			theme: "default",
			autoTheme: true,
			mermaidConfig: {
				flowchart: {
					htmlLabels: true,
					curve: "basis"
				}
			}
		}),
		sitemap(),
		svelte(),
		pagefind()
	],
	markdown: {
		gfm: true,
		shikiConfig: {
			theme: "dracula-soft",
			wrap: true
		},
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["noreferrer", "noopener"],
					target: "_blank"
				}
			]
		],
		remarkPlugins: [
			remarkGfm,
			remarkSupersub,
			remarkAbbr,
			remarkDeflist,
			remarkDirective,
			remarkGithubCard,
			remarkAdmonitions
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""]
			}
		}
	},
	vite: {
		plugins: [tailwindcss()]
	}
});
