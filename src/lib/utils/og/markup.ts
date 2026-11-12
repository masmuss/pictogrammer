import { type CSSProperties, createElement, type JSXNode } from "satori/jsx";
import siteConfig from "@/config/site";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const DESCRIPTION_MAX_LENGTH = 200;
export const OG_FONT_NAME = "Geist Sans";

const rootStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	width: "100%",
	height: "100%",
	backgroundColor: "#FFFCF0",
	color: "#100F0F",
	fontFamily: OG_FONT_NAME,
	padding: 64,
};

const headerStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
};

const logoGroupStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: 14,
};

const contentStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
};

const footerStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
};

function element(
	type: string,
	props: Record<string, unknown> | null,
	...children: JSXNode[]
): JSXNode {
	return createElement(type, props, ...children) as JSXNode;
}

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
				hellip: "\u2026",
			};
			if (entities[entity]) return entities[entity];
			if (entity.startsWith("#x"))
				return String.fromCharCode(Number.parseInt(entity.slice(2), 16));
			if (entity.startsWith("#"))
				return String.fromCharCode(Number.parseInt(entity.slice(1), 10));
			return match;
		},
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
	domain,
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
	const avatarStyle = authorInitials
		? {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: 48,
				height: 48,
				backgroundColor: "#100F0F",
				borderRadius: 9999,
				color: "#FFFCF0",
				fontWeight: 600,
				fontSize: 18,
			}
		: { display: "flex" };
	const categoryStyle: CSSProperties = category
		? {
				padding: "7px 18px",
				border: "1px solid #E6E4D9",
				borderRadius: 9999,
				fontSize: 24,
				color: "#6F6E69",
			}
		: {};

	const image = element("img", {
		src: logoBase64,
		style: { width: 60, borderRadius: 8 },
	});
	const siteTitle = element(
		"span",
		{ style: { fontSize: 26, fontWeight: 500 } },
		siteConfig.title,
	);
	const logoGroup = element("div", { style: logoGroupStyle }, image, siteTitle);
	const header = element(
		"div",
		{ style: headerStyle },
		logoGroup,
		element("span", { style: categoryStyle }, category || ""),
	);
	const content = element(
		"div",
		{ style: contentStyle },
		element(
			"h1",
			{
				style: {
					display: "flex",
					fontSize: 60,
					fontWeight: 800,
					lineHeight: 1.1,
					margin: "0 0 20px 0",
				},
			},
			title,
		),
		element(
			"div",
			{
				style: {
					display: "flex",
					fontSize: 24,
					color: "#6F6E69",
					lineHeight: 1.6,
					maxWidth: 720,
				},
			},
			description,
		),
	);
	const authorDetails = element(
		"div",
		{ style: contentStyle },
		element(
			"div",
			{
				style: {
					display: "flex",
					fontWeight: 600,
					fontSize: 24,
					lineHeight: 1.3,
				},
			},
			author || "",
		),
		element(
			"div",
			{
				style: {
					display: "flex",
					fontSize: 20,
					color: "#6F6E69",
					lineHeight: 1.3,
				},
			},
			footerMeta,
		),
	);
	const footer = element(
		"div",
		{ style: footerStyle },
		element(
			"div",
			{ style: logoGroupStyle },
			element("div", { style: avatarStyle }, authorInitials || ""),
			authorDetails,
		),
		element(
			"span",
			{ style: { color: "#536907", fontSize: 24 } },
			domain || "",
		),
	);

	return element("div", { style: rootStyle }, header, content, footer);
}
