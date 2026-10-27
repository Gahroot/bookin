// Daily: events + leads by source / first touch; GSC and Bing only when their credentials are set.
import { gscConfigured, searchAnalytics, bingQueryStats } from '../gsc.js';
import { todayNY } from '../db.js';

export async function snapshot(db, days = 1) {
  const since = `CURRENT_DATE - ${Number(days)}`;
  const q = async (sql) => (await db.query(sql)).rows;
  return {
    events: await q(`SELECT type, SUM(count)::int AS n FROM events WHERE day >= ${since} GROUP BY type ORDER BY type`),
    topPages: await q(`SELECT path, SUM(count)::int AS n FROM events WHERE day >= ${since} AND type = 'pageview' GROUP BY path ORDER BY n DESC, path LIMIT 10`),
    sources: await q(`SELECT COALESCE(NULLIF(utm_source, ''), NULLIF(source, ''), NULLIF(referrer_host, ''), 'direct') AS source, SUM(count)::int AS n FROM events WHERE day >= ${since} AND type = 'pageview' GROUP BY 1 ORDER BY n DESC LIMIT 10`),
    leads: await q(`SELECT first_source, COUNT(*)::int AS leads, COUNT(*) FILTER (WHERE qualified)::int AS qualified FROM leads WHERE created_at >= ${since} GROUP BY first_source ORDER BY leads DESC, first_source`)
  };
}

export async function run({ db, env = process.env, log = console }) {
  const data = { ...(await snapshot(db, 1)), notes: {} };
  if (gscConfigured(env)) {
    try {
      const end = new Date(Date.now() - 2 * 86400e3), start = new Date(Date.now() - 9 * 86400e3);
      const rows = await searchAnalytics({ startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) }, env);
      for (const r of rows) {
        const [day, page, query] = r.keys;
        await db.query(`INSERT INTO metrics_daily (day, provider, page, query, clicks, impressions, ctr, position) VALUES ($1,'gsc',$2,$3,$4,$5,$6,$7)
          ON CONFLICT (day, provider, page, query) DO UPDATE SET clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions, ctr = EXCLUDED.ctr, position = EXCLUDED.position`,
        [day, page, query, r.clicks, r.impressions, r.ctr, r.position]);
      }
      data.notes.gsc = `${rows.length} rows`;
    } catch (e) { log.error('[monitor] gsc', e.message.slice(0, 200)); data.notes.gsc = `error: ${e.message.slice(0, 200)}`; }
  } else data.notes.gsc = 'skipped: GSC_SERVICE_ACCOUNT_JSON not set';
  if (env.BING_API_KEY) {
    try {
      const rows = await bingQueryStats(env);
      for (const r of rows) await db.query(`INSERT INTO metrics_daily (day, provider, page, query, clicks, impressions, position) VALUES ($1,'bing','',$2,$3,$4,$5)
        ON CONFLICT (day, provider, page, query) DO UPDATE SET clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions, position = EXCLUDED.position`, [r.day, r.query, r.clicks, r.impressions, r.position]);
      data.notes.bing = `${rows.length} rows`;
    } catch (e) { log.error('[monitor] bing', e.message); data.notes.bing = `error: ${e.message}`; }
  } else data.notes.bing = 'skipped: BING_API_KEY not set';
  await db.query('INSERT INTO monitor_snapshots (day, data) VALUES ($1, $2)', [todayNY(), JSON.stringify(data)]);
  return data;
}
