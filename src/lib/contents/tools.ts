import { getContentEntryData } from "./loader";
import { toolsSchema } from "./schemas";

export async function getAllTools() {
	return getContentEntryData("tools", toolsSchema);
}
