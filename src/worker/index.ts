import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', bodyLimit({ maxSize: 16 * 1024, onError: (c) => c.json({ error: 'Request-nya kegedean.' }, 413) }))

app.get('/api/health', (c) => c.json({ ok: true }))

// Contact form. Forward to your inbox with an email API (key in Sites →
// Secrets) or store in D1; for now it validates and acknowledges.
app.post('/api/contact', async (c) => {
  const body = await c.req.json<{ name?: unknown; email?: unknown; message?: unknown }>().catch(() => null)
  if (typeof body?.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return c.json({ error: 'Masukin email yang bener ya.' }, 400)
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) return c.json({ error: 'Tulis sedikit soal projeknya.' }, 400)
  return c.json({ ok: true, demo: true })
})

app.all('/api/*', (c) => c.json({ error: 'Gak ketemu.' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
