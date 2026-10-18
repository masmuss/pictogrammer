import type { Root } from "mdast";
import { render } from "pele";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const MERMAID_LANGUAGE = "mermaid";

export const remarkPele: Plugin<[], Root> = () => (tree) => {
	visit(tree, "code", (node, index, parent) => {
		if (
			!parent ||
			index === undefined ||
			node.lang !== MERMAID_LANGUAGE ||
			node.value.trim() === ""
		)
			return;

		const result = render(node.value, {
			links: false,
			images: false
		});

		parent.children[index] = {
			type: "html",
			value: `<div class="pele-mermaid">${result.svg}</div>`
		};
	});
};
