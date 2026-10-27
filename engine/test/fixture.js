import { mkdtemp, mkdir, cp, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as GH from '../src/github.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..'); // the bookin repo
const run = promisify(execFile);

/** Temp checkout inside engine/ (so `yaml` resolves from engine/node_modules) with the real content + validator. */
export async function fixtureRepo({ script = true } = {}) {
  const base = path.join(here, '../.test-tmp');
  await mkdir(base, { recursive: true });
  const dir = await mkdtemp(path.join(base, 'repo-'));
  await cp(path.join(ROOT, 'content'), path.join(dir, 'content'), { recursive: true });
  if (script) await cp(path.join(ROOT, 'scripts/content-check.mjs'), path.join(dir, 'scripts/content-check.mjs'));
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

/** The real contentCheck, minus `npm ci` (offline). */
export const realContentCheck = (dir) => GH.contentCheck(dir, { exec: (cmd, args, o) => (cmd === 'npm' ? Promise.resolve({ stdout: '' }) : run(cmd, args, o)) });
