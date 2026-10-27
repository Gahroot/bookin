// Hero images via the Codex gpt-image-2 endpoint (same endpoint/request shape as back2sleep's carousel-image.js).
// Subscription only: reads this server's existing Codex login in memory; never copies, logs or writes it.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { codexHome, getState, setState } from './codex.js';
import { recordUsage } from './db.js';
import { DeferError } from './mode.js';

export const IMAGE_ENDPOINT = 'https://chatgpt.com/backend-api/codex/images/generations';

export function heroPrompt({ title, theme }) {
  return `Abstract editorial hero image for an executive article titled "${String(title).replace(/"/g, "'")}"${theme ? ` about ${theme}` : ''}.
Style: deep navy background, layered translucent glass panels and soft geometric forms, subtle blue glow and light refraction, calm premium tech-editorial mood, generous negative space, wide 16:9 composition with the focal point slightly right of centre.
Strictly NO text, letters, numbers, charts with labels, logos, brand marks, people, faces, hands or screenshots of real software.`;
}

/** Generates the image and returns a 1600x900 webp Buffer. Throws DeferError when the subscription can't serve it now. */
export async function generateHero({ title, theme }, { env = process.env, db, fetchImpl = fetch, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), now = new Date() } = {}) {
  const until = await getState(db, 'image_backoff');
  if (until && new Date(until) > now) throw new DeferError(`Codex image limit; waiting until ${until}`);
  let auth;
  try { auth = JSON.parse(await readFile(path.join(codexHome(env), 'auth.json'), 'utf8')); } catch { throw new DeferError('Codex image login missing; renew the server Codex login'); }
  if (auth.auth_mode !== 'chatgpt' || !auth.tokens?.access_token) throw new DeferError('Codex image generation requires the ChatGPT subscription login');
  const version = '0.161.0';
  const headers = { Authorization: `Bearer ${auth.tokens.access_token}`, 'Content-Type': 'application/json', Accept: 'application/json', originator: 'codex_cli_rs', version,
    'User-Agent': `codex_cli_rs/${version} (${os.type()} ${os.release()}; ${os.arch()})`, 'x-codex-image-turn-id': randomUUID(),
    ...(auth.tokens.account_id ? { 'chatgpt-account-id': auth.tokens.account_id } : {}) };
  const body = JSON.stringify({ prompt: heroPrompt({ title, theme }), model: 'gpt-image-2', quality: 'high', size: '1536x1024', background: 'opaque' });
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetchImpl(IMAGE_ENDPOINT, { method: 'POST', headers, body, signal: AbortSignal.timeout(600_000) });
    if (response.status < 500 || attempt === 2) break;
    await sleep(1000 * 2 ** attempt);
  }
  if ([401, 403].includes(response.status)) throw new DeferError(`Codex image access refused (${response.status}); renew this server's Codex login`);
  if (response.status === 429) {
    const u = new Date(now.getTime() + 24 * 3_600_000).toISOString();
    await setState(db, 'image_backoff', u);
    throw new DeferError(`Codex image quota reached; paused until ${u}`);
  }
  if (!response.ok) throw Object.assign(new Error(`Codex image HTTP ${response.status}; response body omitted`), { retryable: response.status >= 500 });
  const j = await response.json();
  const b64 = j.data?.[0]?.b64_json;
  if (typeof b64 !== 'string' || b64.length > 40_000_000) throw new Error('Codex image response missing or too large');
  const webp = await sharp(Buffer.from(b64, 'base64'), { limitInputPixels: 20_000_000 }).resize(1600, 900, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toBuffer();
  await recordUsage(db, { job: 'draft', provider: 'codex', model: 'gpt-image-2' });
  return webp;
}
