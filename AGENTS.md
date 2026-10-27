# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## Stack

- Next.js 16 App Router, React 19, TypeScript (strict), fully static generation
- Tailwind CSS v4 via `@tailwindcss/postcss`; design tokens in `src/app/globals.css`
- Content: `content/**/*.md` parsed with `yaml` + unified/remark/rehype at build time
- No animation library: CSS transitions only; keep client JS minimal (server components by default)
- Testing: Vitest + jsdom + Testing Library

## Commands

| Task                   | Command                                   |
| ---------------------- | ----------------------------------------- |
| Dev server             | `npm run dev`                             |
| Build                  | `npm run build`                           |
| Content validation     | `npm run content:check`                   |
| Lint                   | `npm run lint`                            |
| Type-check             | `npm run typecheck`                       |
| Format (write / check) | `npm run format` / `npm run format:check` |
| Test                   | `npm test`                                |

Run `npm run content:check`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`
before considering a change complete (CI runs the same in `.github/workflows/ci.yml`).

## Conventions

- Node `>=24` (`.nvmrc`, `engines.node`). Use the committed `package-lock.json`.
- TypeScript strict with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`. No `any`, no non-null `!`.
- Prettier (`.prettierrc`): no semicolons, single quotes, 2-space indent, 100 print width.
- Import alias `@/*` maps to `src/*`.
- Co-locate tests as `*.test.ts(x)`; content fixtures live in `src/test/fixtures/content`.
- Secrets are server-only env vars (never `NEXT_PUBLIC_`). Never log PII or keys.
- Canonical origin `https://nolangrout.com`, no trailing slash. Every page sets metadata via `pageMetadata()` and JSON-LD via `<JsonLd>`.
- Never publish numbers/outcomes without a claim + evidence in content frontmatter; `content/` and `scripts/content-check.mjs` follow the shared contract.

## Structure

See `README.md`.
