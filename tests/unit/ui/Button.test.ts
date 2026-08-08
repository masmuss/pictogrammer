import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Button from "@/components/ui/button/Button.astro";

test("Button renders as an anchor by default", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Button, {
		props: { href: "/test" },
		slots: { default: "Click me" }
	});

	expect(result).toContain("<a");
	expect(result).toContain('href="/test"');
	expect(result).toContain("Click me");
});

test("Button renders as a button when specified", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Button, {
		props: { as: "button" },
		slots: { default: "Submit" }
	});

	expect(result).toContain("<button");
	expect(result).toContain('type="button"');
	expect(result).toContain("Submit");
});

test("Button renders with icons in slots", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Button, {
		slots: {
			"icon-before": '<span id="before">Icon</span>',
			default: "Text"
		}
	});

	expect(result).toContain('id="before"');
	expect(result).toContain("Text");
});

test("Button applies variant and size classes", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Button, {
		props: { variant: "destructive", size: "lg" }
	});

	expect(result).toContain('data-variant="destructive"');
	expect(result).toContain('data-size="lg"');
});
