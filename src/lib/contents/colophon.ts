export function getColophonData() {
	const architecture = [
		{
			name: "Astro",
			description:
				"The core framework. I use its Static Site Generation (SSG) for blistering fast load times."
		},
		{
			name: "Svelte",
			description:
				"Used sparingly for complex interactive client-side components."
		},
		{
			name: "Markdown / MDX",
			description:
				"All blog posts and notes are written in markdown, giving me full ownership of my content."
		},
		{
			name: "Pagefind",
			description:
				"A fully local, WebAssembly-powered search engine that runs entirely in the browser."
		}
	];

	const design = [
		{
			name: "Tailwind CSS v4",
			description:
				"Utility-first CSS framework. Used alongside OKLCH color spaces for vibrant, perceptual colors."
		},
		{
			name: "Phosphor Icons",
			description: "A clean, consistent icon family used throughout the site."
		},
		{
			name: "Typography",
			description:
				"Relying on beautiful System UI fonts for performance and a native feel across devices."
		}
	];

	const infrastructure = [
		{
			name: "Cloudflare",
			description:
				"Used for blazing fast Pages deployment, Web Analytics, and DNS Management."
		},
		{
			name: "Hostinger",
			description: "My reliable domain registrar."
		},
		{
			name: "Giscus",
			description:
				"A lightweight comments system powered by GitHub Discussions."
		}
	];

	const tools = [
		{
			name: "Bun",
			description:
				"A fast all-in-one JavaScript runtime, bundler, and package manager."
		},
		{
			name: "Biome & Prettier",
			description:
				"Biome for lightning-fast linting, Prettier for consistent code formatting."
		},
		{
			name: "Zed",
			description: "My primary code editor. Lightning fast and built with Rust."
		}
	];

	return {
		architecture,
		design,
		infrastructure,
		tools
	};
}
