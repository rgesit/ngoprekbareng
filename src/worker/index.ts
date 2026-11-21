import { api, authFor, type Env } from '../server/api'

// Auth harus jalan sebelum aset/SPA, supaya /auth/freebuff/* sampai ke SDK.
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const auth = authFor(env)
    if (!auth) return api.fetch(request, env, ctx)
    return auth.wrap((req: Request) => api.fetch(req, env, ctx))(request)
  },
}
