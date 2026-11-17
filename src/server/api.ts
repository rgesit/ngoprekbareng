import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

// `ASSETS` is only bound in the Cloudflare Worker wrapper (src/worker/index.ts);
// the Vercel Functions in api/ ignore it.
export type ApiEnv = { Bindings: { ASSETS: Fetcher } }

export const api = new Hono<ApiEnv>()

api.use('/api/*', bodyLimit({ maxSize: 16 * 1024, onError: (c) => c.json({ error: 'Request-nya kegedean.' }, 413) }))

api.get('/api/health', (c) => c.json({ ok: true }))

// Contact form. Forward to your inbox with an email API (key in env vars) or
// store in a database; for now it validates and acknowledges.
api.post('/api/contact', async (c) => {
  const body = await c.req.json<{ name?: unknown; email?: unknown; message?: unknown }>().catch(() => null)
  if (typeof body?.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return c.json({ error: 'Masukin email yang bener ya.' }, 400)
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) return c.json({ error: 'Tulis sedikit soal projeknya.' }, 400)
  return c.json({ ok: true, demo: true })
})

api.all('/api/*', (c) => c.json({ error: 'Gak ketemu.' }, 404))
