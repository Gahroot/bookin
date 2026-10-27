// Source adapter: nightly worklog reports from the private repo Gahroot/nolan-worklog (CONTRACT section 5).
// Reads reports/YYYY/YYYY-MM-DD.json; item ids are stable, so ingest dedupes on them. Always private evidence.
import { ghGet, redact, tokenFor } from './http.js';

export const kind = 'worklog';
const ITEM_KINDS = new Set(['request', 'outcome', 'goal-done', 'check', 'commit']);

export function itemsFromReport(report, config) {
  const out = [];
  if (!report || !Array.isArray(report.projects)) return out;
  const map = config.projectMap || {};
  for (const p of report.projects) {
    const project = map[p.project] || p.project || null;
    const client = (config.clients || {})[project] || p.client || null;
    const base = { source_id: config.id, kind: 'worklog', project, client, public: false, url: null, date: report.date || null };
    for (const it of p.items || []) {
      if (!it || typeof it.id !== 'string' || !/^wl-[\w-]+$/.test(it.id) || !ITEM_KINDS.has(it.kind)) continue;
      const text = redact(it.text).slice(0, 600);
      if (!text) continue;
      out.push({ ...base, id: it.id, title: `Worklog ${it.kind} (${report.date})`, text, ref: it.id, date: String(it.ts || report.date || '').slice(0, 10) || null });
    }
    for (const g of p.goals || []) {
      (g.done || []).forEach((d, i) => {
        const text = redact(d).slice(0, 600);
        if (!text || !g.id) return;
        const id = `wl-${report.date}-${String(g.id).replace(/[^\w-]/g, '')}-done-${i + 1}`;
        out.push({ ...base, id, title: `Goal completed: ${redact(g.name).slice(0, 120)}`, text, ref: id });
      });
    }
  }
  return out;
}

export async function collect({ since, config, env = process.env, fetchImpl = globalThis.fetch }) {
  const token = tokenFor(config, env);
  if (!token) throw Object.assign(new Error(`no token (${config.tokenEnv || 'GITHUB_TOKEN'})`), { skip: true });
  const o = { token, fetchImpl };
  const dir = config.dir || 'reports';
  const from = (since ? new Date(new Date(since).getTime() - 2 * 86_400_000) : new Date(Date.now() - 60 * 86_400_000)).toISOString().slice(0, 10);
  const items = [];
  const thisYear = new Date().getUTCFullYear();
  for (let y = Number(from.slice(0, 4)); y <= thisYear; y++) {
    const files = await ghGet(`/repos/${config.repo}/contents/${dir}/${y}`, { ...o, allow404: true });
    for (const f of (Array.isArray(files) ? files : []).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f.name) && f.name.slice(0, 10) >= from).sort((a, b) => a.name.localeCompare(b.name))) {
      const text = await ghGet(`/repos/${config.repo}/contents/${dir}/${y}/${f.name}`, { ...o, raw: true });
      let report; try { report = JSON.parse(text); } catch { continue; }
      items.push(...itemsFromReport(report, config));
    }
  }
  return items;
}
