# Atlas Builder Skill

`atlas-builder` is a portable AI agent skill for the **Design Atlas** design system, modeled after [`carbon-builder`](https://github.com/carbon-design-system/carbon-mcp/tree/main/public/skills/carbon-builder). It pairs with `@design-atlas/mcp` so AI coding assistants and Figma Make workflows generate token-compliant Svelte, React, and CSS code.

## Structure

```text
skills/atlas-builder/
├── SKILL.md
├── README.md
└── references/
    ├── framework-rules.md
    └── figma-make-integration.md
```

## Installation

Copy the `skills/atlas-builder/` folder into your AI client's skills directory:

- **Cursor**: `.cursor/skills/atlas-builder/` (or project `.agents/skills/atlas-builder/`)
- **Claude Code**: `~/.claude/skills/atlas-builder/` or `.claude/skills/atlas-builder/`
- **VS Code / GitHub Copilot**: `.github/skills/atlas-builder/`
- **Gemini CLI / Codex**: `.agents/skills/atlas-builder/`

Pair it with the MCP server configuration in `.mcp.json.example` at the repository root.
