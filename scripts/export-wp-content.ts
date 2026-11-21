// Sumber tunggal konten tetap `src/data/site.ts`. Skrip ini mengekspornya ke
// dua bentuk yang dipakai tema WordPress:
//   - wordpress/content.json                    (dipakai seed.php untuk mengisi CMS)
//   - wordpress/theme/assalimi/inc/defaults.php (fallback kalau opsi kosong)

import { content, projectsFor, site, type Lang, type Project } from '../src/data/site'

const langs: Lang[] = ['id', 'en']

const projects = projectsFor('id').map((project: Project) => ({
  ...project,
  cover: project.cover.replace(/^\//, ''),
  id: content.id.projects[project.slug],
  en: content.en.projects[project.slug],
}))

const formOverrides: Record<Lang, { formNote: string; formDoneBody: string }> = {
  id: {
    formNote: 'Pesan lo masuk ke admin dan tersimpan di CMS. Boleh sertakan kontak biar gampang dibalas.',
    formDoneBody: 'Pesan lo udah masuk. Gue baca semua, biasanya dibalas dalam beberapa hari.',
  },
  en: {
    formNote: 'Your message goes to the admin and is saved in the CMS. Leave a contact so it is easy to reply.',
    formDoneBody: 'Your message is in. I read everything and usually reply within a few days.',
  },
}

const wpUi = (lang: Lang) => ({ ...content[lang].ui, ...formOverrides[lang] })

const payload = {
  identity: {
    name: site.name,
    handle: site.handle,
    location: site.location,
    timezone: site.timezone,
    email: site.email,
    available: site.available,
    socials: site.socials.map((s) => `${s.label}|${s.href}`),
  },
  projects,
  services: langs.map((lang) => ({ lang, items: content[lang].services })),
  testimonials: langs.map((lang) => ({ lang, items: content[lang].testimonials })),
  experience: langs.map((lang) => ({ lang, items: content[lang].experience })),
  pepTalk: langs.map((lang) => ({ lang, items: content[lang].pepTalk })),
  // Versi WordPress punya form kontak sungguhan (tersimpan + dikirim), jadi
  // catatan demo dari situs React diganti dengan teks yang sesuai.
  ui: { id: wpUi('id'), en: wpUi('en') },
}

await Bun.write('wordpress/content.json', `${JSON.stringify(payload, null, 2)}\n`)

const phpString = (value: string): string => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ')}'`

const dump = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(dump).join(', ')}]`
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, item]) => `${phpString(key)} => ${dump(item)}`)
    return `[${entries.join(', ')}]`
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  return phpString(String(value ?? ''))
}

const generated = `<?php
// Dibuat otomatis oleh scripts/export-wp-content.ts dari src/data/site.ts.
// Jangan diedit manual: ubah src/data/site.ts lalu jalankan \`bun run wp:export\`.
return [
  'shared' => ${dump(payload.identity)},
  'id' => ${dump(content.id.ui)},
  'en' => ${dump(content.en.ui)},
];
`

await Bun.write('wordpress/theme/assalimi/inc/defaults.php', generated)
console.log('wordpress/content.json + inc/defaults.php ditulis')
