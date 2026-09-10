import sanitizeHtml from "sanitize-html";

const captionSanitizeOptions: sanitizeHtml.IOptions = {
	allowedTags: ["a"],
	allowedAttributes: {
		a: ["href", "title"]
	},
	allowedSchemes: ["http", "https", "mailto"]
};

export function sanitizeCaption(caption: string): string {
	return sanitizeHtml(caption, captionSanitizeOptions);
}
