/**
 * auth.md — Agent Registration Information
 * https://workos.com/auth-md
 * https://github.com/workos/auth.md
 *
 * This site has no protected APIs or user accounts.
 * auth.md is served to explicitly communicate to agents that
 * all resources are publicly accessible without authentication,
 * and to document the site's agent interaction policy.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const content = `# khoirul.me — Agent Authentication & Registration

> This site has **no protected APIs**. All content is publicly accessible.
> No authentication, registration, or credentials are required.

## Site Information

- **Name:** Khoirul Fattah Personal Website (pictogrammer)
- **Owner:** Ahmad Musafir Khoirul Fattah
- **Contact:** hello@khoirul.me
- **Homepage:** https://khoirul.me
- **Source:** https://github.com/masmuss/pictogrammer

## Authentication

**No authentication required.** This is a fully public static website.

- No OAuth flows
- No API keys
- No user accounts
- No protected endpoints

Agents may access all resources without credentials.

## Agent Registration

Agent registration is **not required or supported** for this site.
There is no \`/.well-known/oauth-authorization-server\` or \`/.well-known/oauth-protected-resource\`
because no resources require a token.

## Machine-Readable Resources (Public, No Auth)

| Resource | URL | Format |
|---|---|---|
| LLMs.txt | https://khoirul.me/llms.txt | text/plain |
| LLMs-Full.txt | https://khoirul.me/llms-full.txt | text/plain |
| RSS Feed | https://khoirul.me/rss.xml | application/rss+xml |
| Sitemap | https://khoirul.me/sitemap-index.xml | application/xml |
| API Catalog | https://khoirul.me/.well-known/api-catalog | application/linkset+json |
| ARD Manifest | https://khoirul.me/.well-known/ai-catalog.json | application/json |
| Agent Skills | https://khoirul.me/.well-known/agent-skills/index.json | application/json |
| MCP Server Card | https://khoirul.me/.well-known/mcp/server-card.json | application/json |

## Content Policy

Governed by \`robots.txt\` Content Signals (https://contentsignals.org/):

- \`ai-train=no\` — Content may **not** be used for AI training
- \`search=yes\` — Content **may** be indexed for search
- \`ai-input=no\` — Content may **not** be used as AI prompt context

See: https://khoirul.me/robots.txt
See: https://khoirul.me/legal for the full content license.
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": "public, max-age=3600"
		}
	});
};
