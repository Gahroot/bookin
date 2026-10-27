// HTTP API per CONTRACT section 3 + 4, plus admin endpoints. Never logs PII, IPs or secrets.
import crypto from 'node:crypto';
import { codexStatus as defaultCodexStatus } from './codex.js';
import { qualify } from './qualify.js';
import { todayNY } from './db.js';

const ALLOWED_ORIGINS = [
  /^https:\/\/nolangrout\.com$/,
  /^https:\/\/www\.nolangrout\.com$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^http:\/\/localhost:3000$/
];
export const isAllowedOrigin = (o) => typeof o === 'string' && ALLOWED_ORIGINS.some((r) => r.test(o));
export const EVENT_TYPES = new Set(['pageview', 'cta_view', 'cta_click', 'form_start', 'form_submit', 'demo_run', 'outbound_prestyj']);
const EMAIL_RE = /^[^\s@<>()[\],;:"]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const short = (v, max = 120) => str(v, max).replace(/[^\w:./@+-]/g, '');
const cleanPath = (v) => str(v, 300).replace(/[?#].*$/, '');
const hostOf = (v) => { try { return v ? new URL(String(v)).hostname.slice(0, 120) : ''; } catch { return ''; } };

export function validateEvent(body) {
  if (!body || typeof body !== 'object') return { error: 'invalid_body' };
  if (!EVENT_TYPES.has(body.type)) return { error: 'invalid_type' };
  const path = cleanPath(body.path);
  if (!path.startsWith('/')) return { error: 'invalid_path' };
  return { value: { type: body.type, path, source: short(body.source), utm_source: short(body.utm_source, 80), utm_medium: short(body.utm_medium, 80), utm_campaign: short(body.utm_campaign, 120), referrerHost: hostOf(body.referrer) } };
}

function touch(t) {
  if (!t || typeof t !== 'object') return null;
  return { source: short(t.source, 80), medium: short(t.medium, 80), campaign: short(t.campaign, 120), content: short(t.content, 120), term: short(t.term, 120),
    referrer: hostOf(t.referrer), landing: cleanPath(t.landing), ts: str(t.ts, 40) };
}

export function validateLead(body) {
  if (!body || typeof body !== 'object') return { error: 'invalid_body' };
  if (typeof body.website === 'string' && body.website.trim()) return { honeypot: true };
  const email = str(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: 'invalid_email' };
  const v = {
    email, firstName: str(body.firstName, 80), lastName: str(body.lastName, 80), phone: str(body.phone, 40), companyName: str(body.companyName, 160),
    businessType: short(body.businessType, 60), revenue: short(body.revenue, 60), projectType: short(body.projectType, 60), timeline: short(body.timeline, 60),
    budget: short(body.budget, 60), projectDetails: str(body.projectDetails, 4000), page: cleanPath(body.page),
    first: touch(body.attribution && body.attribution.first), last: touch(body.attribution && body.attribution.last)
  };
  const q = qualify(v);
  v.qualified = q.qualified;
  v.qualifyReason = q.reason;
  v.firstSource = (v.first && (v.first.source || v.first.referrer)) || 'direct';
  v.firstPage = (v.first && v.first.landing) || v.page || null;
  return { value: v };
}

/** Insert or (same email) update the lead. First-touch attribution is kept from the first submission. */
export async function upsertLead(db, v) {
  const existing = (await db.query('SELECT id FROM leads WHERE email = $1', [v.email])).rows[0];
  const cols = [v.firstName, v.lastName, v.phone, v.companyName, v.businessType, v.revenue, v.projectType, v.timeline, v.budget, v.projectDetails, v.qualified, v.qualifyReason, v.page, JSON.stringify(v.last)];
  if (existing) {
    await db.query(`UPDATE leads SET first_name=$2, last_name=$3, phone=$4, company_name=$5, business_type=$6, revenue=$7, project_type=$8, timeline=$9, budget=$10,
      project_details=$11, qualified=$12, qualify_reason=$13, page=$14, last_touch=$15, submissions = submissions + 1, updated_at = now() WHERE id = $1`, [existing.id, ...cols]);
    return { duplicate: true, qualified: v.qualified };
  }
  try {
    await db.query(`INSERT INTO leads (email, first_name, last_name, phone, company_name, business_type, revenue, project_type, timeline, budget, project_details, qualified, qualify_reason, page, last_touch, first_touch, first_source, first_page)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`, [v.email, ...cols, JSON.stringify(v.first), v.firstSource, v.firstPage]);
  } catch (e) {
    if (e.code !== '23505' && !/unique|duplicate/i.test(e.message)) throw e;
    return upsertLead(db, v); // raced with a parallel submit
  }
  return { duplicate: false, qualified: v.qualified };
}

export function createRateLimiter({ limit = 60, windowMs = 60_000, now = Date.now } = {}) {
  const salt = crypto.randomBytes(16);
  let windowStart = now();
  let hits = new Map();
  return (ip) => {
    const t = now();
    if (t - windowStart >= windowMs) { hits = new Map(); windowStart = t; }
    const key = crypto.createHmac('sha256', salt).update(String(ip)).digest('base64').slice(0, 16);
    const n = (hits.get(key) || 0) + 1;
    hits.set(key, n);
    return n <= limit;
  };
}

async function readJson(req, max = 16384) {
  let size = 0;
  const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > max) throw Object.assign(new Error('too_large'), { status: 413 });
    chunks.push(c);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { throw Object.assign(new Error('invalid_json'), { status: 400 }); }
}

function safeEqual(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y) && String(a).length === String(b).length;
}

async function counts(db) {
  const one = async (sql) => { try { return (await db.query(sql)).rows[0]; } catch (e) { return { error: e.message }; } };
  return {
    evidence: await one('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE discovered_at IS NULL)::int AS undiscovered FROM evidence'),
    accomplishments: await one("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'open')::int AS open FROM accomplishments"),
    articles: await one("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'published')::int AS published FROM articles"),
    leads: await one('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE qualified)::int AS qualified FROM leads')
  };
}

export function createHandler({ db, scheduler = null, adminToken = process.env.ADMIN_TOKEN, siteSecret = process.env.SITE_INGEST_SECRET, limiter = createRateLimiter(), log = console, codexStatus = defaultCodexStatus, env = process.env }) {
  return async function handle(req, res) {
    const url = new URL(req.url, 'http://x');
    const origin = req.headers.origin;
    const headers = { 'Cache-Control': 'no-store', Vary: 'Origin' };
    if (isAllowedOrigin(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
      headers['Access-Control-Max-Age'] = '600';
    }
    const send = (status, body) => {
      if (body === undefined) { res.writeHead(status, headers); return res.end(); }
      res.writeHead(status, { ...headers, 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };
    try {
      if (req.method === 'OPTIONS') return send(origin && !isAllowedOrigin(origin) ? 403 : 204);
      const path = url.pathname.replace(/\/+$/, '') || '/';
      if (path === '/api/health' && req.method === 'GET') return send(200, { ok: true });

      if (path.startsWith('/api/admin/')) {
        const auth = String(req.headers.authorization || '');
        if (!adminToken || !auth.startsWith('Bearer ') || !safeEqual(auth.slice(7), adminToken)) return send(401, { error: 'unauthorized' });
        if (path === '/api/admin/status' && req.method === 'GET') {
          const base = scheduler ? await scheduler.status() : { scheduler: 'off' };
          let codex; try { codex = await codexStatus(db, env); } catch (e) { codex = { error: e.message }; }
          return send(200, { ...base, codex, counts: await counts(db), config: {
            autoPublish: String(env.AUTO_PUBLISH ?? 'true') !== 'false', githubToken: Boolean(env.GITHUB_TOKEN), repo: env.GITHUB_REPO || 'Gahroot/bookin',
            gsc: Boolean(env.GSC_SERVICE_ACCOUNT_JSON), bing: Boolean(env.BING_API_KEY), codexModel: env.CODEX_MODEL || null } });
        }
        const m = path.match(/^\/api\/admin\/run\/([a-z_]+)$/);
        if (m && (req.method === 'GET' || req.method === 'POST')) {
          if (!scheduler || !scheduler.has(m[1])) return send(404, { error: 'unknown_job' });
          return send(202, { job: m[1], started: scheduler.trigger(m[1]) });
        }
        return send(404, { error: 'not_found' });
      }

      if (path === '/api/event' || path === '/api/lead') {
        if (req.method !== 'POST') return send(405, { error: 'method_not_allowed' });
        if (path === '/api/lead') {
          if (!siteSecret || !safeEqual(String(req.headers['x-site-secret'] || ''), siteSecret)) return send(401, { error: 'unauthorized' });
          const r = validateLead(await readJson(req));
          if (r.honeypot) return send(200, { ok: true });
          if (r.error) return send(400, { error: r.error });
          const out = await upsertLead(db, r.value);
          log.log(`[lead] stored (qualified=${out.qualified}, duplicate=${out.duplicate})`);
          return send(200, { ok: true, qualified: out.qualified });
        }
        if (origin && !isAllowedOrigin(origin)) return send(403, { error: 'origin_not_allowed' });
        const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '';
        if (!limiter(ip)) return send(429, { error: 'rate_limited' });
        const r = validateEvent(await readJson(req, 4096));
        if (r.error) return send(400, { error: r.error });
        const v = r.value;
        await db.query(
          `INSERT INTO events (day, type, path, source, utm_source, utm_medium, utm_campaign, referrer_host, count) VALUES ($1::date,$2,$3,$4,$5,$6,$7,$8,1)
           ON CONFLICT (day, type, path, source, utm_source, utm_medium, utm_campaign, referrer_host) DO UPDATE SET count = events.count + 1`,
          [todayNY(), v.type, v.path, v.source, v.utm_source, v.utm_medium, v.utm_campaign, v.referrerHost]);
        return send(204);
      }
      return send(404, { error: 'not_found' });
    } catch (e) {
      if (e.status) return send(e.status, { error: e.message });
      log.error('request failed', req.method, url.pathname, String(e.message).slice(0, 200));
      return send(500, { error: 'server_error' });
    }
  };
}
