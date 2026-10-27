// Local confidentiality / secret lint. Gahroot/bookin is PUBLIC, so every engine draft must pass this BEFORE any
// branch is pushed (and again in the gate). Patterns = CONTRACT section 2 + engine-only rules:
// no private repo file paths, no code blocks, no client internal data (dollar figures, asset/people names) unless
// the detail appears in a PUBLIC evidence item, no URLs other than public evidence URLs / approved public sites.
import { parseDoc, markerIds } from './content.js';

export const SECRET_PATTERNS = [
  ['GitHub token', /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{10,}/],
  ['GitHub fine-grained token', /github_pat_[A-Za-z0-9_]{10,}/],
  ['API key (sk-)', /\bsk-(ant-)?[A-Za-z0-9_-]{10,}/],
  ['Resend key', /\bre_[A-Za-z0-9_]{16,}/],
  ['Cal.com key', /\bcal_live_[A-Za-z0-9]{8,}/],
  ['AWS key', /\bAKIA[0-9A-Z]{12,}/],
  ['private key', /-----BEGIN [A-Z ]*-----/],
  ['bearer token', /\bBearer\s+[A-Za-z0-9._~+/-]{12,}/],
  ['api_key=', /api[_-]?key\s*[=:]\s*\S+/i],
  ['password=', /password\s*[=:]\s*\S+/i],
  ['JWT', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/],
  ['long hex token', /\b(?=[a-f0-9]*\d)(?=[a-f0-9]*[a-f])[a-f0-9]{32,}\b/i],
  ['long base64 token', /(?<![A-Za-z0-9+/_-])(?=[A-Za-z0-9+/]*\d)(?=[A-Za-z0-9+/]*[a-z])(?=[A-Za-z0-9+/]*[A-Z])[A-Za-z0-9+/]{32,}={0,2}(?![A-Za-z0-9+/_-])/] // same as scripts/content-check.mjs
];
export const INTERNAL_HOSTS = [
  ['railway internal host', /\b[a-z0-9.-]+\.railway\.internal\b/i],
  ['localhost URL', /\bhttps?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i],
  ['private IP', /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/],
  ['email address', /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/]
];
// Paths like src/lib/foo.ts, apps/api/routes.py, .env.local, supabase/migrations/...
const FILE_PATH = /(?:^|[\s`'"(])((?:[\w.-]+\/)+[\w.-]+\.(?:ts|tsx|js|jsx|mjs|cjs|py|go|rs|sql|json|ya?ml|toml|env|sh|prisma|rb|java|kt|swift|css|html|md))\b|(?:^|[\s`'"(])(\.env(?:\.[\w]+)?)\b/m;
const MONEY = /(?:\$|USD\s?)\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|mm|bn|b|million|billion|thousand)?\b|\b\d[\d,.]*\s?(?:million|billion)\b/gi;
const PUBLIC_SITES = ['nolangrout.com', 'tritenre.com', 'easefolio.com', 'anchormillgroup.com', 'back2sleepnow.com', 'prestyj.com', 'cal.com', 'github.com/Gahroot/mom317', 'github.com/Gahroot/Prestyj-website', 'github.com/Gahroot/ezcoder', 'github.com/Gahroot/dave'];
const DEFAULT_ALLOW = new Set(('Nolan Grout Triten OS Easefolio Black Mountain Fund Anchor Mill Group Back2SleepNow Prestyj EZ Coder ChatGPT OpenAI Codex Claude Anthropic GPT AI MCP API APIs CRM Postgres PostgreSQL TypeScript JavaScript Python Next.js React Node Railway Vercel GitHub Google Microsoft Excel Slack Gmail Outlook Zapier Cal.com LinkedIn YouTube SEO AEO LLM LLMs SQL CEO COO CFO CTO FAQ PDF SMS Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May June July August September October November December Q1 Q2 Q3 Q4 US USA New York I The A An In On For With What Why How When Where Who Which This That These Those It Our We My You Your Before After Then Now Today Most Every Each One Two Three Four Five Six Seven Eight Nine Ten No Not Yes If But And Or So As At By From Into Over Under Instead Here There Once Fund Group Mill Mountain Black Anchor').split(/\s+/));

const visibleText = (data, body) => [data.title, data.description, data.answer, data.hero_alt, data.summary, data.problem, data.role, data.hook,
  ...(data.faq || []).flatMap((f) => [f && f.q, f && f.a]), ...(data.claims || []).map((c) => c && c.text), ...(data.outcomes || []).map((o) => o && o.text), body].filter(Boolean).join('\n');

/**
 * files: { 'content/articles/x.md': text, ... }
 * evidence: DB evidence rows referenced by the files ({ text, public, url, title }).
 * Returns a list of human-readable issues (empty = clean).
 */
export function confidentialityLint(files, { evidence = [], allow = [] } = {}) {
  const issues = [];
  const publicText = evidence.filter((e) => e.public).map((e) => `${e.title || ''}\n${e.text || ''}`).join('\n');
  const privateText = evidence.filter((e) => !e.public).map((e) => `${e.title || ''}\n${e.text || ''}`).join('\n');
  const publicUrls = evidence.filter((e) => e.public && e.url).map((e) => e.url);
  const allowSet = new Set([...DEFAULT_ALLOW, ...allow]);
  for (const [file, raw] of Object.entries(files)) {
    const add = (why) => issues.push(`${file}: ${why}`);
    for (const [name, re] of [...SECRET_PATTERNS, ...INTERNAL_HOSTS]) {
      const m = (name.startsWith('long ') ? raw.replace(/https?:\/\/[^\s)\]>"']+/g, ' ') : raw).match(re); // URLs/paths aren't tokens
      if (m && !(name === 'email address' && /@nolangrout\.com$/i.test(m[0]))) add(`${name} pattern found`);
    }
    let data = {}, body = raw;
    try { ({ data, body } = parseDoc(raw)); } catch { add('no frontmatter'); }
    if (/```|~~~/.test(body)) add('fenced code block (not allowed in engine content)');
    if (/^( {4}|\t)\S/m.test(body.replace(/^\s*[-*\d].*$/gm, ''))) add('indented code block');
    const text = visibleText(data, body);
    const fp = text.match(FILE_PATH);
    if (fp) add(`file path "${(fp[1] || fp[2]).slice(0, 80)}"`);
    for (const m of text.matchAll(MONEY)) {
      if (!publicText.includes(m[0].trim())) add(`dollar figure "${m[0].trim()}" not in any public evidence item`);
    }
    for (const m of text.matchAll(/https?:\/\/[^\s)\]>"']+/g)) {
      const u = m[0].replace(/[.,;]+$/, '');
      if (!publicUrls.includes(u) && !PUBLIC_SITES.some((s) => u.replace(/^https?:\/\/(www\.)?/, '').startsWith(s))) add(`URL not public evidence: ${u}`);
    }
    // Names (assets, people, internal systems) that only appear in PRIVATE evidence must not be published.
    const seen = new Set();
    for (const m of text.matchAll(/\b([A-Z][a-zA-Z0-9&'-]{2,}(?:[ \t]+[A-Z][a-zA-Z0-9&'-]+)*)/g)) {
      const name = m[1];
      const words = name.split(/\s+/);
      const before = text.slice(Math.max(0, m.index - 3), m.index);
      if (words.length === 1 && (m.index === 0 || /([.!?:]\s+|\n\s*|[#>*-]\s+|"|\(|\[)$/.test(before))) continue; // sentence-initial word
      if (words.length === 1 && new RegExp(`\\b${name.toLowerCase()}\\b`).test(text)) continue; // ordinary word, also used lowercase
      if (seen.has(name)) continue;
      seen.add(name);
      if (words.every((w) => allowSet.has(w))) continue;
      if (privateText.includes(name) && !publicText.includes(name)) add(`name "${name}" appears only in private evidence`);
    }
    // Structure: every marker resolves, every claim cites existing evidence, private evidence never linked.
    if (Array.isArray(data.evidence)) {
      const ids = new Set(data.evidence.map((e) => e && String(e.id)));
      for (const id of markerIds(body)) if (!ids.has(id)) add(`marker [^${id}] has no evidence entry`);
      for (const c of [...(data.claims || []), ...(data.outcomes || [])]) for (const id of (c && c.evidence) || []) if (!ids.has(String(id))) add(`claim cites missing evidence ${id}`);
      for (const e of data.evidence) {
        if (e && e.public === false && e.url) add(`private evidence ${e.id} has a url`);
        if (e && e.public === false && /\//.test(String(e.ref || '')) && !/^wl-/.test(String(e.ref))) add(`private evidence ${e.id} ref exposes a repo path`);
      }
    }
  }
  return [...new Set(issues)];
}

/** Numbers in the body must appear in some claim text (contract section 2 heuristic, mirrored locally). */
export function uncoveredNumbers(data, body) {
  const claimText = [...(data.claims || []), ...(data.outcomes || [])].map((c) => (c && c.text) || '').join(' ');
  const out = [];
  const plain = String(body).replace(/\[\^[^\]]+\]/g, '').replace(/^\s*\d+\.\s/gm, '').replace(/\b(19|20)\d{2}(-\d{2}(-\d{2})?)?\b/g, '');
  for (const m of plain.matchAll(/\$?\d[\d,.]*%?(\s?(hours?|minutes?|days?|weeks?|x))?/gi)) {
    const n = m[0].trim().replace(/[.,]$/, '');
    const core = n.match(/\d[\d,.]*/)[0].replace(/[.,]$/, '');
    if (!claimText.includes(core)) out.push(n);
  }
  return [...new Set(out)];
}
