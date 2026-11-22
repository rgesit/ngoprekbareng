import { createFreebuffAuth, isSameOriginRequest, type FreebuffAuth, type FreebuffUser } from '@freebuff/auth'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'

export type Env = {
  ASSETS: Fetcher
  DB: D1Database
  FILES: R2Bucket
  FREEBUFF_CLIENT_ID?: string
  FREEBUFF_ISSUER?: string
  APP_ORIGIN?: string
}

// `ASSETS` hanya ada di Worker Cloudflare (src/worker); Vercel Functions di
// api/ tidak memakai file ini.
const app = new Hono<{ Bindings: Env }>()

// Domain milik situs ini. Dipakai untuk CORS (saat build statis lama masih
// memanggil API) dan untuk memilih base URL sign-in yang benar saat halaman
// dibuka dari domain sendiri, bukan dari alamat *.freebuff.site.
const allowedOrigins = new Set(['https://assalimi.my.id', 'https://www.assalimi.my.id'])

function originAllowed(origin: string): boolean {
  if (!origin) return true
  if (allowedOrigins.has(origin)) return true
  try {
    const host = new URL(origin).hostname
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.freebuff.site')
  } catch {
    return false
  }
}

app.use(
  '/api/*',
  cors({
    origin: (origin) => (originAllowed(origin) ? origin || '*' : ''),
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 600,
  }),
)

// --- Login (Sign in with Freebuff) -----------------------------------------

const authInstances = new Map<string, FreebuffAuth>()

function requestOrigin(request: Request): string {
  const fromHeader = request.headers.get('origin')
  if (fromHeader) return fromHeader
  try {
    return new URL(request.url).origin
  } catch {
    return ''
  }
}

/**
 * Origin yang boleh jadi base URL sign-in. Isinya tetap daftar tertutup: domain
 * situs sendiri, origin deployment dari platform, dan localhost untuk dev.
 * Jadi ini bukan "percaya header Host", melainkan memilih alamat yang memang
 * sudah kita miliki — perlu karena situs bisa dibuka dari domain sendiri atau
 * dari alamat *.freebuff.site.
 */
function authOriginAllowed(origin: string, env: Env): boolean {
  if (!origin) return false
  if (origin === env.APP_ORIGIN) return true
  if (allowedOrigins.has(origin)) return true
  return /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin)
}

function baseUrlFor(env: Env, request: Request): string | null {
  const origin = requestOrigin(request)
  if (authOriginAllowed(origin, env)) return origin
  return env.APP_ORIGIN || null
}

/** Satu instance per base URL supaya cache discovery & signing key ikut dipakai. */
export function authFor(env: Env, request?: Request): FreebuffAuth | null {
  if (!env.FREEBUFF_CLIENT_ID) return null
  const baseUrl = request ? baseUrlFor(env, request) : env.APP_ORIGIN || null
  if (!baseUrl) return null
  let auth = authInstances.get(baseUrl)
  if (!auth) {
    auth = createFreebuffAuth({
      clientId: env.FREEBUFF_CLIENT_ID,
      issuer: env.FREEBUFF_ISSUER,
      baseUrl,
      allowInsecureLocalhost: /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(baseUrl),
    })
    authInstances.set(baseUrl, auth)
  }
  return auth
}

async function currentUser(c: { env: Env; req: { raw: Request } }): Promise<FreebuffUser | null> {
  const auth = authFor(c.env, c.req.raw)
  if (!auth) return null
  return auth.getUser(c.req.raw)
}

function sameOrigin(c: { env: Env; req: { raw: Request } }): boolean {
  const baseUrl = baseUrlFor(c.env, c.req.raw)
  return !baseUrl || isSameOriginRequest(c.req.raw, baseUrl)
}

// --- Database ---------------------------------------------------------------

let schemaReady: Promise<void> | undefined

async function ensureSchema(db: D1Database): Promise<void> {
  schemaReady ??= (async () => {
    await db.batch([
      db.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)'),
      db.prepare(
        'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT \'\', email TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL)',
      ),
    ])
  })().catch((error) => {
    schemaReady = undefined
    throw error
  })
  return schemaReady
}

async function readSetting(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>()
  return row?.value ?? null
}

async function ownerSub(db: D1Database): Promise<string | null> {
  return readSetting(db, 'owner_sub')
}

async function requireOwner(c: { env: Env; req: { raw: Request } }): Promise<FreebuffUser | Response> {
  const user = await currentUser(c)
  if (!user) return Response.json({ error: 'Login dulu ya.' }, { status: 401 })
  const owner = await ownerSub(c.env.DB)
  if (owner !== user.sub) return Response.json({ error: 'Akun ini bukan pemilik situs.' }, { status: 403 })
  return user
}

const json = (data: unknown, init?: ResponseInit): Response => Response.json(data, init)

// --- Konten publik ----------------------------------------------------------

app.get('/api/health', (c) => c.json({ ok: true }))

app.get('/api/content', async (c) => {
  await ensureSchema(c.env.DB)
  const stored = await readSetting(c.env.DB, 'content')
  const data = stored ? (JSON.parse(stored) as Record<string, unknown>) : {}
  return json(data, { headers: { 'cache-control': 'public, max-age=0, s-maxage=20' } })
})

// --- Form kontak ------------------------------------------------------------

app.post(
  '/api/contact',
  bodyLimit({ maxSize: 32 * 1024, onError: (c) => c.json({ error: 'Pesannya kegedean.' }, 413) }),
  async (c) => {
    const body = (await c.req.json().catch(() => null)) as { name?: unknown; email?: unknown; message?: unknown } | null
    if (typeof body?.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return c.json({ error: 'Masukin email yang bener ya.' }, 400)
    if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) return c.json({ error: 'Tulis sedikit soal projeknya.' }, 400)

    await ensureSchema(c.env.DB)
    const name = typeof body.name === 'string' ? body.name.slice(0, 120) : ''
    await c.env.DB.prepare('INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)')
      .bind(name, body.email.slice(0, 200), body.message.trim(), new Date().toISOString())
      .run()
    return c.json({ ok: true })
  },
)

// --- CMS: status akun -------------------------------------------------------

app.get('/api/cms/me', async (c) => {
  const user = await currentUser(c)
  if (!user) return json({ user: null, owner: false, canClaim: false }, { headers: { 'cache-control': 'private, no-store' } })
  await ensureSchema(c.env.DB)
  const owner = await ownerSub(c.env.DB)
  return json(
    {
      user: { name: user.name ?? null, email: user.email ?? null, picture: user.picture ?? null },
      owner: owner === user.sub,
      canClaim: owner === null,
    },
    { headers: { 'cache-control': 'private, no-store' } },
  )
})

app.post('/api/cms/claim', async (c) => {
  if (!sameOrigin(c)) return c.json({ error: 'Origin gak dikenal.' }, 403)
  const user = await currentUser(c)
  if (!user) return c.json({ error: 'Login dulu ya.' }, 401)
  await ensureSchema(c.env.DB)
  await c.env.DB.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').bind('owner_sub', user.sub).run()
  const owner = await ownerSub(c.env.DB)
  return c.json({ owner: owner === user.sub })
})

// --- CMS: konten ------------------------------------------------------------

app.put(
  '/api/cms/content',
  bodyLimit({ maxSize: 1024 * 1024, onError: (c) => c.json({ error: 'Kontennya kegedean.' }, 413) }),
  async (c) => {
    if (!sameOrigin(c)) return c.json({ error: 'Origin gak dikenal.' }, 403)
    const user = await requireOwner(c)
    if (user instanceof Response) return user
    const body = await c.req.json().catch(() => null)
    if (!body || typeof body !== 'object') return c.json({ error: 'Data konten gak valid.' }, 400)

    await ensureSchema(c.env.DB)
    const payload = { ...(body as Record<string, unknown>), updatedAt: new Date().toISOString() }
    await c.env.DB.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .bind('content', JSON.stringify(payload))
      .run()
    return json({ ok: true, updatedAt: payload.updatedAt })
  },
)

// --- CMS: gambar ------------------------------------------------------------

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

app.post('/api/media', async (c) => {
  if (!sameOrigin(c)) return c.json({ error: 'Origin gak dikenal.' }, 403)
  const user = await requireOwner(c)
  if (user instanceof Response) return user

  const form = await c.req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return c.json({ error: 'File-nya gak kebaca.' }, 400)
  const extension = IMAGE_TYPES[file.type]
  if (!extension) return c.json({ error: 'Formatnya harus JPG, PNG, WebP, GIF, atau AVIF.' }, 400)
  if (file.size > 5 * 1024 * 1024) return c.json({ error: 'Maksimal 5 MB per gambar.' }, 413)

  const key = `media/${crypto.randomUUID()}.${extension}`
  await c.env.FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type } })
  return c.json({ url: `/${key}` })
})

app.get('/media/*', async (c) => {
  const key = decodeURIComponent(new URL(c.req.url).pathname.replace(/^\/media\//, ''))
  if (!key || key.includes('..')) return c.notFound()
  const object = await c.env.FILES.get(key)
  if (!object) return c.notFound()
  return new Response(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
})

// --- CMS: pesan masuk -------------------------------------------------------

type MessageRow = { id: number; name: string; email: string; message: string; created_at: string }

app.get('/api/messages', async (c) => {
  const user = await currentUser(c)
  if (!user) return c.json({ error: 'Login dulu ya.' }, 401)
  const owner = await ownerSub(c.env.DB)
  if (owner !== user.sub) return c.json({ error: 'Akun ini bukan pemilik situs.' }, 403)
  await ensureSchema(c.env.DB)
  const { results } = await c.env.DB.prepare('SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC LIMIT 200').all<MessageRow>()
  return json({ messages: results }, { headers: { 'cache-control': 'private, no-store' } })
})

app.delete('/api/messages/:id', async (c) => {
  if (!sameOrigin(c)) return c.json({ error: 'Origin gak dikenal.' }, 403)
  const user = await requireOwner(c)
  if (user instanceof Response) return user
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) return c.json({ error: 'ID gak valid.' }, 400)
  await c.env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

app.all('/api/*', (c) => c.json({ error: 'Gak ketemu.' }, 404))

// Aset statis dilayani Cloudflare; ini fallback untuk SPA.
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export const api = app
