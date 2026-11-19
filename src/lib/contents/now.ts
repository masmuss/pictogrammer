import { getAllExperiences } from "./experiences";

export interface NowItem {
	name: string;
	description: string;
	href?: string;
}

export async function getNowPageData() {
	const experiences = await getAllExperiences();

	const workingOn: NowItem[] = experiences.slice(0, 1).map((work) => ({
		name: work.title,
		description: work.company,
	}));

	const building: NowItem[] = [
		{
			name: "pictogrammer",
			description: "Personal website, blog, and digital garden",
			href: "https://github.com/masmuss/pictogrammer",
		},
		{
			name: "Trak",
			description:
				"A modern ticketing and reporting platform with Telegram bot integration",
			href: "https://github.com/masmuss/trak",
		},
		{
			name: "Veka",
			description: "A minimalist Digital Garden & Wiki starter for Astro",
			href: "https://demo-veka.khoirul.me",
		},
	];

	const learning: NowItem[] = [
		{
			name: "Modern Frontend",
			description:
				"Exploring Astro's island architecture and Svelte's runes system",
		},
		{
			name: "Backend engineering",
			description: "APIs, background jobs, scaling",
		},
		{
			name: "Data architecture",
			description: "PostgreSQL, Redis, caching",
		},
		{
			name: "Observability",
			description: "Logs, metrics, tracing",
		},
	];

	const reading: NowItem[] = [
		{
			name: "The Alchemist",
			description: "Paulo Coelho",
		},
		{
			name: "Pulang",
			description: "Leila S. Chudori",
		},
	];

	return {
		lastUpdated: "Agustus 2026",
		location: "Surabaya, Indonesia (UTC+7)",
		workingOn,
		building,
		learning,
		reading,
	};
}
