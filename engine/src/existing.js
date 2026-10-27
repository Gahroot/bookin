// What already exists in the site repo (content/articles + content/projects on the base branch), read through the
// GitHub contents API, so discover/draft never duplicate existing writing. The repo is public, so this works
// without a token (lower rate limit).
import { parseDoc } from './content.js';
import { repoName, BASE_BRANCH } from './github.js';

async function get(route, env, fetchImpl, raw = false) {
  const res = await fetchImpl(`https://api.github.com${route}`, {
    headers: { ...(env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}), accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json', 'user-agent': 'nolangrout-engine' },
    signal: AbortSignal.timeout(30_000)
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${route.split('?')[0]} -> ${res.status}`);
  return raw ? res.text() : res.json();
}

export async function readRepoFile(rel, { env = process.env, fetchImpl = globalThis.fetch, ref } = {}) {
  return get(`/repos/${repoName(env)}/contents/${rel}?ref=${encodeURIComponent(ref || BASE_BRANCH(env))}`, env, fetchImpl, true);
}

export async function existingContent({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const out = { articles: [], projects: [] };
  for (const dir of ['articles', 'projects']) {
    let files;
    try { files = await get(`/repos/${repoName(env)}/contents/content/${dir}?ref=${BASE_BRANCH(env)}`, env, fetchImpl); } catch { continue; }
    for (const f of Array.isArray(files) ? files : []) {
      if (!/\.md$/.test(f.name)) continue;
      const slug = f.name.replace(/\.md$/, '');
      try {
        const { data } = parseDoc(await get(`/repos/${repoName(env)}/contents/content/${dir}/${f.name}?ref=${BASE_BRANCH(env)}`, env, fetchImpl, true));
        out[dir].push({ slug, title: data.title || slug, primary_keyword: data.primary_keyword || '', project: data.project || data.slug || null, summary: data.summary || data.description || '' });
      } catch { out[dir].push({ slug, title: slug }); }
    }
  }
  return out;
}
