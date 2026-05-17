import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import { Card } from "@/components/ui/card";

test("Card renders as div by default", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Card, {
		slots: { default: '<div id="content">Card Content</div>' }
	});

	expect(result).toContain("<div");
	expect(result).toContain('id="content"');
	expect(result).toContain('data-slot="card"');
});

test('Card renders as anchor when as="a" is passed', async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Card, {
		props: { as: "a", href: "/test-link" },
		slots: { default: "Link Card" }
	});

	expect(result).toContain("<a");
	expect(result).toContain('href="/test-link"');
});

test("Card applies size sm correctly", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Card, {
		props: { size: "sm" }
	});

	expect(result).toContain('data-size="sm"');
});
