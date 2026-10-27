// Only reached when ENGINE_URL is unset; otherwise next.config rewrites /api/event to the engine.
export function POST(): Response {
  return new Response(null, { status: 204 })
}
