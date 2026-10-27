# nolangrout.com engine

Node 24 service on Railway: project `nolangrout-engine`, services `engine` + `Postgres`, volume `engine-volume` at `/data`.
Public URL: https://engine-production-fcb3.up.railway.app. Adapted from the back2sleep engine (`/Users/groot/mom317/engine`).

It does two jobs:
- **API** (`src/api.js`): `GET /api/health`, `POST /api/event` (cookieless, no IP stored), `POST /api/lead` (header `x-site-secret`), admin endpoints.
- **Scheduler** (`src/scheduler.js`, jobs in `src/jobs.js`): builds the portfolio and writing from real evidence and publishes it **fully automatically** (owner's choice) through a gate.

## Jobs (America/New_York)

| Job | When | What it does |
|---|---|---|
| ingest | daily 2:00 | Runs every source adapter in `config/sources.json` and stores new items in `evidence` (deduped on stable ids) |
| discover | daily 3:00 | Codex groups new evidence into `accomplishments` (problem, supported outcome, evidence ids, project, executive-interest score). Deduped by evidence fingerprint and title Jaccard (≥0.6) against existing accomplishments and `content/articles` |
| draft | Mon + Thu 4:00 | Top open accomplishment → `content/articles/<slug>.md`, `content/social/<slug>/{linkedin,youtube}.md`, hero image `public/images/articles/<slug>.webp` (gpt-image-2, 1600x900). Local confidentiality lint first (self-revised up to 2 rounds, else **dropped, never pushed**), then `scripts/content-check.mjs` in a checkout, and only then branch `engine/<slug>` + PR + gate |
| gate | hourly | Open `engine/*` PRs: confidentiality lint, content-check (with `status: approved`), a fresh, independent Codex fact-check of every claim against the stored evidence text (only all-`supported` passes), then CI green → squash-merge. Fail → self-revise up to 3 rounds (each revision lint-checked locally before pushing), else label `needs-review` + issue assigned to the owner. Nothing failing is merged |
| portfolio | Sun 5:00 | Bumps `updated` in `content/projects/<slug>.md` for projects with new evidence and adds outcomes from published accomplishments. Same lint → content-check → PR → gate path |
| monitor | daily 6:00 | Events + leads by first-touch source; GSC/Bing only if their credentials are set (else noted `skipped`) |
| report | Mon 8:00 | Weekly issue `weekly-report`: leads and qualified leads by source/page, published/held content, drafts not pushed, job health |
| audit | Sat 4:00 | Re-fact-checks up to 2 published articles not audited in 30 days (`AUDIT_EVERY_DAYS`, `AUDIT_MAX_PER_RUN`); failure → `needs-review` issue |
| codex_keepalive | Sat 6:00 | One tiny `codex exec` so the login refreshes in quiet weeks |

Every run is written to `job_runs`. A failed run is retried 3 times with backoff and then opens or updates an `engine-alert` issue. Missed slots are caught up on boot (up to 8 days back), and a lock stops runs overlapping. A job whose prerequisites are missing is recorded as `skipped` with the reason. When Codex is unavailable the job is recorded as `deferred` and retried hourly, with no alert.

## Codex-only AI

All text runs through `codex exec` on the owner's ChatGPT subscription (`CODEX_MODEL=gpt-6.1-sol`, `CODEX_REASONING_EFFORT=high`, `LLM_PROVIDER_ORDER=codex`). There is no paid fallback. Images use the same subscription through the Codex gpt-image-2 endpoint (`src/image.js`). Login lives in `$CODEX_HOME/auth.json` (`/data/codex`). The engine only reads `auth_mode` and `last_refresh` from it and never prints or copies it. Usage limit → 24 h back-off; weekly cap `CODEX_MAX_CALLS_PER_WEEK` (default 80); per-call timeout `CODEX_TIMEOUT_MS` (default 25 min). The fact-checker is a separate fresh Codex session with its own skeptical prompt, but the same model family as the writer.

## Confidentiality (Gahroot/bookin is public)

`src/lint.js` runs before any push and again in the gate. It checks:
- the contract's secret patterns and internal hosts;
- email addresses, fenced or indented code, and file paths;
- dollar figures not present in a public evidence item;
- capitalised names that appear only in private evidence;
- URLs that are neither public evidence nor approved public sites;
- unresolved markers, and private evidence that has a URL or a repo path.

Source adapters store commit messages, PR titles/bodies, releases and README summaries only (never file contents), redacted. Private evidence gets opaque refs (`repo@sha`, `repo#pr-N`, `wl-…`) and no URL. The writer prompt forbids presenting worklog `activeMinutes`/sessions as hours Nolan worked (they include unattended agent runs).

## Lead qualification (`src/qualify.js`)

`qualified = true` when **all** of these hold:
- budget lower bound ≥ $5,000;
- revenue lower bound ≥ $100,000;
- timeline is not "exploring";
- a project type is set. `consulting` additionally needs budget ≥ $10,000.

Unknown or "not sure" values fail their rule. Leads are deduped by email: a repeat submission updates the row, keeps first-touch attribution and increments `submissions`. PII is never logged.

## Variables

Set from `engine/` with `railway variables --service engine --set "NAME=value"`.

| Name | Set? | Notes |
|---|---|---|
| DATABASE_URL | yes | `${{Postgres.DATABASE_URL}}` |
| ADMIN_TOKEN | yes | random; copy in `~/.ezcoder/goals/personal-site/.secrets/admin_token` |
| SITE_INGEST_SECRET | yes | random; copy in `.secrets/site_ingest_secret`. **Set the same value on the Vercel site** with `ENGINE_URL=https://engine-production-fcb3.up.railway.app` |
| SITE_URL, GITHUB_REPO, TZ | yes | `https://nolangrout.com`, `Gahroot/bookin`, `America/New_York` |
| CODEX_HOME, LLM_PROVIDER_ORDER, CODEX_MODEL, CODEX_REASONING_EFFORT | yes | `/data/codex`, `codex`, `gpt-6.1-sol`, `high` |
| AUTO_PUBLISH | yes | `true`. `false` = the gate does nothing; engine PRs wait for a human |
| GITHUB_TOKEN | **owner** | see below |
| GITHUB_TOKEN_BMIG | optional | token for `Black-Mountain-Investment-Group/black-mountain-fund` if `GITHUB_TOKEN` can't read that org |
| GITHUB_BASE_BRANCH | optional | default `master` |
| GATE_MAX_REVISIONS, GATE_CI_TIMEOUT_MS, GATE_CI_POLL_MS | optional | 3, 20 min, 30 s |
| CODEX_MAX_CALLS_PER_WEEK, CODEX_TIMEOUT_MS | optional | 80, 25 min |
| GSC_SERVICE_ACCOUNT_JSON, GSC_SITE_URL, BING_API_KEY | optional | monitor; skipped when unset |
| GIT_AUTHOR_NAME / GIT_AUTHOR_EMAIL | optional | commit identity |
| SCHEDULER | optional | `off` = API only |

### GitHub token (owner action)

Create a **fine-grained personal access token** (resource owner `Gahroot`) with these repositories and permissions:

- **Gahroot/bookin**:
  - Contents: Read and write (push `engine/*` branches, squash-merge, delete branches)
  - Pull requests: Read and write
  - Issues: Read and write (alerts, `needs-review`, weekly report, labels)
  - Commit statuses: Read-only, and Checks: Read-only, if offered (the gate reads check-runs to wait for CI)
  - Metadata: Read (automatic)
- **Read-only** (Contents: Read, Metadata: Read): Gahroot/triten-os, Gahroot/easefolio, Gahroot/amg-portal, Gahroot/mom317, Gahroot/Prestyj-website, Gahroot/ezcoder, Gahroot/dave, Gahroot/nolan-worklog. Pull requests: Read is also needed on these to collect merged PR titles/bodies.
- **Black-Mountain-Investment-Group/black-mountain-fund** belongs to another org. Either a second fine-grained token with resource owner that org (Contents + Pull requests: Read) set as `GITHUB_TOKEN_BMIG`, or the org must approve the main token. Until then that source logs `error` in ingest and the others continue.

`railway variables --service engine --set "GITHUB_TOKEN=github_pat_…"`

Also: if `master` has branch protection requiring reviews, the engine can't merge. Allow the token owner to bypass, or require status checks only.

### Codex login (owner action, one time)

```bash
cd /Users/groot/bookin/engine
railway ssh --service engine
codex login --device-auth      # open the URL, enter the code (ChatGPT settings → Security may need "device code login" enabled)
```
A separate server login; never copy `~/.codex/auth.json` from the Mac. Afterwards `/api/admin/status` shows `codex.loggedIn: true`. If the login goes stale, the engine opens one `engine-alert` issue "Codex login needs renewing" and AI jobs defer until you log in again.

## Run by hand

```bash
T=$(cat ~/.ezcoder/goals/personal-site/.secrets/admin_token)
U=https://engine-production-fcb3.up.railway.app
curl -H "Authorization: Bearer $T" $U/api/admin/status
curl -X POST -H "Authorization: Bearer $T" $U/api/admin/run/ingest   # any job name above
```

## Develop and deploy

```bash
cd engine && npm ci && npm test     # offline: pg-mem, mocked GitHub/Codex, real scripts/content-check.mjs
railway up --service engine --ci     # deploy from engine/
railway logs --service engine
```

## Add a source

1. Create `src/sources/<kind>.js` exporting `kind` and `async collect({ since, config, env, fetchImpl })`. It returns evidence items `{ id (stable), source_id: config.id, kind, project, client, title, text, date, ref, url, public }` and throws `{ skip: true }` when not configured.
2. Add `{ "id": "...", "kind": "<kind>", ... }` to `config/sources.json`.

Nothing else changes: adapters are loaded from the directory.

## Recovery

- **Job failing**: read its `engine-alert` issue or `/api/admin/status`, fix the cause (token, login), then re-run with `/api/admin/run/<job>`. Missed slots catch up on the next boot.
- **Held PR**: fix the branch (the gate re-runs after a new commit) or close it.
- **Service down**: Railway restarts it on failure (10 tries) and health-checks `/api/health`. Use `railway logs`, then `railway redeploy` if needed.
- **Data**: leads/evidence are in Railway Postgres (backed up by Railway). For ad-hoc SQL, `railway ssh --service engine` and use `node` with `pg` from `/app` (the DB isn't publicly exposed).
