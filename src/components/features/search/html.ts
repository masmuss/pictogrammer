export function escapeHtml(value: string): string {
	const element = document.createElement("div");
	element.textContent = value;
	return element.innerHTML;
}

export function sanitizeExcerpt(excerpt: string): string {
	const template = document.createElement("template");
	template.innerHTML = excerpt;

	for (const element of template.content.querySelectorAll("*")) {
		if (element.tagName !== "MARK") {
			element.replaceWith(document.createTextNode(element.textContent ?? ""));
			continue;
		}

		for (const attribute of [...element.attributes]) {
			element.removeAttribute(attribute.name);
		}
	}

	return template.innerHTML;
}
