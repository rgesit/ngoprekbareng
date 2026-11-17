import { api } from '../src/server/api'

// Vercel maps this file to /api/contact. Exported as a Web handler per method so
// Vercel does not try to call the Hono instance as a Node (req, res) handler.
export const POST = (request: Request) => api.fetch(request)
