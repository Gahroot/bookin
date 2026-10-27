// Shared GitHub REST read helper for source adapters (read-only; token never logged).
export const tokenFor = (config, env) => env[config.tokenEnv || 'GITHUB_TOKEN'] || env.GITHUB_TOKEN || '';

export async function ghGet(route, { token, fetchImpl = globalThis.fetch, raw = false, allow404 = false }) {
  const res = await fetchImpl(`https://api.github.com${route}`, {
    headers: { authorization: `Bearer ${token}`, accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'nolangrout-engine' },
    signal: AbortSignal.timeout(60_000)
  });
  if (allow404 && res.status === 404) return null;
  if (!res.ok) throw Object.assign(new Error(`GitHub GET ${route.split('?')[0]} -> ${res.status}`), { status: res.status, retryable: res.status >= 500 || res.status === 429 });
  return raw ? res.text() : res.json();
}

// Redact anything secret-looking before evidence text is stored (it is shown to Codex and may be quoted).
export function redact(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\b(gh[pousr]_|github_pat_|sk-|re_|cal_live_|AKIA)[A-Za-z0-9_-]{6,}/g, '[redacted]')
    .replace(/eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_.-]+/g, '[redacted]')
    .replace(/\b[a-f0-9]{32,}\b/gi, '[redacted]')
    .replace(/(password|api[_-]?key|secret|token)\s*[=:]\s*\S+/gi, '$1=[redacted]')
    .replace(/\s+/g, ' ')
    .trim();
}
