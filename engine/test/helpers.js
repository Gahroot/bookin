import { newDb, DataType } from 'pg-mem';
import { migrate } from '../src/db.js';

export async function memDb() {
  const mem = newDb();
  // pg-mem lacks NULLIF on integer sums (used by the report/optimize queries).
  for (const t of [DataType.bigint, DataType.integer, DataType.float, DataType.decimal]) {
    mem.public.registerFunction({ name: 'nullif', args: [t, DataType.integer], returns: t, implementation: (a, b) => (Number(a) === Number(b) ? null : a) });
  }
  const { Pool } = mem.adapters.createPg();
  const db = new Pool();
  await migrate(db);
  return db;
}
