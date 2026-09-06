import { html } from "satori-html";
import siteConfig from "@/config/site";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const DESCRIPTION_MAX_LENGTH = 200;
export const OG_FONT_NAME = "iA Writer Quattro";

export function decodeHtmlEntities(text: string) {
	if (!text) return text;
	return text.replace(
		/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});/gi,
		(match, entity) => {
			const entities: Record<string, string> = {
				amp: "&",
				apos: "'",
				lt: "<",
				gt: ">",
				quot: '"',
				nbsp: "\u00A0",
				mdash: "\u2014",
				hellip: "\u2026"
			};
			if (entities[entity]) return entities[entity];
			if (entity.startsWith("#x"))
				return String.fromCharCode(Number.parseInt(entity.slice(2), 16));
			if (entity.startsWith("#"))
				return String.fromCharCode(Number.parseInt(entity.slice(1), 10));
			return match;
		}
	);
}

export function truncateText(text: string, maxLength: number) {
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export function buildOgMarkup({
	title,
	description,
	logoBase64,
	category,
	date,
	readTime,
	author,
	authorInitials,
	domain
}: {
	title: string;
	description: string;
	logoBase64: string;
	category?: string;
	date?: string;
	readTime?: string;
	author?: string;
	authorInitials?: string;
	domain?: string;
}) {
	const footerMeta = [date, readTime].filter(Boolean).join(" · ");
	const catStyle = category
		? "padding: 7px 18px; border: 1px solid #3f3f46; border-radius: 9999px; font-size: 24px; color: #a1a1aa;"
		: "";
	const avatarStyle = authorInitials
		? "display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #ffffff; border-radius: 9999px; color: #000000; font-weight: 600; font-size: 18px;"
		: "display: flex;";

	return html`
		<div
			style="
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 100%;
				height: 100%;
				background-color: #18181b;
				color: #f4f4f5;
				font-family: ${OG_FONT_NAME};
				padding: 64px;
			"
		>
			<div
				style="display: flex; align-items: center; justify-content: space-between;"
			>
				<div style="display: flex; align-items: center; gap: 14px;">
					<img
						src="${logoBase64}"
						style="width: 60px; height: 60px; border-radius: 8px;"
					/>
					<span style="font-size: 24px; font-weight: 600;"
						>${siteConfig.title}</span
					>
				</div>
				<span style="${catStyle}">${category || ""}</span>
			</div>

			<div style="display: flex; flex-direction: column;">
				<h1
					style="display: flex; font-size: 60px; font-weight: 800; line-height: 1.1; margin: 0 0 20px 0;"
				>
					${title}
				</h1>
				<div
					style="display: flex; font-size: 24px; color: #a1a1aa; line-height: 1.6; max-width: 720px;"
				>
					${description}
				</div>
			</div>

			<div
				style="display: flex; align-items: center; justify-content: space-between;"
			>
				<div style="display: flex; align-items: center; gap: 14px;">
					<div style="${avatarStyle}">${authorInitials || ""}</div>
					<div style="display: flex; flex-direction: column;">
						<div
							style="display: flex; font-weight: 600; font-size: 24px; line-height: 1.3;"
						>
							${author || ""}
						</div>
						<div
							style="display: flex; font-size: 20px; color: #71717a; line-height: 1.3;"
						>
							${footerMeta}
						</div>
					</div>
				</div>
				<span style="color: #71717a; font-size: 24px;">${domain || ""}</span>
			</div>
		</div>
	`;
}
