import type { Node, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { h, isNodeDirective } from "../lib/utils/remark";

const DIRECTIVE_NAME = "github";

interface GithubTarget {
	repoName: string;
	owner?: string;
	repo?: string;
	displayName: string;
}

function resolveGithubTarget(rawName: string): GithubTarget {
	let name = rawName.endsWith("/") ? rawName.slice(0, -1) : rawName;
	name = name.startsWith("https://github.com/")
		? name.slice("https://github.com/".length)
		: name;

	const repoParts = name.split("/");
	const [owner, repo] = repoParts;
	const isRepo = repoParts.length > 1;
	const displayName =
		isRepo && owner && repo ? `${owner}/${repo}` : (owner ?? name);

	return { repoName: name, owner, repo, displayName };
}

function githubTargetFromNode(node: Node): GithubTarget | null {
	if (!isNodeDirective(node)) return null;
	if (node.type !== "leafDirective" || node.name !== DIRECTIVE_NAME) {
		return null;
	}

	const rawName = node.attributes?.repo ?? node.attributes?.user;
	if (!rawName) return null;

	return resolveGithubTarget(rawName);
}

function buildAttrs(target: GithubTarget): Record<string, string> {
	return target.repo
		? { repo: target.repoName, class: "github-card" }
		: { user: target.repoName, class: "github-card" };
}

function buildFallbackLink(target: GithubTarget): ReturnType<typeof h> {
	return h(
		"a",
		{
			href: `https://github.com/${target.repoName}`,
			target: "_blank",
			rel: "noopener noreferrer",
			class: "not-prose"
		},
		[{ type: "text", value: target.displayName }]
	);
}

export const remarkGithubCard: Plugin<[], Root> = () => (tree) => {
	visit(tree, (node, index, parent) => {
		if (!parent || index === undefined) return;

		const target = githubTargetFromNode(node);
		if (!target) return;

		const fallbackLink = buildFallbackLink(target);

		parent.children.splice(
			index,
			1,
			h("github-card", buildAttrs(target), [fallbackLink])
		);
	});
};
