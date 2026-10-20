export function addMarkdownFrontmatter(
	markdown: string,
	file: string,
	siteUrl: string
): string {
	const normalizedFile = file.replace(/\\/g, "/");
	const path = normalizedFile.replace(/\/?index\.html$/, "");
	const url = new URL(path ? `/${path}` : "/", siteUrl).href;
	const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();

	const frontmatter = ["---", `url: ${JSON.stringify(url)}`];
	if (title) frontmatter.push(`title: ${JSON.stringify(title)}`);
	frontmatter.push("---", "");

	return `${frontmatter.join("\n")}\n${markdown}`;
}
