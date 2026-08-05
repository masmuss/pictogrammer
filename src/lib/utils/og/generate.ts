import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
	buildOgMarkup,
	DESCRIPTION_MAX_LENGTH,
	decodeHtmlEntities,
	OG_FONT_NAME,
	OG_HEIGHT,
	OG_WIDTH,
	truncateText
} from "./markup";
import { renderOgResponse } from "./render";

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

export function getAuthorInitials(name: string) {
	return name
		.split(" ")
		.filter((_, i, arr) => i === 0 || i === arr.length - 1)
		.map((n) => n[0])
		.join("");
}

type CreateOgImageResponseOptions = {
	title: string;
	description?: string;
	decodeEntities?: boolean;
	category?: string;
	date?: string;
	readTime?: string;
	author?: string;
	authorInitials?: string;
	domain?: string;
};

export async function createOgImageResponse({
	title,
	description = "",
	decodeEntities = false,
	category,
	date,
	readTime,
	author,
	authorInitials,
	domain
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
		logoBase64,
		category,
		date,
		readTime,
		author,
		authorInitials,
		domain
	});

	return renderOgResponse({
		template: markup,
		width: OG_WIDTH,
		height: OG_HEIGHT,
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
