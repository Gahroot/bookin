// Evidence store helpers (table `evidence`, stable ids from the source adapters).
const inList = (n, from = 1) => Array.from({ length: n }, (_, i) => `$${i + from}`).join(',');

export async function insertEvidence(db, items) {
  let added = 0;
  for (const it of items) {
    if (!it || !it.id || !it.text || !it.ref) continue;
    if ((await db.query('SELECT 1 FROM evidence WHERE id = $1', [it.id])).rows.length) continue; // stable ids: dedupe
    const r = await db.query(`INSERT INTO evidence (id, source_id, kind, project, client, title, text, date, ref, url, public)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING RETURNING id`,
    [it.id, it.source_id, it.kind, it.project || null, it.client || null, it.title || null, it.text, it.date || null, it.ref, it.public ? it.url || null : null, Boolean(it.public)]);
    added += r.rows.length;
  }
  return added;
}

export async function evidenceByIds(db, ids) {
  if (!ids.length) return [];
  const rows = (await db.query(`SELECT * FROM evidence WHERE id IN (${inList(ids.length)})`, ids)).rows;
  return ids.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
}

export async function evidenceByRefs(db, refs) {
  if (!refs.length) return [];
  return (await db.query(`SELECT * FROM evidence WHERE ref IN (${inList(refs.length)})`, refs)).rows;
}

export const dateStr = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d ? String(d).slice(0, 10) : null);
