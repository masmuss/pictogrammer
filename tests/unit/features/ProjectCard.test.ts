import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import ProjectCard from "@/components/features/projects/ProjectCard.astro";

test("ProjectCard renders heading and subheading", async () => {
	const container = await AstroContainer.create();

	const result = await container.renderToString(ProjectCard, {
		props: {
			heading: "Awesome Project",
			subheading: "This is a description",
			thumbnail: "applyst.png",
			repoHref: "https://github.com/test/repo"
		}
	});

	expect(result).toContain("Awesome Project");
	expect(result).toContain("This is a description");
	expect(result).toContain("https://github.com/test/repo");
	expect(result).toContain("Repo"); // Button label
});

test("ProjectCard renders Live link when liveHref is provided", async () => {
	const container = await AstroContainer.create();

	const result = await container.renderToString(ProjectCard, {
		props: {
			heading: "Live Project",
			liveHref: "https://example.com"
		}
	});

	expect(result).toContain("https://example.com");
	expect(result).toContain("Live"); // Button label
});

test("ProjectCard renders icon placeholder when thumbnail is missing", async () => {
	const container = await AstroContainer.create();

	const result = await container.renderToString(ProjectCard, {
		props: {
			heading: "No Image Project"
		}
	});

	expect(result).toContain("bg-muted");
	expect(result).not.toContain("thumbnail");
});
