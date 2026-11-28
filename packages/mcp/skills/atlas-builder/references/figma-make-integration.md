# Figma Make & Figma MCP Integration Guide

Design Atlas supports a **two-way MCP workflow** with Figma and Figma Make:

## Direction A: Connect Design Atlas MCP into Figma Make (Custom Connector)
Figma Make allows connecting external MCP servers via Custom Connectors so Figma Make's AI agent can query Design Atlas tokens, docs, and components while generating prototypes or UI.

1. Start the Design Atlas MCP server in Streamable HTTP mode:
   ```bash
   pnpm --filter @design-atlas/mcp start:http
   # Listening on http://127.0.0.1:3846/mcp
   ```
2. Expose the local port over HTTPS (for example using `cloudflared tunnel --url http://127.0.0.1:3846` or a hosted deployment URL).
3. In **Figma Make**:
   - Click **Add context** -> **Connectors** -> **Manage**.
   - Open the **Created by you** tab and click **Create**.
   - Enter Name: `design-atlas-mcp`.
   - Enter the HTTPS URL ending in `/mcp` (e.g., `https://atlas-mcp.example.com/mcp`) and click **Create**.
   - Enable the tools: `docs_search`, `code_search`, `tokens_search`, `code_audit`, `components_inventory`.

## Direction B: Connect Figma MCP + Design Atlas MCP Together in Your IDE
When translating Figma Make or Figma Design frames into React or Svelte code in Cursor, VS Code, or Claude Code, configure **both** servers in `.mcp.json` (see `.mcp.json.example` at the repo root):
- `design-atlas` (local `stdio`): provides Atlas tokens, Svelte/React components, and `code_audit`.
- `figma-remote` (`https://mcp.figma.com/mcp`) or `figma-desktop` (`http://127.0.0.1:3845/mcp`): provides live Figma node context, variables, and Figma Make project resources.

### Recommended Prompting Workflow
1. Paste a Figma Design or Figma Make frame link in your AI IDE.
2. Ask the agent to fetch the Figma node context via Figma MCP.
3. Instruct the agent (via `atlas-builder` skill) to map Figma variables to `tokens_search`, check component availability via `components_inventory`, and validate the generated React/Svelte code with `code_audit`.

## Code Connect Readiness (React & Svelte)
When `@design-atlas/react` components are implemented, add `*.figma.tsx` Code Connect files (following Carbon's pattern) so Figma Dev Mode and Figma MCP emit `@design-atlas/react` imports directly.
