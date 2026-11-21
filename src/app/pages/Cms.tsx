import { SignInWithFreebuff, SignOutButton, useFreebuffUser } from '@freebuff/auth/react'
import { ArrowLeft, Check, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import type { Content, Lang, ProjectText } from '../../data/site'
import {
  mergedContent,
  mergedProjectMeta,
  mergedSite,
  resolveImage,
  type ContentOverrides,
  type ProjectMeta,
  type SiteInfo,
} from '../../data/overrides'
import { cmsFetch, cmsOrigin, isHostedCms } from '../lib/api'
import { useSettings } from '../lib/settings'

interface Draft {
  site: SiteInfo
  id: Content
  en: Content
  projects: ProjectMeta[]
  portrait: string
}

interface Me {
  user: { name: string | null; email: string | null; picture: string | null } | null
  owner: boolean
  canClaim: boolean
}

interface MessageRow {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

const LANGS: Array<{ id: Lang; label: string }> = [
  { id: 'id', label: 'Indonesia' },
  { id: 'en', label: 'English' },
]

const LABELS: Record<string, string> = {
  name: 'Nama',
  handle: 'Handle',
  location: 'Kota',
  timezone: 'Zona waktu',
  email: 'Email',
  available: 'Buka projek',
  socials: 'Sosial media',
  label: 'Label',
  href: 'URL',
  title: 'Judul',
  body: 'Isi',
  bodyText: 'Isi',
  tag: 'Tag',
  age: 'Umur',
  points: 'Poin',
  quote: 'Kutipan',
  role: 'Peran',
  period: 'Periode',
  detail: 'Detail',
  client: 'Klien',
  category: 'Kategori',
  summary: 'Ringkasan',
  deliverables: 'Hasil',
  slug: 'Slug',
  year: 'Tahun',
  cover: 'Gambar',
  tint: 'Warna',
  size: 'Ukuran',
  link: 'Link',
  projects: 'Projek',
  services: 'Layanan',
  testimonials: 'Testimoni',
  experience: 'Perjalanan',
  pepTalk: 'Pep talk',
  ui: 'Teks antarmuka',
  docTitle: 'Judul tab browser',
  heroBadge: 'Badge hero',
  heroWork: 'Tombol karya',
  heroPep: 'Tombol pep talk',
  intro: 'Intro',
  whyLines: 'Judul “kenapa”',
  whyBody: 'Isi “kenapa”',
  whyLink: 'Link “kenapa”',
  workLines: 'Judul karya',
  workCount: 'Jumlah karya',
  levelLines: 'Judul level',
  levelBody: 'Isi level',
  skillLines: 'Judul skill',
  skillBody: 'Isi skill',
  pepLines: 'Judul pep talk',
  aboutLines: 'Judul tentang',
  aboutLead: 'Paragraf pembuka',
  aboutBody: 'Isi tentang',
  aboutJourney: 'Judul perjalanan',
  aboutStats: 'Statistik',
  footerTop: 'Footer atas',
  footerBefore: 'Footer tengah',
  footerAccent: 'Footer aksen',
  footerBlurb: 'Footer deskripsi',
  formNote: 'Catatan form',
  formDoneTitle: 'Judul setelah kirim',
  formDoneBody: 'Isi setelah kirim',
  formName: 'Label nama',
  formEmail: 'Label email',
  formMessage: 'Label pesan',
  formSend: 'Tombol kirim',
  formSending: 'Tombol saat kirim',
  formError: 'Pesan error',
  marquee: 'Marquee',
  openForWork: 'Teks buka projek',
  fullyBooked: 'Teks penuh',
  navWork: 'Menu karya',
  navAbout: 'Menu tentang',
  navContact: 'Menu kontak',
}

const humanize = (key: string): string => LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())

const fieldClass =
  'w-full rounded-control border border-line bg-surface px-3.5 py-2.5 text-[14px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent'
const buttonClass =
  'inline-flex h-10 items-center gap-2 rounded-control border border-line px-4 text-[13px] font-medium text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-50'

function emptyShape(value: unknown): unknown {
  if (typeof value === 'string') return ''
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return []
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, emptyShape(item)]))
  return ''
}

async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const result = await cmsFetch<{ url: string }>('/api/media', { method: 'POST', body: form })
  return result.url
}

function TextField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const long = value.length > 64 || value.includes('\n')
  return (
    <textarea
      value={value}
      rows={long ? 4 : 1}
      onChange={(event) => onChange(event.target.value)}
      className={`${fieldClass} resize-y`}
    />
  )
}

function StringList({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            value={item}
            rows={item.length > 64 ? 3 : 1}
            onChange={(event) => onChange(value.map((current, i) => (i === index ? event.target.value : current)))}
            className={`${fieldClass} resize-y`}
          />
          <button type="button" aria-label="Hapus baris" onClick={() => onChange(value.filter((_, i) => i !== index))} className="grid size-10 shrink-0 place-items-center rounded-control border border-line text-muted hover:border-accent hover:text-accent">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className={`${buttonClass} self-start`}>
        <Plus className="size-3.5" />
        Tambah baris
      </button>
    </div>
  )
}

function PairList({ value, onChange }: { value: string[][]; onChange: (next: string[][]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {value.map((pair, index) => (
        <div key={index} className="flex items-center gap-2">
          {[0, 1].map((slot) => (
            <input
              key={slot}
              value={pair[slot] ?? ''}
              onChange={(event) => onChange(value.map((current, i) => (i === index ? current.map((cell, j) => (j === slot ? event.target.value : cell)) : current)))}
              className={fieldClass}
            />
          ))}
          <button type="button" aria-label="Hapus" onClick={() => onChange(value.filter((_, i) => i !== index))} className="grid size-10 shrink-0 place-items-center rounded-control border border-line text-muted hover:border-accent hover:text-accent">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ['', '']])} className={`${buttonClass} self-start`}>
        <Plus className="size-3.5" />
        Tambah
      </button>
    </div>
  )
}

function ObjectList({ value, onChange }: { value: Array<Record<string, unknown>>; onChange: (next: Array<Record<string, unknown>>) => void }) {
  const template = value[0] ?? {}
  return (
    <div className="flex flex-col gap-3">
      {value.map((item, index) => (
        <div key={index} className="rounded-card border border-line bg-surface-2/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] uppercase tracking-[0.14em] text-faint">#{index + 1}</p>
            <button type="button" aria-label="Hapus item" onClick={() => onChange(value.filter((_, i) => i !== index))} className="grid size-8 place-items-center rounded-control border border-line text-muted hover:border-accent hover:text-accent">
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <ValueEditor value={item} onChange={(next) => onChange(value.map((current, i) => (i === index ? (next as Record<string, unknown>) : current)))} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, emptyShape(template) as Record<string, unknown>])} className={`${buttonClass} self-start`}>
        <Plus className="size-3.5" />
        Tambah item
      </button>
    </div>
  )
}

function ValueEditor({ value, onChange }: { value: unknown; onChange: (next: unknown) => void }) {
  if (typeof value === 'string') return <TextField value={value} onChange={(next) => onChange(next)} />
  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[var(--accent)]" />
        {value ? 'Aktif' : 'Nonaktif'}
      </label>
    )
  }
  if (typeof value === 'number') {
    return <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className={fieldClass} />
  }
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every((item) => typeof item === 'string')) {
      return <StringList value={value as string[]} onChange={(next) => onChange(next)} />
    }
    if (value.length > 0 && value.every((item) => Array.isArray(item) && item.length === 2)) {
      return <PairList value={value as string[][]} onChange={(next) => onChange(next)} />
    }
    if (value.length === 0 || value.every((item) => item && typeof item === 'object')) {
      return <ObjectList value={value as Array<Record<string, unknown>>} onChange={(next) => onChange(next)} />
    }
    return <StringList value={value.map((item) => String(item))} onChange={(next) => onChange(next)} />
  }
  if (value && typeof value === 'object') {
    return (
      <div className="flex flex-col gap-3">
        {Object.entries(value as Record<string, unknown>).map(([key, item]) => (
          <div key={key}>
            <p className="mb-1.5 text-[12px] text-muted">{humanize(key)}</p>
            <ValueEditor value={item} onChange={(next) => onChange({ ...(value as Record<string, unknown>), [key]: next })} />
          </div>
        ))}
      </div>
    )
  }
  return null
}

function ImagePicker({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <div>
      <p className="mb-1.5 text-[12px] text-muted">{label}</p>
      <div className="flex items-center gap-4">
        <img src={resolveImage(value, cmsOrigin)} alt="" className="size-20 rounded-[14px] border border-line object-cover" />
        <label className={`${buttonClass} cursor-pointer`}>
          <ImagePlus className="size-4" />
          {busy ? 'Ngunggah…' : 'Ganti gambar'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              setBusy(true)
              setError('')
              try {
                onChange(await uploadImage(file))
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : 'Gagal unggah gambar.')
              } finally {
                setBusy(false)
              }
            }}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-[13px] text-accent">{error}</p>}
    </div>
  )
}

export function Cms() {
  if (isHostedCms()) {
    return (
      <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col justify-center px-5 py-24">
        <h1 className="font-display text-[40px]">CMS ada di domain lain</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          Situs ini versi statis, jadi CMS-nya jalan di server terpisah. Buka CMS di{' '}
          <a href={`${cmsOrigin}/cms`} className="text-accent underline">
            {cmsOrigin}/cms
          </a>
          .
        </p>
      </main>
    )
  }
  return <CmsApp />
}

function CmsApp() {
  const { user, isLoading } = useFreebuffUser()
  const { reload } = useSettings()
  const [me, setMe] = useState<Me | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [tab, setTab] = useState<'konten' | 'projek' | 'lainnya' | 'pesan'>('konten')
  const [lang, setLang] = useState<Lang>('id')
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'saved' | 'error'; message?: string }>({ kind: 'idle' })

  useEffect(() => {
    cmsFetch<Me>('/api/cms/me')
      .then(setMe)
      .catch(() => setMe(null))
  }, [user])

  useEffect(() => {
    if (!me?.owner) return
    cmsFetch<ContentOverrides>('/api/content')
      .then((overrides) =>
        setDraft({
          site: mergedSite(overrides),
          id: mergedContent('id', overrides),
          en: mergedContent('en', overrides),
          projects: mergedProjectMeta(overrides).map((project) => ({ ...project })),
          portrait: overrides?.portrait || '/images/portrait.jpg',
        }),
      )
      .catch((error: unknown) => setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Gagal memuat konten.' }))
  }, [me?.owner])

  const update = useCallback((mutate: (next: Draft) => void) => {
    setDirty(true)
    setStatus({ kind: 'idle' })
    setDraft((current) => {
      if (!current) return current
      const next = structuredClone(current)
      mutate(next)
      return next
    })
  }, [])

  const contentKey = useMemo(() => `cms-${lang}`, [lang])

  if (isLoading) return <CmsShell><p className="text-muted">Ngecek sesi…</p></CmsShell>

  if (!user) {
    return (
      <CmsShell>
        <h1 className="font-display text-[44px]">Masuk ke CMS</h1>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted">
          CMS ini buat ganti teks, gambar, projek, dan baca pesan dari form kontak. Masuk pakai akun Freebuff — gak perlu bikin password baru.
        </p>
        <SignInWithFreebuff returnTo="/cms" className="mt-8 inline-flex h-12 items-center gap-2 rounded-control bg-accent px-6 text-[15px] font-semibold text-bg">
          Sign in with Freebuff
        </SignInWithFreebuff>
      </CmsShell>
    )
  }

  if (!me) return <CmsShell><p className="text-muted">Ngecek akses…</p></CmsShell>

  if (!me.owner && !me.canClaim) {
    return (
      <CmsShell>
        <h1 className="font-display text-[40px]">Akun ini bukan pemilik</h1>
        <p className="mt-3 text-muted">CMS cuma bisa dibuka pemilik situs. Masuk pakai akun yang dipakai pertama kali.</p>
        <div className="mt-8"><SignOutButton returnTo="/" className={buttonClass}>Keluar</SignOutButton></div>
      </CmsShell>
    )
  }

  if (!me.owner) {
    return (
      <CmsShell>
        <h1 className="font-display text-[40px]">Klaim CMS</h1>
        <p className="mt-3 max-w-md text-muted">
          Kamu masuk sebagai {me.user?.name ?? me.user?.email ?? 'akun ini'}. Sekali diklaim, cuma akun ini yang bisa mengedit konten dan membaca pesan.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-control bg-accent px-6 text-[15px] font-semibold text-bg"
          onClick={async () => {
            try {
              await cmsFetch('/api/cms/claim', { method: 'POST' })
              setMe({ ...me, owner: true, canClaim: false })
            } catch (error) {
              setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Gagal klaim.' })
            }
          }}
        >
          Klaim sebagai pemilik
        </button>
        {status.kind === 'error' && <p className="mt-3 text-[13px] text-accent">{status.message}</p>}
      </CmsShell>
    )
  }

  if (!draft) return <CmsShell><p className="text-muted">{status.message ?? 'Muat konten…'}</p></CmsShell>

  const addProject = () => {
    let index = draft.projects.length + 1
    let slug = `projek-${index}`
    while (draft.projects.some((project) => project.slug === slug)) slug = `projek-${++index}`
    update((next) => {
      next.projects.push({ slug, year: String(new Date().getFullYear()), cover: '/images/aurora.jpg', tint: '#d9ff3f', size: 'small' })
      next.id.projects[slug] = { title: 'Projek baru', client: '', category: '', summary: '', role: [], deliverables: [], body: [] }
      next.en.projects[slug] = { title: 'New project', client: '', category: '', summary: '', role: [], deliverables: [], body: [] }
    })
  }

  const renameProject = (index: number, rawSlug: string) => {
    const slug = rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
    if (!slug || draft.projects.some((project, i) => i !== index && project.slug === slug)) return
    update((next) => {
      const project = next.projects[index]
      const oldSlug = project.slug
      for (const code of ['id', 'en'] as const) {
        const text = next[code].projects[oldSlug]
        delete next[code].projects[oldSlug]
        next[code].projects[slug] = text ?? { title: '', client: '', category: '', summary: '', role: [], deliverables: [], body: [] }
      }
      project.slug = slug
    })
  }

  const removeProject = (index: number) => {
    update((next) => {
      const [removed] = next.projects.splice(index, 1)
      if (removed) {
        delete next.id.projects[removed.slug]
        delete next.en.projects[removed.slug]
      }
    })
  }

  const save = async () => {
    setStatus({ kind: 'saving' })
    try {
      await cmsFetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      })
      await reload()
      setDirty(false)
      setStatus({ kind: 'saved' })
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Gagal menyimpan.' })
    }
  }

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: 'konten', label: 'Konten & gambar' },
    { id: 'projek', label: 'Projek' },
    { id: 'lainnya', label: 'Layanan & cerita' },
    { id: 'pesan', label: 'Pesan masuk' },
  ]

  return (
    <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-24 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-fg">
            <ArrowLeft className="size-4" /> Lihat situs
          </Link>
          <h1 className="font-display mt-2 text-[40px] sm:text-[52px]">CMS {draft.site.name}</h1>
          <p className="mt-1 text-[14px] text-muted">
            Masuk sebagai {me.user?.name ?? me.user?.email ?? 'pemilik'}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SignOutButton returnTo="/" className={buttonClass}>Keluar</SignOutButton>
          <button type="button" onClick={save} disabled={status.kind === 'saving' || !dirty} className={buttonClass}>
            {status.kind === 'saving' ? <Save className="size-4 animate-pulse" /> : status.kind === 'saved' ? <Check className="size-4" /> : <Save className="size-4" />}
            {status.kind === 'saving' ? 'Nyimpen…' : status.kind === 'saved' ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>
      </div>

      {status.kind === 'error' && <p className="mt-4 rounded-control border border-accent/50 bg-accent/10 px-4 py-3 text-[14px] text-accent">{status.message}</p>}

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`h-10 rounded-control border px-4 text-[13px] font-medium transition-colors ${
              tab === item.id ? 'border-accent bg-accent text-bg' : 'border-line text-muted hover:text-fg'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== 'pesan' && (
        <div className="mt-6 flex gap-2">
          {LANGS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLang(item.id)}
              className={`h-9 rounded-control border px-3 text-[12px] font-semibold uppercase tracking-[0.08em] ${
                lang === item.id ? 'border-accent text-accent' : 'border-line text-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'konten' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <section className="rounded-card border border-line bg-surface p-5">
            <h2 className="font-display text-[24px]">Identitas</h2>
            <div className="mt-4">
              <ImagePicker label="Foto potret" value={draft.portrait} onChange={(next) => update((d) => { d.portrait = next })} />
            </div>
            <div className="mt-4">
              <ValueEditor value={draft.site} onChange={(next) => update((d) => { d.site = next as SiteInfo })} />
            </div>
          </section>
          <section key={contentKey} className="rounded-card border border-line bg-surface p-5">
            <h2 className="font-display text-[24px]">Teks {lang.toUpperCase()}</h2>
            <div className="mt-4">
              <ValueEditor value={draft[lang].ui} onChange={(next) => update((d) => { d[lang].ui = next as Content['ui'] })} />
            </div>
          </section>
        </div>
      )}

      {tab === 'projek' && (
        <div className="mt-6 flex flex-col gap-6">
          {draft.projects.map((project, index) => (
            <section key={project.slug} className="rounded-card border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] text-muted">Slug (URL)</span>
                    <input defaultValue={project.slug} onBlur={(event) => renameProject(index, event.target.value)} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] text-muted">Tahun</span>
                    <input value={project.year} onChange={(event) => update((d) => { d.projects[index].year = event.target.value })} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] text-muted">Warna latar</span>
                    <input value={project.tint} onChange={(event) => update((d) => { d.projects[index].tint = event.target.value })} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] text-muted">Ukuran kartu</span>
                    <select
                      value={project.size}
                      onChange={(event) => update((d) => { d.projects[index].size = event.target.value as ProjectMeta['size'] })}
                      className={fieldClass}
                    >
                      <option value="large">Besar</option>
                      <option value="small">Kecil</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[12px] text-muted">Link (opsional)</span>
                    <input value={project.link ?? ''} onChange={(event) => update((d) => { d.projects[index].link = event.target.value })} className={fieldClass} />
                  </label>
                </div>
                <button type="button" onClick={() => removeProject(index)} className="grid size-10 place-items-center rounded-control border border-line text-muted hover:border-accent hover:text-accent" aria-label="Hapus projek">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-4">
                <ImagePicker label="Gambar sampul" value={project.cover} onChange={(next) => update((d) => { d.projects[index].cover = next })} />
              </div>
              <div key={`${contentKey}-${project.slug}`} className="mt-6 grid gap-6 lg:grid-cols-2">
                {LANGS.map((item) => (
                  <div key={item.id}>
                    <p className="mb-2 text-[12px] uppercase tracking-[0.14em] text-faint">{item.label}</p>
                    <ValueEditor
                      value={draft[item.id].projects[project.slug] ?? { title: '', client: '', category: '', summary: '', role: [], deliverables: [], body: [] }}
                      onChange={(next) => update((d) => { d[item.id].projects[project.slug] = next as ProjectText })}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
          <button type="button" onClick={addProject} className={`${buttonClass} self-start`}>
            <Plus className="size-4" /> Tambah projek
          </button>
        </div>
      )}

      {tab === 'lainnya' && (
        <div key={contentKey} className="mt-6 grid gap-6 lg:grid-cols-2">
          {(['services', 'testimonials', 'experience', 'pepTalk'] as const).map((key) => (
            <section key={key} className="rounded-card border border-line bg-surface p-5">
              <h2 className="font-display text-[22px]">{humanize(key)}</h2>
              <div className="mt-4">
                <ValueEditor
                  value={draft[lang][key]}
                  onChange={(next) => update((d) => { (d[lang] as unknown as Record<string, unknown>)[key] = next })}
                />
              </div>
            </section>
          ))}
        </div>
      )}

      {tab === 'pesan' && <Messages />}
    </main>
  )
}

function Messages() {
  const [messages, setMessages] = useState<MessageRow[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    cmsFetch<{ messages: MessageRow[] }>('/api/messages')
      .then((data) => setMessages(data.messages))
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Gagal memuat pesan.'))
  }, [])

  useEffect(load, [load])

  return (
    <div className="mt-6">
      {error && <p className="text-[14px] text-accent">{error}</p>}
      {messages === null && !error && <p className="text-muted">Muat pesan…</p>}
      {messages?.length === 0 && <p className="text-muted">Belum ada pesan.</p>}
      <div className="flex flex-col gap-3">
        {messages?.map((message) => (
          <article key={message.id} className="rounded-card border border-line bg-surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[15px] font-medium">{message.name || 'Tanpa nama'}</p>
              <p className="text-[12px] tabular-nums text-faint">{new Date(message.created_at).toLocaleString('id-ID')}</p>
            </div>
            <a href={`mailto:${message.email}`} className="text-[13px] text-accent underline">{message.email}</a>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-muted">{message.message}</p>
            <button
              type="button"
              className={`${buttonClass} mt-4`}
              onClick={async () => {
                try {
                  await cmsFetch(`/api/messages/${message.id}`, { method: 'DELETE' })
                  setMessages((current) => current?.filter((item) => item.id !== message.id) ?? null)
                } catch (caught) {
                  setError(caught instanceof Error ? caught.message : 'Gagal menghapus.')
                }
              }}
            >
              <Trash2 className="size-3.5" /> Hapus
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

function CmsShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex min-h-[80svh] max-w-xl flex-col justify-center px-5 py-24">{children}</main>
}
