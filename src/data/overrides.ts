// CMS menyimpan hanya bagian yang diubah, bukan seluruh konten. File ini
// menggabungkan simpanan itu dengan default di `site.ts`, jadi kalau CMS
// kosong (atau API mati) situs tetap tampil normal.
import {
  content as defaults,
  projectMeta,
  site as defaultSite,
  type Content,
  type Lang,
  type Project,
  type ProjectText,
} from './site'

export interface SocialLink {
  label: string
  href: string
}

export interface SiteInfo {
  name: string
  handle: string
  location: string
  timezone: string
  email: string
  available: boolean
  socials: SocialLink[]
}

export interface ProjectMeta {
  slug: string
  year: string
  cover: string
  tint: string
  size: 'large' | 'small'
  link?: string
}

/** Yang disimpan CMS. Semua field opsional supaya bisa menyimpan sebagian. */
export interface ContentOverrides {
  site?: Partial<SiteInfo>
  id?: Partial<Content>
  en?: Partial<Content>
  projects?: ProjectMeta[]
  portrait?: string
  updatedAt?: string
}

const emptyProjectText = (): ProjectText => ({ title: '', client: '', category: '', summary: '', role: [], deliverables: [], body: [] })

function mergeUi(base: Content, patch: Partial<Content>): Content {
  return {
    projects: { ...base.projects, ...(patch.projects ?? {}) },
    services: patch.services ?? base.services,
    testimonials: patch.testimonials ?? base.testimonials,
    experience: patch.experience ?? base.experience,
    pepTalk: patch.pepTalk ?? base.pepTalk,
    ui: { ...base.ui, ...(patch.ui ?? {}) },
  }
}

export function mergedContent(lang: Lang, overrides?: ContentOverrides | null): Content {
  const patch = overrides?.[lang]
  return patch ? mergeUi(defaults[lang], patch) : defaults[lang]
}

export function mergedSite(overrides?: ContentOverrides | null): SiteInfo {
  return { ...defaultSite, ...(overrides?.site ?? {}) }
}

export function mergedProjectMeta(overrides?: ContentOverrides | null): ProjectMeta[] {
  return overrides?.projects?.length ? overrides.projects : projectMeta
}

export function mergedProjects(lang: Lang, overrides?: ContentOverrides | null, cmsOrigin = ''): Project[] {
  const content = mergedContent(lang, overrides)
  return mergedProjectMeta(overrides).map((meta) => ({
    ...meta,
    cover: resolveImage(meta.cover, cmsOrigin),
    ...(content.projects[meta.slug] ?? emptyProjectText()),
  }))
}

/** Path `/media/...` dari CMS ikut pindah ke origin CMS kalau situs disajikan dari domain lain. */
export function resolveImage(url: string, cmsOrigin: string): string {
  if (!url) return '/images/portrait.jpg'
  if (url.startsWith('/media/') && cmsOrigin) return `${cmsOrigin}${url}`
  return url
}

export function portraitFor(overrides: ContentOverrides | null | undefined, cmsOrigin: string): string {
  return resolveImage(overrides?.portrait || '/images/portrait.jpg', cmsOrigin)
}

export function emptyContent(): Content {
  return defaults.id
}
