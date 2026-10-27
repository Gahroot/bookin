import http from 'node:http';
import { createPool, migrate } from './db.js';
import { createHandler } from './api.js';
import { createScheduler } from './scheduler.js';
import { JOBS, report } from './jobs.js';

const db = createPool();
await migrate(db);
const scheduler = createScheduler({ db, jobs: JOBS, onFailure: (job, msg) => report.alert(job, msg) });
const server = http.createServer(createHandler({ db, scheduler }));
const port = Number(process.env.PORT) || 8080;
server.listen(port, () => console.log(`engine listening on ${port}`));
if (process.env.SCHEDULER !== 'off') await scheduler.start();

const shutdown = () => { scheduler.stop(); server.close(() => db.end().then(() => process.exit(0))); setTimeout(() => process.exit(0), 8000).unref(); };
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
