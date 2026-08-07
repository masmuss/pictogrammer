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
