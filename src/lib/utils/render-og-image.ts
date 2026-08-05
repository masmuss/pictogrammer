import type { SatoriOptions } from "satori";
import satori from "satori";
import sharp from "sharp";

type RenderOgResponseOptions = {
	template: Parameters<typeof satori>[0];
	width: number;
	height: number;
	satori: Omit<SatoriOptions, "width" | "height">;
};

async function renderOgPng({
	template,
	width,
	height,
	satori: satoriOptions
}: RenderOgResponseOptions): Promise<Buffer> {
	const svg = await satori(template, { width, height, ...satoriOptions });

	return sharp(Buffer.from(svg)).resize(width, height).png().toBuffer();
}

export async function renderOgResponse(
	options: RenderOgResponseOptions
): Promise<Response> {
	const png = await renderOgPng(options);

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Content-Length": png.length.toString(),
			"Cache-Control": "public, max-age=31536000, immutable"
		}
	});
}
