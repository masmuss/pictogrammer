import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { EXTERNAL_POST_REDIRECTS_PATH } from "../config/external-posts";

const REDIRECT_START = "# external-post-redirects:start";
const REDIRECT_END = "# external-post-redirects:end";
const GENERATED_REDIRECTS =
	/# external-post-redirects:start[\s\S]*?# external-post-redirects:end\n?/g;
const SEARCH_INDEX_IGNORE = '<html data-pagefind-ignore="all">';

export type ExternalPostRedirect = {
	path: string;
	destination: string;
};

export const externalPostPaths = new Set<string>();

export function createRedirectManifest(
	redirects: ExternalPostRedirect[],
): string {
	const manifest = Object.fromEntries(
		redirects.map(({ path, destination }) => [path, destination]),
	);

	return `${JSON.stringify(manifest, null, 2)}\n`;
}

export function updateRedirectFile(
	content: string,
	redirects: ExternalPostRedirect[],
): string {
	const existing = content.replace(GENERATED_REDIRECTS, "").trimEnd();
	const generated = redirects.length
		? [
				REDIRECT_START,
				...redirects.map(
					({ path, destination }) => `${path} ${destination} 301`,
				),
				REDIRECT_END,
			].join("\n")
		: "";

	if (!existing && !generated) return "";
	return `${existing}${existing && generated ? "\n\n" : ""}${generated}\n`;
}

export function excludeRedirectPageFromIndex(html: string): string {
	if (html.includes("<html")) {
		return html.replace("<html", '<html data-pagefind-ignore="all"');
	}

	const doctype = html.match(/^<!doctype html>/i)?.[0] ?? "";
	const content = doctype ? html.slice(doctype.length) : html;
	return `${doctype}${SEARCH_INDEX_IGNORE}${content}</html>`;
}

function decodeHtmlAttribute(value: string): string {
	return value
		.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
			String.fromCodePoint(Number.parseInt(hex, 16)),
		)
		.replace(/&#(\d+);/g, (_, decimal: string) =>
			String.fromCodePoint(Number.parseInt(decimal, 10)),
		)
		.replace(/&quot;/gi, '"')
		.replace(/&apos;/gi, "'")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&amp;/gi, "&");
}

export function getRedirectDestination(html: string): string | null {
	const meta = html.match(/<meta\b[^>]*http-equiv=["']refresh["'][^>]*>/i)?.[0];
	const content = meta?.match(/\bcontent=["']([^"']+)["']/i)?.[1];
	const destination = content?.match(/(?:^|;)\s*url\s*=\s*(.+)$/i)?.[1];

	if (!destination) return null;

	try {
		return new URL(decodeHtmlAttribute(destination.trim())).href;
	} catch {
		return null;
	}
}

async function readRedirectFile(url: URL): Promise<string> {
	try {
		return await readFile(url, "utf8");
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return "";
		}
		throw error;
	}
}

async function collectRedirectPages(
	outDir: string,
): Promise<ExternalPostRedirect[]> {
	const files = await readdir(outDir, { recursive: true });
	const blogPages = files
		.filter((file) => {
			const normalized = file.split(path.sep).join("/");
			return (
				normalized.startsWith("blog/") && normalized.endsWith("/index.html")
			);
		})
		.sort();
	const redirects: ExternalPostRedirect[] = [];

	for (const file of blogPages) {
		const normalized = file.split(path.sep).join("/");
		const htmlPath = path.join(outDir, normalized);
		const html = await readFile(htmlPath, "utf8");
		const destination = getRedirectDestination(html);
		if (!destination) continue;

		redirects.push({
			path: `/${normalized.replace(/\/index\.html$/, "")}`,
			destination,
		});
		await writeFile(htmlPath, excludeRedirectPageFromIndex(html));
	}

	return redirects;
}

export default function externalPostRedirectsIntegration(): AstroIntegration {
	return {
		name: "external-post-redirects",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const outDir = fileURLToPath(dir);
				const redirects = await collectRedirectPages(outDir);

				externalPostPaths.clear();
				for (const { path: routePath } of redirects) {
					externalPostPaths.add(routePath);
				}

				await writeFile(
					new URL(`.${EXTERNAL_POST_REDIRECTS_PATH}`, dir),
					createRedirectManifest(redirects),
				);

				const redirectsUrl = new URL("./_redirects", dir);
				const existing = await readRedirectFile(redirectsUrl);
				await writeFile(redirectsUrl, updateRedirectFile(existing, redirects));

				logger.info(`Generated ${redirects.length} external post redirects`);
			},
		},
	};
}
