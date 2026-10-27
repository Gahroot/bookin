// Article/social file building, local pre-push checks and the Codex writer/reviser prompts.
import { completeJson, BRAND } from './llm.js';
import { serializeDoc, parseDoc, slugify, markerIds } from './content.js';
import { confidentialityLint, uncoveredNumbers } from './lint.js';
import { dateStr } from './evidence.js';

export const MAX_EVIDENCE = 12;
const KINDS = new Set(['outcome', 'metric', 'capability', 'time-saved']);
const TYPES = new Set(['case-study', 'article', 'field-note']);

/** DB evidence rows -> article evidence entries (E1..En). Private entries get a generic title and never a URL. */
export function evidenceEntries(rows) {
  return rows.slice(0, MAX_EVIDENCE).map((r, i) => ({
    eid: `E${i + 1}`,
    row: r,
    entry: {
      id: `E${i + 1}`, kind: r.kind,
      title: r.public ? String(r.title || r.ref).slice(0, 160) : `${r.client || 'Client'} private build record (${String(r.kind).replace('github-', '')})`,
      date: dateStr(r.date) || dateStr(r.fetched_at) || dateStr(new Date()),
      public: Boolean(r.public), ref: r.ref, ...(r.public && r.url ? { url: r.url } : {})
    }
  }));
}

export const WRITER_SYSTEM = `${BRAND}
You write one distinctive piece for nolangrout.com about a real accomplishment, backed only by the numbered evidence provided (E1, E2...). Each evidence item shows whether it is public; private details stay private (describe capability, not internals).
Structure: H1 is the title (do not include it in body). Body in Markdown, 700-1200 words, H2/H3 headings phrased as the questions an executive would ask. Flow: the business problem -> what changed -> the outcome -> what it means for the reader's organisation. Concrete, specific, plain English. No tutorials, no code, no generic AI commentary, no buzzword filler, no em-dash chains.
Cite evidence inline with [^E1] markers right after the sentence they support. Every outcome, metric, time saved or capability statement in the body, answer and FAQ must also appear in "claims" with the evidence ids it rests on. Any number in the body must appear verbatim in a claim text. If evidence does not support a number, do not use a number.
Also write a LinkedIn post (hook + 120-220 words, line breaks, ends with an invitation to book a call at nolangrout.com/book) and a YouTube short script (hook + 3-5 beats + CTA). Both may only restate the article's claims.
Return JSON: {"title","type":"case-study|article|field-note","description":"150-160 characters","audience","primary_keyword","secondary_keywords":[...],"answer":"40-60 word direct answer","faq":[{"q","a"}],"hero_alt","cta":"book","claims":[{"text","kind":"outcome|metric|capability|time-saved","evidence":["E1"]}],"body","linkedin":{"hook","body"},"youtube":{"hook","body"}}`;

export function evidencePrompt(entries) {
  return entries.map(({ eid, row }) => `${eid} [${row.public ? 'public' : 'PRIVATE'}; ${row.kind}; ${dateStr(row.date) || ''}; project ${row.project || '-'}]: ${String(row.text).slice(0, 1200)}`).join('\n');
}

export async function writeArticle({ acc, entries, db, env, log, completeImpl = completeJson }) {
  const prompt = `Accomplishment to write about (project ${acc.project}, client ${acc.client || 'n/a'}):\nTitle idea: ${acc.title}\nProblem: ${acc.problem}\nOutcome: ${acc.outcome}\n\nEvidence:\n${evidencePrompt(entries)}`;
  return completeImpl(WRITER_SYSTEM, prompt, { db, env, job: 'draft', log });
}

export async function reviseArticle({ raw, entries, feedback, db, env, log, job = 'draft', completeImpl = completeJson }) {
  const prompt = `Your previous draft failed automated checks. Fix every problem below and return the COMPLETE JSON again in the same shape. Remove or soften any statement the evidence does not directly support; never add new facts.\n\nProblems:\n${feedback.map((f) => `- ${f}`).join('\n')}\n\nEvidence:\n${evidencePrompt(entries)}\n\nPrevious draft JSON:\n${JSON.stringify(raw)}`;
  return completeImpl(WRITER_SYSTEM, prompt, { db, env, job, log });
}

/** Writer JSON -> repo files. Returns { slug, files, data }. */
export function buildFiles(raw, { slug: fixedSlug, entries, project, today, heroImage }) {
  const slug = fixedSlug || slugify(raw.slug || raw.title);
  if (!slug) throw new Error('article has no title');
  const data = {
    title: String(raw.title || '').trim(), slug, type: TYPES.has(raw.type) ? raw.type : 'case-study',
    description: String(raw.description || '').replace(/\s+/g, ' ').trim(), date: today, updated: today, status: 'draft',
    ...(project ? { project } : {}), audience: String(raw.audience || 'Executives and operators').trim(),
    primary_keyword: String(raw.primary_keyword || '').trim(), secondary_keywords: (raw.secondary_keywords || []).map(String).slice(0, 8),
    answer: String(raw.answer || '').replace(/\s+/g, ' ').trim(),
    ...(heroImage ? { hero_image: heroImage, hero_alt: String(raw.hero_alt || 'Abstract navy and blue glass illustration').trim() } : {}),
    faq: (raw.faq || []).filter((f) => f && f.q && f.a).map((f) => ({ q: String(f.q).trim(), a: String(f.a).trim() })).slice(0, 6),
    cta: raw.cta === 'prestyj' ? 'prestyj' : 'book',
    claims: (raw.claims || []).filter((c) => c && c.text).map((c) => ({ text: String(c.text).trim(), kind: KINDS.has(c.kind) ? c.kind : 'outcome', evidence: (c.evidence || []).map(String) })),
    evidence: entries.map((e) => e.entry)
  };
  const social = (k, s) => serializeDoc({ source_article: slug, status: 'draft', hook: String((s && s.hook) || '').trim() }, (s && s.body) || '');
  const files = {
    [`content/articles/${slug}.md`]: serializeDoc(data, raw.body),
    [`content/social/${slug}/linkedin.md`]: social('linkedin', raw.linkedin),
    [`content/social/${slug}/youtube.md`]: social('youtube', raw.youtube)
  };
  return { slug, files, data };
}

const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;

/** Everything checked locally before any push. Returns issues (empty = clean). */
export function localCheck(files, evidenceRows, { allow = [] } = {}) {
  const issues = confidentialityLint(files, { evidence: evidenceRows, allow });
  for (const [file, text] of Object.entries(files)) {
    if (!/^content\/articles\//.test(file)) continue;
    let doc; try { doc = parseDoc(text); } catch (e) { issues.push(`${file}: ${e.message}`); continue; }
    const { data, body } = doc;
    if (!data.title) issues.push(`${file}: missing title`);
    const dl = String(data.description || '').length;
    if (dl < 150 || dl > 160) issues.push(`${file}: description is ${dl} characters (must be 150-160)`);
    const aw = words(data.answer);
    if (aw < 40 || aw > 60) issues.push(`${file}: answer is ${aw} words (must be 40-60)`);
    if (!(data.claims || []).length) issues.push(`${file}: no claims listed`);
    for (const c of data.claims || []) if (!(c.evidence || []).length) issues.push(`${file}: claim without evidence: "${c.text.slice(0, 80)}"`);
    if (!markerIds(body).length) issues.push(`${file}: body has no [^E#] evidence markers`);
    if (words(body) < 300) issues.push(`${file}: body too short`);
    for (const n of uncoveredNumbers(data, `${body}\n${data.answer || ''}\n${(data.faq || []).map((f) => f.a).join('\n')}`)) issues.push(`${file}: number "${n}" not covered by any claim text`);
    // Social copy must stay within the article's claims (numbers especially).
    for (const [sf, st] of Object.entries(files)) {
      if (!sf.startsWith(`content/social/${data.slug}/`)) continue;
      try { const s = parseDoc(st); for (const n of uncoveredNumbers(data, `${s.data.hook || ''}\n${s.body}`)) issues.push(`${sf}: number "${n}" not covered by an article claim`); if (words(s.body) < 30) issues.push(`${sf}: body too short`); }
      catch (e) { issues.push(`${sf}: ${e.message}`); }
    }
  }
  return [...new Set(issues)];
}

/** Reconstructs writer JSON from repo files (for gate self-revision). */
export function rawFromFiles(files, slug) {
  const a = parseDoc(files[`content/articles/${slug}.md`]);
  const s = (k) => { const t = files[`content/social/${slug}/${k}.md`]; if (!t) return null; const d = parseDoc(t); return { hook: d.data.hook || '', body: d.body }; };
  return { ...a.data, body: a.body, linkedin: s('linkedin'), youtube: s('youtube') };
}
