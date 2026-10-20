import { webMcpTools } from "./tools";
import type { DocumentWithModelContext } from "./types";

let currentController: AbortController | null = null;

export function registerWebMcpTools(): void {
	const context = (document as DocumentWithModelContext).modelContext;
	if (!context || typeof context.registerTool !== "function") return;

	currentController?.abort();

	const controller = new AbortController();
	currentController = controller;

	void Promise.all(
		webMcpTools.map((tool) =>
			context.registerTool(tool, { signal: controller.signal })
		)
	).catch((error: unknown) => {
		if (!controller.signal.aborted) {
			console.error("WebMCP tool registration failed", error);
		}
	});
}
