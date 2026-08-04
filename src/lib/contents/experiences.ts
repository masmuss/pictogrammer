import type { Experience } from "@/types";
import { getContentEntryData } from "./loader";
import { experiencesSchema } from "./schemas";

export async function getAllExperiences(): Promise<Experience[]> {
	return getContentEntryData("experiences", experiencesSchema);
}

export async function getCurrentRole(): Promise<Experience | undefined> {
	const experiences = await getAllExperiences();
	return (
		experiences.find((exp) => exp.period.toLowerCase().includes("present")) ??
		experiences[0]
	);
}
