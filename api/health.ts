// Vercel Function for GET /api/health. Kept dependency-free so there is nothing
// to fail at load time; the Cloudflare Worker keeps the shared Hono routes.
export const GET = () => Response.json({ ok: true })
