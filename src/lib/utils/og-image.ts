import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { satoriAstroOG } from "satori-astro";
import { html } from "satori-html";
import siteConfig from "@/config/site-config";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const DESCRIPTION_MAX_LENGTH = 200;
const OG_FONT_NAME = "iA Writer Quattro";

const FONTS_DIR = join(process.cwd(), "src", "assets", "fonts");
const FONT_NORMAL_PATH = join(
	FONTS_DIR,
	"ia-writer-quattro-latin-400-normal.ttf"
);
const FONT_BOLD_PATH = join(
	FONTS_DIR,
	"ia-writer-quattro-latin-700-normal.ttf"
);

const LOGO_PATH = join(
	process.cwd(),
	"src",
	"assets",
	"images",
	"logo-dark.svg"
);

const fontNormalPromise = readFile(FONT_NORMAL_PATH).then((buf) =>
	buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
);
const fontBoldPromise = readFile(FONT_BOLD_PATH).then((buf) =>
	buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
);
const logoBase64Promise = readFile(LOGO_PATH).then(
	(logoBuffer) => `data:image/svg+xml;base64,${logoBuffer.toString("base64")}`
);

function decodeHtmlEntities(text: string) {
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

function truncateText(text: string, maxLength: number) {
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function buildOgMarkup({
	title,
	description,
	logoBase64
}: {
	title: string;
	description: string;
	logoBase64: string;
}) {
	return html`
		<div
			style="
				height: 100%;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-between;
				background-color: #18181b;
				color: #f4f4f5;
				font-family: '${OG_FONT_NAME}';
				padding: 80px;
				position: relative;
			"
		>
			<div
				style="
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					display: flex;
					background-image: radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%);
					background-size: 100px 100px;
					opacity: 0.2;
				"
			></div>

			<div style="display: flex; flex-direction: row; align-items: center;">
				<img
					src="${logoBase64}"
					style="width: 48px; height: 48px; margin-right: 16px;"
				/>
				<span style="font-size: 24px; font-weight: 400; opacity: 0.8;"
					>${siteConfig.title}</span
				>
			</div>

			<div
				style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; width: 100%;"
			>
				<h1
					style="
						font-size: 60px;
						font-weight: 700;
						line-height: 1.1;
						margin: 0 0 24px 0;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						text-overflow: ellipsis;
					"
				>
					${title}
				</h1>

				<div
					style="
						font-size: 28px;
						line-height: 1.5;
						opacity: 0.7;
						margin: 0;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						text-overflow: ellipsis;
					"
				>
					${description}
				</div>
			</div>

			<div style="display: flex; flex-direction: row; align-items: center;">
				<span style="font-size: 24px; opacity: 0.6;"
					>by ${siteConfig.author}</span
				>
			</div>
		</div>
	`;
}

type CreateOgImageResponseOptions = {
	title: string;
	description?: string;
	decodeEntities?: boolean;
};

export async function createOgImageResponse({
	title,
	description = "",
	decodeEntities = false
}: CreateOgImageResponseOptions) {
	const safeTitle = decodeEntities ? decodeHtmlEntities(title) : title;
	const safeDescription = decodeEntities
		? decodeHtmlEntities(description)
		: description;
	const clampedDescription = truncateText(
		safeDescription,
		DESCRIPTION_MAX_LENGTH
	);

	const results = await Promise.allSettled([
		fontNormalPromise,
		fontBoldPromise,
		logoBase64Promise
	]);

	const [fontNormalResult, fontBoldResult, logoResult] = results;

	if (fontNormalResult.status === "rejected") {
		throw new Error(`Failed to load font normal: ${fontNormalResult.reason}`);
	}
	if (fontBoldResult.status === "rejected") {
		throw new Error(`Failed to load font bold: ${fontBoldResult.reason}`);
	}
	if (logoResult.status === "rejected") {
		throw new Error(`Failed to load logo: ${logoResult.reason}`);
	}

	const fontNormal = fontNormalResult.value;
	const fontBold = fontBoldResult.value;
	const logoBase64 = logoResult.value;

	const markup = buildOgMarkup({
		title: safeTitle,
		description: clampedDescription,
		logoBase64
	});

	return satoriAstroOG({
		template: markup,
		width: OG_WIDTH,
		height: OG_HEIGHT
	}).toResponse({
		satori: {
			fonts: [
				{
					name: OG_FONT_NAME,
					data: fontNormal,
					weight: 400,
					style: "normal"
				},
				{
					name: OG_FONT_NAME,
					data: fontBold,
					weight: 700,
					style: "normal"
				}
			]
		}
	});
}
