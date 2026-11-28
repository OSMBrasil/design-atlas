---
name: atlas-figma-make
description: Figma Make and Figma MCP integration skill for Design Atlas. Configures two-way workflows between @design-atlas/mcp, Figma Make Custom Connectors, Figma Remote/Desktop MCP, and Code Connect.
---

# Atlas Figma Make & Figma MCP Skill

## Mission
Connect **Design Atlas** (`@design-atlas/mcp`) with **Figma Make** and **Figma MCP** so designs, variables, and prototypes stay synchronized with Atlas tokens, Svelte components, and React components.

## Repository Documentation Links
- [Dual MCP Client Config Example](../../.mcp.json.example)
- [Design Atlas MCP Server README](../../packages/mcp/README.md)
- [Atlas Figma Library & Overview](../../README.md)
- [Designing with Atlas Guide](../../apps/docs/using-atlas/designing.md)
- [Figma Make Integration Reference](../atlas-builder/references/figma-make-integration.md)

## Two-Way Workflow
1. **Design Atlas MCP inside Figma Make (Custom Connector)**:
   - Run `pnpm --filter @design-atlas/mcp start:http` (`http://127.0.0.1:3846/mcp`).
   - Expose over HTTPS (tunnel or hosted URL) and register in Figma Make (`Add context -> Connectors -> Manage -> Created by you -> Create`).
2. **Figma MCP + Atlas MCP in AI IDEs (`.mcp.json.example`)**:
   - Pair `design-atlas` (`stdio`) with `figma-remote` (`https://mcp.figma.com/mcp`) or `figma-desktop` (`http://127.0.0.1:3845/mcp`).
   - Extract Figma node context via Figma MCP, map variables via `tokens_search`, check component parity via `components_inventory`, and validate generated code via `code_audit`.
