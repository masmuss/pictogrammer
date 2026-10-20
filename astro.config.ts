// @ts-check

import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import remarkAbbr from "@richardtowers/remark-abbr";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import markdownExport from "astro-md-content-negotiation";
import pagefind from "astro-pagefind";
import rehypeExternalLinks from "rehype-external-links";
import remarkDeflist from "remark-deflist";
import remarkDirective from "remark-directive";
import remarkSupersub from "remark-supersub";
import { addMarkdownFrontmatter } from "./src/lib/markdown-frontmatter";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions";
import { remarkGithubCard } from "./src/plugins/remark-github-card";
import { remarkPele } from "./src/plugins/remark-pele";

const siteUrl = "https://khoirul.me";

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	trailingSlash: "never",
	prerenderConflictBehavior: "error",
	redirects: {
    "/sitemap.xml": "/sitemap-index.xml",
  },
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
			name: "Merriweather",
			cssVariable: "--font-merriweather",
			styles: ["normal", "italic"],
			fallbacks: ["serif"],
			display: "swap",
			formats: ["woff2"]
		}
	],
	integrations: [
		sitemap(),
		pagefind(),
		icon(),
		markdownExport({
			exclude: ["404.html", "sitemap.xml/**"],
			transform: (markdown, file) =>
				addMarkdownFrontmatter(markdown, file, siteUrl)
		})
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
				remarkAdmonitions,
				remarkPele
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
