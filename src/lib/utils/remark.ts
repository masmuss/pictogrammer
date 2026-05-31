import { h as _h, type Properties } from "hastscript";
import type { Node, Paragraph as P, RootContent } from "mdast";
import type { Directives } from "mdast-util-directive";

declare module "mdast" {
	interface ParagraphData {
		hName?: string;
		hProperties?: Properties;
	}
}

/** Checks if a node is a directive. */
export function isNodeDirective(node: Node): node is Directives {
	return (
		node.type === "containerDirective" ||
		node.type === "leafDirective" ||
		node.type === "textDirective"
	);
}

/** From Astro Starlight: Function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
export function h(
	el: string,
	attrs: Properties = {},
	children: RootContent[] = []
): P {
	const { properties, tagName } = _h(el, attrs);
	return {
		children: children as P["children"],
		data: { hName: tagName, hProperties: properties },
		type: "paragraph"
	};
}
