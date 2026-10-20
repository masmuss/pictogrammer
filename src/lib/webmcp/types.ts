export interface ModelContextToolAnnotations {
	readOnlyHint?: boolean;
	untrustedContentHint?: boolean;
	consequentialHint?: boolean;
	debugging?: boolean;
}

export interface ModelContextTool {
	name: string;
	title?: string;
	description: string;
	inputSchema: Record<string, unknown>;
	annotations?: ModelContextToolAnnotations;
	execute: (
		input: Record<string, unknown>,
		options: { signal: AbortSignal }
	) => Promise<unknown>;
}

export interface ModelContextRegisterToolOptions {
	signal?: AbortSignal;
}

export interface ModelContext {
	registerTool(
		tool: ModelContextTool,
		options?: ModelContextRegisterToolOptions
	): Promise<void>;
}

export type DocumentWithModelContext = Document & {
	modelContext?: ModelContext;
};
