import { getAllExperiences } from "./experiences";

export async function getNowPageData() {
	const experiences = await getAllExperiences();

	const workingOn = experiences.slice(0, 1).map((work) => ({
		name: work.title,
		description: work.company
	}));

	const building = [
		{
			name: "pictogrammer",
			description: "Personal website, blog, and digital garden"
		},
		{
			name: "Trak",
			description:
				"A modern ticketing and reporting platform with Telegram bot integration"
		},
		{
			name: "Veka",
			description: "A minimalist Digital Garden & Wiki starter for Astro"
		}
	];

	const learning = [
		{
			name: "Modern Frontend",
			description:
				"Exploring Astro's island architecture and Svelte's runes system"
		},
		{
			name: "Backend engineering",
			description: "APIs, background jobs, scaling"
		},
		{
			name: "Data architecture",
			description: "PostgreSQL, Redis, caching"
		},
		{
			name: "Observability",
			description: "Logs, metrics, tracing"
		}
	];

	const reading = [
		{
			name: "The Alchemist",
			description: "Paulo Coelho"
		},
		{
			name: "Pulang",
			description: "Leila S. Chudori"
		}
	];

	return {
		lastUpdated: "Agustus 2026",
		location: "Surabaya, Indonesia (UTC+7)",
		workingOn,
		building,
		learning,
		reading
	};
}
