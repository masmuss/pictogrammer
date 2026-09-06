// @ts-check

import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import remarkAbbr from "@richardtowers/remark-abbr";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import astroMermaid from "astro-mermaid";
import pagefind from "astro-pagefind";
import rehypeExternalLinks from "rehype-external-links";
import remarkDeflist from "remark-deflist";
import remarkDirective from "remark-directive";
import remarkSupersub from "remark-supersub";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions";
import { remarkGithubCard } from "./src/plugins/remark-github-card";

// https://astro.build/config
export default defineConfig({
	site: "https://khoirul.me",
	trailingSlash: "never",
	prerenderConflictBehavior: "error",
	experimental: {
		collectionStorage: "chunked"
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Geist Sans",
			cssVariable: "--font-geist-sans",
			weights: [400, 500, 600, 700],
			styles: ["normal"],
			fallbacks: ["sans-serif"],
			display: "swap",
			formats: ["woff2"]
		},
		{
			provider: fontProviders.fontsource(),
			name: "Geist Mono",
			cssVariable: "--font-geist-mono",
			styles: ["normal"],
			fallbacks: ["monospace"],
			display: "swap",
			formats: ["woff2"]
		},
		{
			provider: fontProviders.fontsource(),
			name: "Newsreader",
			cssVariable: "--font-newsreader",
			styles: ["normal", "italic"],
			fallbacks: ["serif"],
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
		pagefind(),
		icon()
	],
	markdown: {
		processor: unified({
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
		}),
		shikiConfig: {
			theme: "dark-plus",
			wrap: true
		}
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			chunkSizeWarningLimit: 1024
		}
	}
});
