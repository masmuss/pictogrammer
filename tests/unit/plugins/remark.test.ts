import type { Root } from "mdast";
import type {
	ContainerDirective,
	LeafDirective
} from "mdast-util-directive";
import { describe, expect, it } from "vitest";
import { remarkAdmonitions } from "@/plugins/remark-admonitions";
import { remarkGithubCard } from "@/plugins/remark-github-card";

function runGithubCard(tree: Root) {
	const attacher =
		remarkGithubCard as unknown as () => (tree: Root) => void;
	attacher()(tree);
}

function runAdmonitions(tree: Root) {
	const attacher =
		remarkAdmonitions as unknown as () => (tree: Root) => void;
	attacher()(tree);
}

function leafGithub(attributes: Record<string, string>): LeafDirective {
	return {
		type: "leafDirective",
		name: "github",
		attributes,
		children: []
	};
}

describe("remarkGithubCard", () => {
	it("expands a repo shorthand into a github-card node", () => {
		const tree: Root = {
			type: "root",
			children: [leafGithub({ repo: "https://github.com/masmuss/x/" })]
		};
		runGithubCard(tree);
		const node = tree.children[0] as unknown as {
			data: { hName: string; hProperties: Record<string, string> };
		};
		expect(node.data.hName).toBe("github-card");
		expect(node.data.hProperties.repo).toBe("masmuss/x");
	});

	it("supports user-only cards", () => {
		const tree: Root = {
			type: "root",
			children: [leafGithub({ user: "masmuss" })]
		};
		runGithubCard(tree);
		const node = tree.children[0] as unknown as {
			data: { hName: string; hProperties: Record<string, string> };
		};
		expect(node.data.hProperties.user).toBe("masmuss");
	});

	it("ignores directives without repo or user", () => {
		const dir = leafGithub({});
		const tree: Root = { type: "root", children: [dir] };
		runGithubCard(tree);
		expect(tree.children[0]).toBe(dir);
	});
});

describe("remarkAdmonitions", () => {
	it("wraps supported container directives in an aside", () => {
		const dir: ContainerDirective = {
			type: "containerDirective",
			name: "note",
			attributes: {},
			children: [
				{
					type: "paragraph",
					children: [{ type: "text", value: "Be careful" }]
				}
			]
		};
		const tree: Root = { type: "root", children: [dir] };
		runAdmonitions(tree);
		const node = tree.children[0] as unknown as {
			data: { hName: string; hProperties: Record<string, string> };
		};
		expect(node.data.hName).toBe("aside");
		expect(node.data.hProperties.dataAdmonitionType).toBe("note");
	});

	it("leaves unknown container directives untouched", () => {
		const dir: ContainerDirective = {
			type: "containerDirective",
			name: "foobar",
			attributes: {},
			children: []
		};
		const tree: Root = { type: "root", children: [dir] };
		runAdmonitions(tree);
		expect(tree.children[0]).toBe(dir);
	});

	it("converts leaf directives back to plain paragraphs", () => {
		const tree: Root = {
			type: "root",
			children: [leafGithub({ repo: "a/b" })]
		};
		runAdmonitions(tree);
		const [first] = tree.children;
		expect(first?.type).toBe("paragraph");
	});
});
