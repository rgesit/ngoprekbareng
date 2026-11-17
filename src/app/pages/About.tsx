import { ArrowUpRight } from 'lucide-react'

import { experience, site } from '../../data/site'
import { Lines, Parallax, Reveal } from '../components/motion'

export function About() {
  return (
    <article className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
      <Lines as="h1" className="font-display text-balance text-[clamp(42px,7.5vw,108px)]" lines={['Builder, kreator,', 'kakak yang nyemangatin']} />
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
        <Reveal>
          <Parallax src="/images/portrait.jpg" alt={site.name} className="aspect-[3/4] rounded-image" strength={6} />
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-draw inline-flex items-center gap-1 text-muted hover:text-fg">
                  {s.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <div>
          <Reveal className="text-pretty text-[19px] leading-relaxed sm:text-[22px]">
            <p>
              Gue mulai dari rasa penasaran: kenapa satu website bisa bikin orang percaya sama sesuatu? Jawabannya bikin gue belajar ngoding sendiri sampai sekarang.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-muted">
            <p>
              Tiga tahun terakhir gue ngerjain situs buat sekolah, komunitas, dan projek pribadi. Kebanyakan dimulai dari masalah kecil: catatan yang hilang, jadwal yang kacau,
              temen yang mau belajar tapi gak tahu mulai dari mana.
            </p>
            <p>
              Yang gue percaya: kerja bagus itu hasil dari ngulang, bukan dari bakat yang turun dari langit. Versi pertama website ini jelek, dan itu bagian dari ceritanya.
            </p>
            <p>
              Buat Gen Alpha yang lagi mulai: lo boleh lambat, asal jangan berhenti. Buat Gen Beta yang bakal baca ini nanti: dunia lo bakal lebih cepat, tapi hal yang bikin lo
              berguna tetap sama — mau belajar, mau dengerin, dan mau bantu.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-16">
            <h2 className="text-[14px] text-muted">Perjalanan</h2>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {experience.map((e) => (
                <li key={e.title} className="grid gap-1 py-5 sm:grid-cols-[180px_1fr]">
                  <span className="text-[13px] tabular-nums text-accent">{e.period}</span>
                  <span>
                    <span className="block text-[16px] font-medium">{e.title}</span>
                    <span className="block text-[14.5px] text-muted">{e.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.2} className="mt-16 grid grid-cols-3 gap-6">
            {[
              ['3', 'tahun belajar sendiri'],
              ['6', 'projek selesai'],
              ['1', 'adik yang diajarin'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-[52px] leading-none text-accent sm:text-[72px]">{value}</p>
                <p className="mt-2 text-[14px] text-muted">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </article>
  )
}
