// Daily: run every configured source adapter and store new evidence (deduped on stable ids).
import { loadAdapters, loadSources } from '../sources/index.js';
import { insertEvidence } from '../evidence.js';

export async function run({ db, env = process.env, log = console, deps = {} }) {
  const adapters = deps.adapters || (await loadAdapters());
  const sources = deps.sources || (await loadSources());
  const results = {};
  const errors = [];
  let ran = 0;
  for (const s of sources) {
    const adapter = adapters[s.kind];
    if (!adapter) { results[s.id] = `skipped: no adapter for kind "${s.kind}"`; continue; }
    const st = (await db.query('SELECT last_success FROM source_state WHERE source_id = $1', [s.id])).rows[0];
    try {
      const items = await adapter.collect({ since: st && st.last_success, config: s, env, fetchImpl: deps.fetchImpl });
      const added = await insertEvidence(db, items);
      ran++;
      results[s.id] = { fetched: items.length, added };
      await db.query(`INSERT INTO source_state (source_id, last_success, last_error, updated_at) VALUES ($1, now(), NULL, now())
        ON CONFLICT (source_id) DO UPDATE SET last_success = now(), last_error = NULL, updated_at = now()`, [s.id]);
    } catch (e) {
      const msg = String(e.message).slice(0, 300);
      results[s.id] = `${e.skip ? 'skipped' : 'error'}: ${msg}`;
      if (!e.skip) errors.push(`${s.id}: ${msg}`);
      await db.query(`INSERT INTO source_state (source_id, last_error, updated_at) VALUES ($1, $2, now())
        ON CONFLICT (source_id) DO UPDATE SET last_error = $2, updated_at = now()`, [s.id, msg]);
      log.error(`[ingest] ${s.id}: ${msg}`);
    }
  }
  if (!ran && !errors.length) return { skipped: 'no source could run (not configured: GITHUB_TOKEN)', results };
  if (!ran && errors.length) throw new Error(errors.join(' | '));
  return { sources: ran, results, ...(errors.length ? { errors } : {}) };
}
