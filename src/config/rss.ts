import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const sanitizeOptions: sanitizeHtml.IOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat([
		"img",
		"iframe",
		"pre",
		"code",
		"span",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"table",
		"thead",
		"tbody",
		"tr",
		"th",
		"td"
	]),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		img: ["src", "alt", "title", "width", "height"],
		a: ["href", "name", "target", "title"],
		code: ["class"],
		pre: ["class"],
		span: ["class", "style"],
		iframe: ["src", "width", "height", "allow", "allowfullscreen"]
	}
};

export const markdownParser = new MarkdownIt();

export function parseAndSanitizeMarkdown(markdown: string): string {
	const rawHtml = markdownParser.render(markdown || "");
	return sanitizeHtml(rawHtml, sanitizeOptions);
}
