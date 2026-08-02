import siteConfig from "@/config/site-config";
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

export function getGitHubUsername(): string {
	const githubProfile = siteConfig.socialLinks.find(
		(social) => social.text === "GitHub"
	)?.href;

	return githubProfile?.split("/").filter(Boolean).at(-1) ?? "masmuss";
}

export function getGitHubCalendarTheme() {
	return {
		light: ["#E6E4D9", "#DDE2B2", "#BEC97E", "#A0AF54", "#879A39"],
		dark: ["#282726", "#3D4C07", "#536907", "#66800B", "#879A39"]
	} as const;
}
