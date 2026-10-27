# nolangrout.com

Personal authority site for Nolan Grout: AI business systems and AI agents for enterprises.
Next.js 16 App Router, fully statically generated, deployed on Vercel from `master`.

## Quick start

```bash
nvm use            # Node 24
npm ci
npm run dev        # http://localhost:3000
```

## Scripts

| Task                     | Command                                             |
| ------------------------ | --------------------------------------------------- |
| Dev server               | `npm run dev`                                       |
| Production build / serve | `npm run build` / `npm start`                       |
| Validate content         | `npm run content:check`                             |
| Lint / typecheck         | `npm run lint` / `npm run typecheck`                |
| Tests                    | `npm test`                                          |
| Format                   | `npm run format` / `npm run format:check`           |
| Lighthouse (mobile)      | `npx @lhci/cli autorun` (uses `.lighthouserc.json`) |

## Layout

```
content/            Markdown + YAML source of truth (projects, articles, social). See CONTRACT in the goal docs.
scripts/            content-check.mjs validator (CI + engine)
engine/             Railway service (separate package)
src/app/            Routes: /, /work, /work/[slug], /writing, /writing/[slug], /demos/portfolio-risk,
                    /about, /book, /privacy, 404, /api/lead, /api/event, /og/*, sitemap, robots,
                    llms.txt, llms-full.txt, feed.xml
src/components/     UI (server components by default; client: Analytics, ThemeToggle, TagFilter, book/*, demo/*)
src/lib/content/    Build-time loader: yaml frontmatter + remark/rehype; only `status: approved` articles render
src/lib/analytics/  Cookieless events (sendBeacon) and first/last-touch attribution in localStorage `ng_attr`
src/lib/lead/       Lead validation + CRM payload
src/lib/demo/       Deterministic synthetic portfolio + risk ranking
src/test/           Vitest setup and content fixtures
```

## Environment (server-only, set in Vercel)

| Var                  | Purpose                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `CRM_API_KEY`        | CRM webhook key. Never exposed to the client.                                                         |
| `CRM_WEBHOOK_URL`    | Optional; defaults to the voice-noob website-leads webhook.                                           |
| `ENGINE_URL`         | Engine base URL. Enables the `/api/event` rewrite and lead forward; unset = `/api/event` returns 204. |
| `SITE_INGEST_SECRET` | Sent as `x-site-secret` when forwarding leads to the engine.                                          |

## Design

Glass system ported from triten-os (`src/app/globals.css`): `light-dark()` tokens, ambient glow
behind the page, glass for floating chrome (header, CTAs, answer box), solid `surface-card` for
content. Light/dark follows the system; the header toggle saves a choice in localStorage `ng_theme`.
Respects reduced motion, reduced transparency and forced colours.
