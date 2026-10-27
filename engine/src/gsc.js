// Google Search Console via service-account JWT (no SDK) + Bing Webmaster API.
import crypto from 'node:crypto';

export const gscSite = (env = process.env) => env.GSC_SITE_URL || 'sc-domain:nolangrout.com';
export const gscConfigured = (env = process.env) => Boolean(env.GSC_SERVICE_ACCOUNT_JSON);

let cached = null;
export async function googleToken(env = process.env) {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const sa = JSON.parse(env.GSC_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` })
  });
  if (!res.ok) throw new Error(`google token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

async function gpost(url, body, env) {
  const res = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${await googleToken(env)}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GSC ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

/** rows: { keys:[date,page,query], clicks, impressions, ctr, position } */
export async function searchAnalytics({ startDate, endDate, dimensions = ['date', 'page', 'query'], rowLimit = 5000 }, env = process.env) {
  const j = await gpost(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite(env))}/searchAnalytics/query`, { startDate, endDate, dimensions, rowLimit }, env);
  return j.rows || [];
}

export async function inspectUrl(inspectionUrl, env = process.env) {
  const j = await gpost('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { inspectionUrl, siteUrl: gscSite(env) }, env);
  const r = j.inspectionResult?.indexStatusResult || {};
  return `${r.verdict || 'UNKNOWN'}: ${r.coverageState || ''}`.trim();
}

export async function bingQueryStats(env = process.env) {
  const site = env.SITE_URL || 'https://nolangrout.com';
  const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?siteUrl=${encodeURIComponent(site)}&apikey=${encodeURIComponent(env.BING_API_KEY)}`);
  if (!res.ok) {
    const body = (await res.text().catch(() => '')).slice(0, 200);
    const hint = /NotAuthorized/.test(body) ? ' (site not verified in Bing Webmaster Tools?)' : '';
    throw new Error(`Bing ${res.status}${hint}`);
  }
  const j = await res.json();
  return (j.d || []).map((r) => ({
    day: new Date(Number(String(r.Date).match(/\d+/)?.[0] || Date.now())).toISOString().slice(0, 10),
    query: r.Query, clicks: r.Clicks || 0, impressions: r.Impressions || 0, position: r.AvgImpressionPosition ?? null
  }));
}
