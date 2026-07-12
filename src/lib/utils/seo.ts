const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MIN_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 160;
const TITLE_SEPARATOR = " | ";

export function truncateByWordBoundary(
	text: string,
	maxLength: number
): string {
	if (text.length <= maxLength) return text;
	const sliced = text.slice(0, maxLength + 1);
	const cutIndex = Math.max(
		sliced.lastIndexOf(" "),
		sliced.lastIndexOf("-"),
		sliced.lastIndexOf("|")
	);
	const safeText = (
		cutIndex > Math.floor(maxLength * 0.7)
			? sliced.slice(0, cutIndex)
			: text.slice(0, maxLength)
	).trim();
	return `${safeText}...`;
}

export function normalizeTitle(
	raw: string | undefined,
	fallback: string,
	siteTitle: string
): string {
	if (!raw) return fallback;

	const baseTitle = raw.trim();
	const siteTitleTrimmed = siteTitle.trim();
	const hasSiteName = baseTitle
		.toLowerCase()
		.includes(siteTitleTrimmed.toLowerCase());

	if (hasSiteName) return baseTitle;

	const suffix = `${TITLE_SEPARATOR}${siteTitleTrimmed}`;
	let normalized = `${baseTitle}${suffix}`;

	if (normalized.length > TITLE_MAX_LENGTH) {
		const maxBaseLength = TITLE_MAX_LENGTH - suffix.length;
		if (maxBaseLength <= 0) return siteTitleTrimmed;
		const trimmedBase = truncateByWordBoundary(baseTitle, maxBaseLength - 3);
		normalized = `${trimmedBase}${suffix}`;
	}

	return normalized;
}

export function normalizeDescription(
	raw: string | undefined,
	fallbackDescription: string,
	isArticle: boolean
): string {
	const articleSuffix =
		" Read the full article on pictogrammmer for complete context and practical takeaways.";
	const generalSuffix =
		" Explore more writing and projects on pictogrammmer for deeper context and practical resources.";

	let normalized = (raw || "").trim() || fallbackDescription;

	if (normalized.length < DESCRIPTION_MIN_LENGTH) {
		normalized = `${normalized}${isArticle ? articleSuffix : generalSuffix}`;
	}

	if (normalized.length > DESCRIPTION_MAX_LENGTH) {
		normalized = truncateByWordBoundary(normalized, DESCRIPTION_MAX_LENGTH - 3);
	}

	return normalized;
}

export function formatCanonicalURL(url: URL): string {
	const normalizedUrl = new URL(url.toString());
	normalizedUrl.hash = "";
	const normalizedPath =
		normalizedUrl.pathname === "/"
			? "/"
			: normalizedUrl.pathname.replace(/\/+$/, "");
	return `${normalizedUrl.origin}${normalizedPath}${normalizedUrl.search}`;
}
