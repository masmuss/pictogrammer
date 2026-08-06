import type { Experience } from "@/types";
import { getAllCertifications } from "./certifications";
import { getAllEducations } from "./educations";
import { getAllExperiences } from "./experiences";

export async function getAboutPageData() {
	const [experiences, educations, certifications] = await Promise.all([
		getAllExperiences(),
		getAllEducations(),
		getAllCertifications()
	]);

	return {
		experiences,
		educations,
		certifications
	};
}

export function getCurrentWorkItems(experiences: Experience[]) {
	return experiences.slice(0, 1).map((work) => ({
		title: work.title,
		meta: work.company
	}));
}

export function getLearningFocusItems() {
	return [
		{
			title: "Backend engineering",
			meta: "APIs, background jobs, scaling"
		},
		{
			title: "Data architecture",
			meta: "PostgreSQL, Redis, caching"
		},
		{
			title: "Observability",
			meta: "Logs, metrics, tracing"
		}
	];
}

export function getNowReadingBooks() {
	return [
		{
			title: "The Alchemist",
			meta: "Paulo Coelho"
		},
		{
			title: "Pulang",
			meta: "Leila S. Chudori"
		}
	];
}
