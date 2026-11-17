import { api } from '../server/api'

const app = api

// Static assets are served by Cloudflare; Vercel serves them from dist/ instead.
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
