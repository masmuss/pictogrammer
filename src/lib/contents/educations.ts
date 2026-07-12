import type { Education } from "@/types";
import { getContentEntryData } from "./loader";
import { educationsSchema } from "./schemas";

export async function getAllEducations(): Promise<Education[]> {
	return getContentEntryData("educations", educationsSchema);
}
