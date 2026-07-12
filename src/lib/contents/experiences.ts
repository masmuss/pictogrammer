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

function getEndSortValue(period: string): number {
	if (/present/i.test(period)) {
		return 999999;
	}

	const dates = period.match(/(\d{4})/g);
	if (dates && dates.length > 0) {
		return Number(dates[dates.length - 1]);
	}

	return 0;
}

export function getExperienceGroups(
	experiences: Experience[]
): ExperienceOrgGroup[] {
	return Array.from(
		experiences
			.reduce((acc, experience) => {
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
				if (!existing.logo && experience.logo) {
					existing.logo = experience.logo;
				}
				if (!existing.location && experience.location) {
					existing.location = experience.location;
				}
				if (!existing.kind && experience.kind) {
					existing.kind = experience.kind;
				}
				if (!existing.umbrellaOrg && experience.umbrellaOrg) {
					existing.umbrellaOrg = experience.umbrellaOrg;
				}

				return acc;
			}, new Map<string, ExperienceOrgGroup>())
			.values()
	)
		.map((organization) => ({
			...organization,
			positions: [...organization.positions].sort(
				(a, b) => getEndSortValue(b.period) - getEndSortValue(a.period)
			)
		}))
		.sort(
			(a, b) =>
				getEndSortValue(b.positions[0]?.period ?? "") -
				getEndSortValue(a.positions[0]?.period ?? "")
		);
}

export async function getCurrentRole(): Promise<Experience | undefined> {
	const experiences = await getAllExperiences();
	return (
		experiences.find((exp) => exp.period.toLowerCase().includes("present")) ??
		experiences[0]
	);
}
