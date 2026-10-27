// Postgres access + schema migrations (run on boot, idempotent, append-only list).
import pg from 'pg';

export const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS events (
    day DATE NOT NULL, type TEXT NOT NULL, path TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT '', utm_source TEXT NOT NULL DEFAULT '', utm_medium TEXT NOT NULL DEFAULT '',
    utm_campaign TEXT NOT NULL DEFAULT '', referrer_host TEXT NOT NULL DEFAULT '',
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, type, path, source, utm_source, utm_medium, utm_campaign, referrer_host)
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT, last_name TEXT, phone TEXT, company_name TEXT,
    business_type TEXT, revenue TEXT, project_type TEXT, timeline TEXT, budget TEXT, project_details TEXT,
    qualified BOOLEAN NOT NULL DEFAULT false, qualify_reason TEXT,
    page TEXT, first_touch JSONB, last_touch JSONB,
    first_source TEXT, first_page TEXT,
    submissions INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS job_runs (
    id SERIAL PRIMARY KEY, job TEXT NOT NULL, slot TIMESTAMPTZ NOT NULL, status TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0, started_at TIMESTAMPTZ NOT NULL DEFAULT now(), finished_at TIMESTAMPTZ,
    error TEXT, result JSONB
  )`,
  `CREATE INDEX IF NOT EXISTS job_runs_job_slot ON job_runs (job, slot)`,
  `CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL, kind TEXT NOT NULL, project TEXT, client TEXT,
    title TEXT, text TEXT NOT NULL, date DATE, ref TEXT NOT NULL, url TEXT,
    public BOOLEAN NOT NULL DEFAULT false,
    discovered_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS source_state (source_id TEXT PRIMARY KEY, last_success TIMESTAMPTZ, last_error TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS accomplishments (
    id SERIAL PRIMARY KEY,
    fingerprint TEXT NOT NULL UNIQUE,
    project TEXT, client TEXT, title TEXT NOT NULL, problem TEXT, outcome TEXT,
    evidence_ids JSONB NOT NULL, score REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open', status_reason TEXT, article_slug TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS articles (
    slug TEXT PRIMARY KEY, accomplishment_id INTEGER, title TEXT, kind TEXT NOT NULL DEFAULT 'article',
    status TEXT NOT NULL DEFAULT 'pending', status_reason TEXT,
    files JSONB, evidence_map JSONB,
    pr_number INTEGER, pr_url TEXT, branch TEXT,
    audited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS gate_results (
    id SERIAL PRIMARY KEY, pr_number INTEGER NOT NULL, slugs TEXT, head_sha TEXT, outcome TEXT NOT NULL,
    checks JSONB, verdicts JSONB, detail TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS ai_usage (
    id SERIAL PRIMARY KEY, month TEXT NOT NULL, job TEXT NOT NULL, provider TEXT NOT NULL, model TEXT,
    input_tokens INTEGER NOT NULL DEFAULT 0, output_tokens INTEGER NOT NULL DEFAULT 0, cache_read_tokens INTEGER NOT NULL DEFAULT 0,
    usd DOUBLE PRECISION NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS codex_state (key TEXT PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS reports (id SERIAL PRIMARY KEY, week_of DATE NOT NULL, body TEXT NOT NULL, issue_url TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS monitor_snapshots (id SERIAL PRIMARY KEY, day DATE NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS metrics_daily (
    day DATE NOT NULL, provider TEXT NOT NULL, page TEXT NOT NULL DEFAULT '', query TEXT NOT NULL DEFAULT '',
    clicks INTEGER NOT NULL DEFAULT 0, impressions INTEGER NOT NULL DEFAULT 0, ctr REAL, position REAL,
    PRIMARY KEY (day, provider, page, query)
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_outcomes (project TEXT NOT NULL, accomplishment_id INTEGER NOT NULL, pr_number INTEGER, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY (project, accomplishment_id))`,
  `CREATE TABLE IF NOT EXISTS claim_audits (id SERIAL PRIMARY KEY, slug TEXT NOT NULL, ok BOOLEAN NOT NULL, detail TEXT, checked_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  // Quality bar v2: executive-relevance score 1-10 + rationale; editor scores per gate run.
  `ALTER TABLE accomplishments ADD COLUMN IF NOT EXISTS exec_score REAL`,
  `ALTER TABLE accomplishments ADD COLUMN IF NOT EXISTS score_rationale TEXT`,
  `ALTER TABLE gate_results ADD COLUMN IF NOT EXISTS editor JSONB`,
  // One-time: re-cluster all evidence under the new rubric (old open accomplishments had no exec_score).
  `DELETE FROM accomplishments WHERE status = 'open' AND exec_score IS NULL`,
  `UPDATE evidence SET discovered_at = NULL`
];

export async function migrate(db) {
  await db.query(MIGRATIONS[0]);
  const { rows } = await db.query('SELECT version FROM schema_migrations');
  const done = new Set(rows.map((r) => Number(r.version)));
  for (let i = 1; i < MIGRATIONS.length; i++) {
    if (done.has(i)) continue;
    await db.query(MIGRATIONS[i]);
    await db.query('INSERT INTO schema_migrations (version) VALUES ($1)', [i]);
  }
}

export function createPool(url = process.env.DATABASE_URL) {
  if (!url) throw new Error('DATABASE_URL is not set');
  const local = /localhost|127\.0\.0\.1|\.railway\.internal/.test(url);
  return new pg.Pool({ connectionString: url, max: 5, ssl: local ? false : { rejectUnauthorized: false } });
}

export const todayNY = (now = new Date()) => now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

export async function recordUsage(db, u, { now = new Date() } = {}) {
  if (!db) return;
  await db.query('INSERT INTO ai_usage (month, job, provider, model, input_tokens, output_tokens, cache_read_tokens, usd) VALUES ($1,$2,$3,$4,$5,$6,$7,0)',
    [todayNY(now).slice(0, 7), u.job || 'unknown', u.provider, u.model || '', u.inputTokens || 0, u.outputTokens || 0, u.cacheReadTokens || 0]);
}
