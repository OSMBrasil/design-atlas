# Development Setup

## Prerequisites

- Node.js (see `.nvmrc` for version)
- pnpm

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd design-atlas
nvm use
pnpm install

# Build all packages
pnpm -r build

# Run smoke tests
pnpm run smoke:all
```

## Development Workflow

```bash
# Work on packages
cd packages/react  # or svelte/tokens
# Make changes...

# Build and test
pnpm build
pnpm -r build  # build all packages

# Test changes
pnpm run smoke:all
```

## Package Structure

- `packages/react` - React components
- `packages/svelte` - Svelte components  
- `packages/tokens` - Design tokens
- `apps/docs` - Documentation site
- `apps/svelte-demo` - Svelte demo app

## Scripts

- `pnpm -r build` - build all packages
- `pnpm run smoke:all` - run smoke tests
- `pnpm changeset` - create changeset for release

## Naming Convention

All packages, components, styles, and documentation in Design Atlas follow a strict naming convention:

1. **Framework Components (Svelte & React):** PascalCase with the `Atl` prefix — e.g., `AtlButton`, `AtlAlert`, `AtlTextInput`, `AtlContainer`.
   - Props/interfaces follow the same prefix — e.g., `AtlButtonProps`.
2. **CSS Classes:** kebab-case with the `.atl-` prefix — e.g., `.atl-button`, `.atl-alert`, `.atl-field`.
3. **Web Components (Custom Elements, future/target):** kebab-case tag names with the `atl-` prefix — e.g., `<atl-button>`, `<atl-alert>`.
