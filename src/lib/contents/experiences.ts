import type { Experience } from "@/types";
import { getContentEntryData } from "./loader";
import { experiencesSchema } from "./schemas";

export async function getAllExperiences(): Promise<Experience[]> {
	return getContentEntryData("experiences", experiencesSchema);
}

export type ExperienceOrgGroup = {
	company: string;
	logo?: string;
	location?: string;
	kind?: Experience["kind"];
	umbrellaOrg?: string;
	positions: Experience[];
};

function getEndYear(period: string): number {
	if (/present/i.test(period)) {
		return Number.MAX_SAFE_INTEGER;
	}

	const dates = period.match(/(\d{4})/g);
	if (dates && dates.length > 0) {
		return Number(dates[dates.length - 1]);
	}

	return 0;
}

function fillOrgDefaults(
	existing: ExperienceOrgGroup,
	experience: Experience
): void {
	const keys = ["logo", "location", "kind", "umbrellaOrg"] as const;
	for (const key of keys) {
		if (!existing[key] && experience[key]) {
			(existing as Record<string, unknown>)[key] = experience[key];
		}
	}
}

function groupExperiencesByOrg(
	experiences: Experience[]
): Map<string, ExperienceOrgGroup> {
	return experiences.reduce((acc, experience) => {
		const existing = acc.get(experience.company);

		if (!existing) {
			acc.set(experience.company, {
				company: experience.company,
				logo: experience.logo,
				location: experience.location,
				kind: experience.kind,
				umbrellaOrg: experience.umbrellaOrg,
				positions: [experience]
			});
			return acc;
		}

		existing.positions.push(experience);
		fillOrgDefaults(existing, experience);

		return acc;
	}, new Map<string, ExperienceOrgGroup>());
}

function sortGroupedExperiences(
	groups: Map<string, ExperienceOrgGroup>
): ExperienceOrgGroup[] {
	return Array.from(groups.values())
		.map((organization) => ({
			...organization,
			positions: [...organization.positions].sort(
				(a, b) => getEndYear(b.period) - getEndYear(a.period)
			)
		}))
		.sort(
			(a, b) =>
				getEndYear(b.positions[0]?.period ?? "") -
				getEndYear(a.positions[0]?.period ?? "")
		);
}

export function getExperienceGroups(
	experiences: Experience[]
): ExperienceOrgGroup[] {
	const groups = groupExperiencesByOrg(experiences);
	return sortGroupedExperiences(groups);
}

export async function getCurrentRole(): Promise<Experience | undefined> {
	const experiences = await getAllExperiences();
	return (
		experiences.find((exp) => exp.period.toLowerCase().includes("present")) ??
		experiences[0]
	);
}
