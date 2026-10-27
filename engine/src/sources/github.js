// Source adapter: approved GitHub repos. Collects commit messages, PR titles/bodies, releases and a README summary.
// NEVER file contents or code. Private repos produce public:false evidence with no URL and an opaque ref.
import { ghGet, redact, tokenFor } from './http.js';

export const kind = 'github';

export async function collect({ since, config, env = process.env, fetchImpl = globalThis.fetch }) {
  const token = tokenFor(config, env);
  if (!token) throw Object.assign(new Error(`no token (${config.tokenEnv || 'GITHUB_TOKEN'})`), { skip: true });
  const o = { token, fetchImpl };
  const repo = config.repo;
  const name = repo.split('/')[1];
  const pub = Boolean(config.public);
  const base = { source_id: config.id, project: config.project || null, client: config.client || null, public: pub };
  const sinceIso = (since ? new Date(since) : new Date(Date.now() - 90 * 86_400_000)).toISOString();
  const items = [];

  const commits = await ghGet(`/repos/${repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=100`, o);
  for (const c of commits || []) {
    const msg = redact(c.commit && c.commit.message).slice(0, 1500);
    if (!msg || /^merge (pull request|branch)/i.test(msg)) continue;
    const sha = c.sha.slice(0, 12);
    items.push({ ...base, id: `gh:${repo}:commit:${c.sha}`, kind: 'github-commit', title: msg.split(/(?<=\.)\s|\n/)[0].slice(0, 160),
      text: msg, date: (c.commit.author && c.commit.author.date || '').slice(0, 10) || null,
      ref: pub ? `${repo}@${sha}` : `${name}@${sha}`, url: pub ? c.html_url : null });
  }
  const prs = await ghGet(`/repos/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=50`, o);
  for (const p of prs || []) {
    if (!p.merged_at || p.merged_at < sinceIso) continue;
    items.push({ ...base, id: `gh:${repo}:pr:${p.number}`, kind: 'github-pr', title: redact(p.title).slice(0, 200),
      text: redact(`${p.title}\n${p.body || ''}`).slice(0, 3000), date: p.merged_at.slice(0, 10),
      ref: pub ? p.html_url : `${name}#pr-${p.number}`, url: pub ? p.html_url : null });
  }
  const rels = await ghGet(`/repos/${repo}/releases?per_page=20`, o);
  // Release refs are tags, not shas: public releases are cited as public URLs; private ones are skipped
  // (content-check only accepts repo@sha refs for github-repo evidence).
  for (const r of pub ? rels || [] : []) {
    if (!r.published_at || r.published_at < sinceIso) continue;
    items.push({ ...base, id: `gh:${repo}:release:${r.id}`, kind: 'public-url', title: redact(r.name || r.tag_name).slice(0, 200),
      text: redact(`${r.name || r.tag_name}\n${r.body || ''}`).slice(0, 3000), date: r.published_at.slice(0, 10),
      ref: r.html_url, url: r.html_url });
  }
  const head = (commits || [])[0] && commits[0].sha.slice(0, 12);
  const readme = (pub || head) && await ghGet(`/repos/${repo}/readme`, { ...o, raw: true, allow404: true });
  if (readme) {
    const summary = redact(String(readme).replace(/<[^>]+>/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')).slice(0, 1500);
    const today = new Date().toISOString().slice(0, 10);
    if (summary) items.push({ ...base, id: `gh:${repo}:readme:${today.slice(0, 7)}`, kind: 'github-repo', title: `${pub ? repo : name} README summary`,
      text: summary, date: today, ref: pub ? repo : `${name}@${head}`, url: pub ? `https://github.com/${repo}` : null });
  }
  return items;
}
