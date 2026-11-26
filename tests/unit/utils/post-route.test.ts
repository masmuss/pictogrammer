import { describe, expect, it } from "vitest";
import { getPostRouteId, getPostUrl } from "@/lib/utils/post-route";

describe("post routes", () => {
	it("keeps the local route id for internal posts", () => {
		const post = { id: "notes/internal-post" };

		expect(getPostRouteId(post)).toBe("notes/internal-post");
		expect(getPostUrl(post)).toBe("/blog/notes/internal-post");
	});

	it("uses the external URL for externally hosted posts", () => {
		const post = {
			id: "reflections/external-post",
			data: { externalUrl: "https://medium.com/@author/external-post" },
		};

		expect(getPostRouteId(post)).toBe("reflections/external-post");
		expect(getPostUrl(post)).toBe("https://medium.com/@author/external-post");
	});
});
