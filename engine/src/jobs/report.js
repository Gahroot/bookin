// Monday: weekly GitHub issue (label weekly-report) with leads, qualified leads by source/page, published/held
// content and job health. Stored in `reports` even when GitHub isn't configured.
import { githubConfigured, upsertIssue } from '../github.js';
import { snapshot } from './monitor.js';
import { codexStatus } from '../codex.js';
import { todayNY } from '../db.js';

const table = (head, rows) => rows.length ? [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map((c) => String(c ?? '').replace(/\|/g, '/')).join(' | ')} |`)].join('\n') : '_None._';

export async function buildReport(db, env = process.env) {
  const q = async (sql) => (await db.query(sql)).rows;
  const s = await snapshot(db, 7);
  const byPage = await q("SELECT COALESCE(first_page, page, '-') AS page, COUNT(*)::int AS leads, COUNT(*) FILTER (WHERE qualified)::int AS qualified FROM leads WHERE created_at > now() - interval '7 days' GROUP BY 1 ORDER BY qualified DESC, leads DESC LIMIT 15");
  const gate = await q("SELECT pr_number, slugs, outcome, detail FROM gate_results WHERE created_at > now() - interval '7 days' AND outcome IN ('merged','held') ORDER BY id");
  const dropped = await q("SELECT slug, status, status_reason FROM articles WHERE updated_at > now() - interval '7 days' AND status IN ('dropped','blocked') ORDER BY slug");
  const jobs = await q("SELECT job, COUNT(*)::int AS runs, COUNT(*) FILTER (WHERE status='failed')::int AS failed, COUNT(*) FILTER (WHERE status='deferred')::int AS deferred, COUNT(*) FILTER (WHERE status='skipped')::int AS skipped, MAX(finished_at) AS last FROM job_runs WHERE started_at > now() - interval '7 days' GROUP BY job ORDER BY job");
  let codex = {}; try { codex = await codexStatus(db, env); } catch {}
  const totalLeads = s.leads.reduce((n, r) => n + r.leads, 0), qualified = s.leads.reduce((n, r) => n + r.qualified, 0);
  return [
    `# Weekly report — week ending ${todayNY()}`, '',
    `**Leads:** ${totalLeads} (qualified: ${qualified})`, '',
    '## Leads by first-touch source', table(['Source', 'Leads', 'Qualified'], s.leads.map((r) => [r.first_source, r.leads, r.qualified])), '',
    '## Leads by landing page', table(['Page', 'Leads', 'Qualified'], byPage.map((r) => [r.page, r.leads, r.qualified])), '',
    '## Traffic (pageviews by source)', table(['Source', 'Pageviews'], s.sources.map((r) => [r.source, r.n])), '',
    '## Events', table(['Type', 'Count'], s.events.map((r) => [r.type, r.n])), '',
    '## Content: published / held', table(['PR', 'Content', 'Result', 'Detail'], gate.map((r) => [`#${r.pr_number}`, r.slugs, r.outcome === 'merged' ? 'published' : 'held: needs-review', String(r.detail || '').slice(0, 160)])), '',
    '## Drafts not pushed', table(['Slug', 'Status', 'Why'], dropped.map((r) => [r.slug, r.status, String(r.status_reason || '').slice(0, 160)])), '',
    '## Job health', table(['Job', 'Runs', 'Failed', 'Deferred', 'Skipped', 'Last finished'], jobs.map((r) => [r.job, r.runs, r.failed, r.deferred, r.skipped, r.last ? new Date(r.last).toISOString().slice(0, 16) : '-'])), '',
    `Codex: logged in ${codex.loggedIn ? 'yes' : 'NO'}, calls last 7 days ${codex.callsLast7Days ?? '?'}/${codex.weeklyCap ?? '?'}${codex.backoffUntil ? `, backing off until ${codex.backoffUntil}` : ''}.`
  ].join('\n');
}

export async function run({ db, env = process.env }) {
  const body = await buildReport(db, env);
  let url = null;
  if (githubConfigured(env)) url = await upsertIssue({ title: `Weekly report ${todayNY()}`, label: 'weekly-report', body }, env);
  await db.query('INSERT INTO reports (week_of, body, issue_url) VALUES ($1,$2,$3)', [todayNY(), body, url]);
  return url ? { issue: url } : { skipped: 'not configured: GITHUB_TOKEN (report stored in the reports table only)' };
}

export async function alert(job, message, env = process.env) {
  if (!githubConfigured(env)) return;
  await upsertIssue({ title: `Engine job failing: ${job}`, label: 'engine-alert', body: `Job \`${job}\` failed after 3 attempts at ${new Date().toISOString()}.\n\n\`\`\`\n${String(message).slice(0, 2000)}\n\`\`\`\n\nRe-run: \`POST /api/admin/run/${job}\` with the admin token. Close this issue once fixed.` }, env);
}
