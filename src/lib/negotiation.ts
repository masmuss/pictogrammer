export interface AcceptEntry {
	type: string;
	q: number;
	specificity: number;
}

export const HTML_TYPE = "text/html";
export const MARKDOWN_TYPE = "text/markdown";

const STATIC_EXTENSION =
	/\.(?:css|js|mjs|map|json|txt|xml|md|webmanifest|ya?ml|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot|pdf|mp4|webm|mp3|wav|ogg|zip)$/i;

export function parseAccept(header: string): AcceptEntry[] {
	return header
		.split(",")
		.map((raw) => {
			const [rawType, ...params] = raw.split(";").map((part) => part.trim());
			const type = rawType?.toLowerCase();

			if (!type) return null;

			let q = 1;
			for (const param of params) {
				const [name, value] = param.split("=").map((part) => part.trim());
				if (name?.toLowerCase() !== "q") continue;

				const parsed = Number(value);
				if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
			}

			const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;

			return { type, q, specificity };
		})
		.filter((entry): entry is AcceptEntry => entry !== null);
}

function matches(entry: AcceptEntry, candidate: string): boolean {
	if (entry.type === "*/*") return true;
	if (entry.type.endsWith("/*")) {
		return candidate.startsWith(entry.type.slice(0, -1));
	}
	return entry.type === candidate;
}

export function preferredType(
	header: string | null,
	produces: string[]
): string | null {
	const fallback = produces[0] ?? null;
	if (!header) return fallback;

	const entries = parseAccept(header);
	if (entries.length === 0) return fallback;

	let bestType: string | null = null;
	let bestQ = -1;
	let bestPosition = Number.POSITIVE_INFINITY;

	for (const candidate of produces) {
		let matched: AcceptEntry | null = null;
		let matchedPosition = Number.POSITIVE_INFINITY;

		for (let index = 0; index < entries.length; index++) {
			const entry = entries[index];
			if (!entry || !matches(entry, candidate)) continue;

			if (
				matched === null ||
				entry.specificity > matched.specificity ||
				(entry.specificity === matched.specificity && index < matchedPosition)
			) {
				matched = entry;
				matchedPosition = index;
			}
		}

		if (matched === null || matched.q <= 0) continue;

		if (
			matched.q > bestQ ||
			(matched.q === bestQ && matchedPosition < bestPosition)
		) {
			bestQ = matched.q;
			bestPosition = matchedPosition;
			bestType = candidate;
		}
	}

	return bestType;
}

export function appendVaryAccept(headers: Headers): void {
	const existing = headers.get("vary");
	if (!existing) {
		headers.set("Vary", "Accept");
		return;
	}

	const tokens = existing.split(",").map((token) => token.trim().toLowerCase());
	if (tokens.includes("*") || tokens.includes("accept")) return;

	headers.set("Vary", `${existing}, Accept`);
}

function normalizePath(pathname: string): string {
	return pathname.replace(/\/+$/, "") || "/";
}

export function markdownPath(pathname: string): string {
	const clean = normalizePath(pathname);
	if (clean === "/") return "/index.md";
	return `${clean}/index.md`;
}

export function pagePath(pathname: string): string {
	return normalizePath(pathname);
}

export function isNegotiablePath(pathname: string): boolean {
	if (pathname === "/404" || pathname === "/500") return false;
	if (pathname.startsWith("/_")) return false;
	if (pathname.startsWith("/api/")) return false;
	if (pathname.startsWith("/cdn-cgi/")) return false;
	if (pathname.startsWith("/pagefind/")) return false;
	if (pathname.startsWith("/.well-known/")) return false;
	return !STATIC_EXTENSION.test(pathname);
}
