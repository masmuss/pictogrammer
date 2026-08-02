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

test("Card applies custom class via class prop", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Card, {
		props: { class: "custom-class" }
	});

	expect(result).toContain("custom-class");
});

test("Card renders with data-reload when reload prop is true and as anchor", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Card, {
		props: { as: "a", href: "/test", reload: true },
		slots: { default: "Reload Link" }
	});

	expect(result).toContain("data-astro-reload");
});
