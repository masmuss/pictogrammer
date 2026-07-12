import siteConfig from "@/config/site-config";

const dateFormat = new Intl.DateTimeFormat(
	siteConfig.date.locale,
	siteConfig.date.options
);

export function getFormattedDate(
	date: Date,
	options?: Intl.DateTimeFormatOptions
): string {
	if (typeof options !== "undefined") {
		return new Date(date).toLocaleDateString(siteConfig.date.locale, {
			...(siteConfig.date.options as Intl.DateTimeFormatOptions),
			...options
		});
	}

	return dateFormat.format(date);
}

export function calculateDuration(period: string): string {
	const parts = period.split("-").map((p) => p.trim());
	const [startStr, endStr] = parts;
	if (!startStr || !endStr) return "";

	const parseDate = (dateStr: string) => {
		if (/present/i.test(dateStr)) return new Date();
		const d = new Date(dateStr);
		return Number.isNaN(d.getTime()) ? null : d;
	};

	const startDate = parseDate(startStr);
	const endDate = parseDate(endStr);

	if (!startDate || !endDate) return "";

	const diffInMonths =
		(endDate.getFullYear() - startDate.getFullYear()) * 12 +
		(endDate.getMonth() - startDate.getMonth()) +
		1; // Inclusive

	if (diffInMonths < 1) return "";

	const years = Math.floor(diffInMonths / 12);
	const months = diffInMonths % 12;

	const result = [];
	if (years > 0) result.push(`${years}y`);
	if (months > 0) result.push(`${months}m`);
	return result.join(" ");
}
