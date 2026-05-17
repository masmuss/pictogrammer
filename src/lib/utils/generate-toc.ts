import type { MarkdownHeading } from "astro";

const MIN_HEADING_DEPTH = 2;
const MAX_HEADING_DEPTH = 4;

export interface TocItem extends MarkdownHeading {
	subheadings: Array<TocItem>;
}

function diveChildren(item: TocItem, depth: number): Array<TocItem> {
	if (depth === 1 || !item.subheadings.length) {
		return item.subheadings;
	}
	return diveChildren(
		item.subheadings[item.subheadings.length - 1] as TocItem,
		depth - 1
	);
}

export function generateToc(headings: ReadonlyArray<MarkdownHeading>) {
	const bodyHeadings = [
		...headings.filter(
			({ depth }) => depth >= MIN_HEADING_DEPTH && depth <= MAX_HEADING_DEPTH
		)
	];
	const toc: Array<TocItem> = [];

	for (const h of bodyHeadings) {
		const heading: TocItem = { ...h, subheadings: [] };

		if (heading.depth === 2) {
			toc.push(heading);
		} else {
			if (toc.length === 0) {
				throw new Error(`Orphan heading found: ${heading.text}.`);
			}
			const lastItemInToc = toc[toc.length - 1];
			if (heading.depth < lastItemInToc.depth) {
				throw new Error(`Orphan heading found: ${heading.text}.`);
			}

			const gap = heading.depth - lastItemInToc.depth;
			const target = diveChildren(lastItemInToc, gap);
			target.push(heading);
		}
	}
	return toc;
}
