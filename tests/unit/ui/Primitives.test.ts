import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Box from "@/components/common/primitives/Box.astro";
import Stack from "@/components/common/primitives/Stack.astro";
import Text from "@/components/common/primitives/Text.astro";

// Box Tests
test("Box renders with default props", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Box, {
		slots: { default: "Content" }
	});

	expect(result).toContain("<div");
	expect(result).toContain("Content");
});

test("Box applies padding token", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Box, {
		props: { padding: "md" },
		slots: { default: "Content" }
	});

	expect(result).toContain("p-3");
});

test("Box applies rounded token", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Box, {
		props: { rounded: "lg" },
		slots: { default: "Content" }
	});

	expect(result).toContain("rounded-lg");
});

test("Box applies border style", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Box, {
		props: { border: "border" },
		slots: { default: "Content" }
	});

	expect(result).toContain("border");
});

test("Box applies display flex with gap", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Box, {
		props: { display: "flex", gap: "md" },
		slots: { default: "Content" }
	});

	expect(result).toContain("flex");
	expect(result).toContain("gap-3");
});

test("Box applies background color", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Box, {
		props: { bg: "surface" },
		slots: { default: "Content" }
	});

	expect(result).toContain("bg-surface");
});

// Stack Tests
test("Stack renders with flex display", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Stack, {
		slots: { default: "Item 1" }
	});

	expect(result).toContain("flex");
	expect(result).toContain("Item 1");
});

test("Stack applies default column direction", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Stack, {
		slots: { default: "Content" }
	});

	expect(result).toContain("flex-col");
});

test("Stack applies row direction", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Stack, {
		props: { direction: "row" },
		slots: { default: "Content" }
	});

	expect(result).toContain("flex-row");
});

test("Stack applies gap token", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Stack, {
		props: { gap: "lg" },
		slots: { default: "Content" }
	});

	expect(result).toContain("gap-4");
});

test("Stack applies alignment", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Stack, {
		props: { alignItems: "center" },
		slots: { default: "Content" }
	});

	expect(result).toContain("items-center");
});

test("Stack applies justification", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Stack, {
		props: { justifyContent: "between" },
		slots: { default: "Content" }
	});

	expect(result).toContain("justify-between");
});

// Text Tests
test("Text renders as paragraph by default", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		slots: { default: "Hello World" }
	});

	expect(result).toContain("<p");
	expect(result).toContain("Hello World");
});

test("Text renders as heading element", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { as: "h2" },
		slots: { default: "Heading" }
	});

	expect(result).toContain("<h2");
	expect(result).toContain("Heading");
});

test("Text applies size class", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { size: "lg" },
		slots: { default: "Text" }
	});

	expect(result).toContain("text-lg");
});

test("Text applies large sizes (headings)", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { size: "2xl" },
		slots: { default: "Big" }
	});

	expect(result).toContain("text-2xl");
});

test("Text applies weight class", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { weight: "semibold" },
		slots: { default: "Bold" }
	});

	expect(result).toContain("font-semibold");
});

test("Text applies light weight", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { weight: "light" },
		slots: { default: "Light" }
	});

	expect(result).toContain("font-light");
});

test("Text applies color variant", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { color: "muted" },
		slots: { default: "Muted" }
	});

	expect(result).toContain("text-muted-foreground");
});

test("Text applies text alignment", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { align: "center" },
		slots: { default: "Centered" }
	});

	expect(result).toContain("text-center");
});

test("Text applies line clamp", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { lineClamp: 2 },
		slots: { default: "Clamped" }
	});

	expect(result).toContain("line-clamp-2");
});

test("Text renders as label element", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Text, {
		props: { as: "label" },
		slots: { default: "Label" }
	});

	expect(result).toContain("<label");
	expect(result).toContain("Label");
});
