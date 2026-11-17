import { api } from '../src/server/api'

// Vercel maps this file to /api/health. Exported as a Web handler per method so
// Vercel does not try to call the Hono instance as a Node (req, res) handler.
export const GET = (request: Request) => api.fetch(request)
