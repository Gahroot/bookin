// Job table. Schedules are America/New_York; days: 0=Sun..6=Sat.
import * as ingest from './jobs/ingest.js';
import * as discover from './jobs/discover.js';
import * as draft from './jobs/draft.js';
import * as gate from './jobs/gate.js';
import * as portfolio from './jobs/portfolio.js';
import * as monitor from './jobs/monitor.js';
import * as report from './jobs/report.js';
import * as audit from './jobs/audit.js';
import { keepalive } from './codex.js';

export const JOBS = {
  ingest: { schedule: { hour: 2 }, run: ingest.run },
  discover: { schedule: { hour: 3 }, run: discover.run },
  draft: { schedule: { hour: 4, days: [1, 4] }, run: draft.run },
  gate: { schedule: { hourly: true }, run: gate.run },
  portfolio: { schedule: { hour: 5, days: [0] }, run: portfolio.run },
  monitor: { schedule: { hour: 6 }, run: monitor.run },
  report: { schedule: { hour: 8, days: [1] }, run: report.run },
  audit: { schedule: { hour: 4, days: [6] }, run: audit.run },
  codex_keepalive: { schedule: { hour: 6, days: [6] }, run: keepalive }
};
export { report };
