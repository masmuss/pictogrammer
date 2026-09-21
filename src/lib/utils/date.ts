import siteConfig from "@/config/site";

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
