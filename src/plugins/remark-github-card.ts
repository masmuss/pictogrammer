import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { h, isNodeDirective } from "../lib/utils/remark";

const DIRECTIVE_NAME = "github";

export const remarkGithubCard: Plugin<[], Root> = () => (tree) => {
	visit(tree, (node, index, parent) => {
		if (!parent || index === undefined || !isNodeDirective(node)) return;

		if (node.type !== "leafDirective" || node.name !== DIRECTIVE_NAME) return;

		let repoName = node.attributes?.repo ?? node.attributes?.user ?? null;
		if (!repoName) return;

		repoName = repoName.endsWith("/") ? repoName.slice(0, -1) : repoName;
		repoName = repoName.startsWith("https://github.com/")
			? repoName.replace("https://github.com/", "")
			: repoName;

		const repoParts = repoName.split("/");
		const realUrl = `https://github.com/${repoName}`;
		const isRepo = repoParts.length > 1;
		const displayName = isRepo
			? `${repoParts[0]}/${repoParts[1]}`
			: repoParts[0];

		const attrs: Record<string, string> = isRepo
			? { repo: repoName, class: "github-card" }
			: { user: repoName, class: "github-card" };

		const fallbackLink = h(
			"a",
			{
				href: realUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				class: "not-prose"
			},
			[{ type: "text", value: displayName }]
		);

		parent.children.splice(index, 1, h("github-card", attrs, [fallbackLink]));
	});
};
