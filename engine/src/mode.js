// LLM routing mode. LLM_PROVIDER_ORDER=codex means Codex-only: every AI call (research, drafting, repair,
// self-revision, fact-check, AI-visibility checks) runs on the owner's ChatGPT/Codex subscription, paid APIs are
// never called, and the monthly AI budget is off (nothing can be spent). When Codex is temporarily unavailable,
// jobs are deferred and retried hourly instead of falling back to a paid API.
export function codexOnly(env = process.env) {
  const order = String(env.LLM_PROVIDER_ORDER || '').split(',').map((s) => s.trim()).filter(Boolean);
  return order.length === 1 && order[0] === 'codex';
}

/** A job that must wait (Codex backing off, logged out, weekly cap...): not a failure, retried next hour. */
export class DeferError extends Error {
  constructor(message) {
    super(message);
    this.defer = true;
    this.retryable = false;
  }
}
