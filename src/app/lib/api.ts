// Situs dan CMS sekarang disajikan dari deployment yang sama (assalimi.my.id),
// jadi semua request API tetap same-origin dan cookie login ikut terkirim.
//
// Build statis lama (Vercel) tidak punya API sama sekali, jadi di sana request
// diarahkan ke deployment production Freebuff Sites.
declare const __STATIC_BUILD__: boolean

const HOSTED_CMS = 'https://ngoprekbareng-j0t1xq.freebuff.site'
const STATIC_BUILD = typeof __STATIC_BUILD__ !== 'undefined' && __STATIC_BUILD__

function detectOrigin(): string {
  const configured = import.meta.env.VITE_CMS_API as string | undefined
  if (configured !== undefined) return configured.replace(/\/$/, '')
  return STATIC_BUILD ? HOSTED_CMS : ''
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
