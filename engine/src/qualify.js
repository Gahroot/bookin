// Lead qualification rule (documented in README). A lead is `qualified` when ALL of:
//   1. budget lower bound >= $5,000            (e.g. "5k-10k", "10k-25k", "25k+", "$5,000 - $10,000")
//   2. revenue lower bound >= $100,000         (e.g. "100k-500k", "1m-5m", "5m+"; "pre-revenue" fails)
//   3. timeline is not "exploring" / "just exploring" (any concrete timeline passes)
//   4. projectType is set; "consulting" (strategy only) additionally needs budget >= $10,000
// Unknown / "not sure" values fail the rule they belong to. The rule is deliberately simple and deterministic.
export function lowerBound(v) {
  const s = String(v || '').toLowerCase().replace(/,/g, '');
  if (!s || /not[- ]?sure|pre-?revenue|unknown/.test(s)) return null;
  if (/^under|^<|^less/.test(s)) return 0;
  const m = s.match(/\$?\s*(\d+(?:\.\d+)?)\s*(k|m|mm|million|thousand)?/);
  if (!m) return null;
  const n = Number(m[1]);
  const mult = { k: 1e3, thousand: 1e3, m: 1e6, mm: 1e6, million: 1e6 }[m[2]] || 1;
  return n * mult;
}

export function qualify({ budget, revenue, timeline, projectType }) {
  const b = lowerBound(budget), r = lowerBound(revenue);
  const t = String(timeline || '').toLowerCase();
  const p = String(projectType || '').toLowerCase();
  const fails = [];
  if (b == null || b < 5000) fails.push('budget<5k');
  if (r == null || r < 100000) fails.push('revenue<100k');
  if (!t || /explor/.test(t)) fails.push('timeline:exploring');
  if (!p) fails.push('no project type');
  else if (p === 'consulting' && (b == null || b < 10000)) fails.push('consulting<10k');
  return { qualified: fails.length === 0, reason: fails.length ? fails.join(',') : 'budget>=5k,revenue>=100k,active timeline' };
}
