// Contract section 1 content files: Markdown + YAML frontmatter (parsed with `yaml`).
import YAML from 'yaml';

export const AUTO_APPROVER = 'auto-review (nolangrout engine)';

export function parseDoc(text) {
  const m = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter');
  const data = YAML.parse(m[1]) || {};
  // YAML turns bare dates into strings with the default schema in yaml v2 (core), keep them as strings.
  return { data, body: m[2].replace(/^\r?\n/, '') };
}

export function serializeDoc(data, body) {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  return `---\n${YAML.stringify(clean, { lineWidth: 0 }).trimEnd()}\n---\n\n${String(body || '').trim()}\n`;
}

export const slugify = (s) => String(s ?? '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

export function setApproved(text, date) {
  const { data, body } = parseDoc(text);
  return serializeDoc({ ...data, status: 'approved', approved_by: AUTO_APPROVER, updated: date }, body);
}

export function setDraft(text) {
  const { data, body } = parseDoc(text);
  const { approved_by: _a, ...rest } = data;
  return serializeDoc({ ...rest, status: 'draft' }, body);
}

export const markerIds = (body) => [...new Set([...String(body).matchAll(/\[\^([A-Za-z0-9_-]+)\]/g)].map((m) => m[1]))];

const STOP = new Set('a an the and or of to for in on at with by from is are was were be been it its this that how why what when we our i my you your as into over about after before without'.split(' '));
export function terms(text) {
  const out = new Set();
  for (let w of String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)) {
    if (!w || STOP.has(w)) continue;
    if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
    else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
    out.add(w);
  }
  return out;
}
export function jaccard(a, b) {
  const x = terms(a), y = terms(b);
  if (!x.size || !y.size) return 0;
  let inter = 0;
  for (const w of x) if (y.has(w)) inter++;
  return inter / (x.size + y.size - inter);
}
