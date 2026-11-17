// Vercel Function for POST /api/contact. Self-contained (no imports) because the
// bundled route depended on the Hono app and failed to load on Vercel; the
// Cloudflare Worker in src/worker keeps serving the same contract.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactBody = { email?: unknown; message?: unknown }

export async function POST(request: Request): Promise<Response> {
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > 16 * 1024) return Response.json({ error: 'Request-nya kegedean.' }, { status: 413 })

  const body = (await request.json().catch(() => null)) as ContactBody | null
  if (typeof body?.email !== 'string' || !emailPattern.test(body.email)) return Response.json({ error: 'Masukin email yang bener ya.' }, { status: 400 })
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) return Response.json({ error: 'Tulis sedikit soal projeknya.' }, { status: 400 })

  return Response.json({ ok: true, demo: true })
}
