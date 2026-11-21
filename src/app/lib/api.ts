// Situs utama disajikan sebagai file statis di Vercel. CMS-nya butuh server,
// jadi API-nya ada di deployment Freebuff Sites yang sama dengan CMS. Di sana
// `cmsOrigin` kosong dan semua request tetap same-origin.
const HOSTED_CMS = 'https://ngoprekbareng-j0t1xq-preview.freebuff.site'

function detectOrigin(): string {
  const configured = import.meta.env.VITE_CMS_API as string | undefined
  if (configured) return configured.replace(/\/$/, '')
  if (typeof window === 'undefined') return ''
  const host = window.location.hostname
  const sameOrigin = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.freebuff.site')
  return sameOrigin ? '' : HOSTED_CMS
}

export const cmsOrigin = detectOrigin()

export const cmsUrl = (path: string): string => `${cmsOrigin}${path}`

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(cmsUrl(path), {
    credentials: cmsOrigin ? 'omit' : 'same-origin',
    ...init,
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Request gagal (${response.status}).`)
  }
  return (await response.json()) as T
}

export const isHostedCms = (): boolean => cmsOrigin !== ''
