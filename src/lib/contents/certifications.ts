import type { Certification } from "@/types";
import { getContentEntryData } from "./loader";
import { certificationsSchema } from "./schemas";

export async function getAllCertifications(): Promise<Certification[]> {
	return getContentEntryData("certifications", certificationsSchema);
}
