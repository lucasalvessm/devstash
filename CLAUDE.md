# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Neon MCP Usage

- Org: `Lucas` (`org-withered-sun-34798781`)
- Project: `dev-stash` (`holy-glade-58004026`)
- Default branch for all Neon MCP calls: **`development`** (`br-muddy-cloud-ay6kgh8h`)
- Never run Neon MCP tools against the `production` branch (`br-damp-base-ay4gz102`) or any destructive Neon tool unless I explicitly say "production" in the request. If a request is ambiguous about which branch, assume `development` and say which branch you used.

## Commands

- `npm run dev` — start the dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)
- `npm run test:e2e` — Playwright E2E tests (`e2e/`); boots the dev server automatically