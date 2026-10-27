// Pluggable source adapters: every other file in this directory exporting { kind, collect } is an adapter.
// Adding a source = a new adapter file + an entry in config/sources.json; nothing else changes.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const CONFIG_PATH = path.join(here, '../../config/sources.json');

export async function loadAdapters(dir = here) {
  const out = {};
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.js') && !['index.js', 'http.js'].includes(f)).sort()) {
    const m = await import(path.join(dir, f));
    if (m.kind && typeof m.collect === 'function') out[m.kind] = m;
  }
  return out;
}

export async function loadSources(file = CONFIG_PATH) {
  const j = JSON.parse(await readFile(file, 'utf8'));
  return (j.sources || []).filter((s) => s && s.id && s.kind && s.enabled !== false);
}

export const projectsFromConfig = (sources) => {
  const out = {};
  for (const s of sources) if (s.project) out[s.project] = s.client || null;
  for (const s of sources) for (const [p, c] of Object.entries(s.clients || {})) out[p] = out[p] || c;
  return out;
};
