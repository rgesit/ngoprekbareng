import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { experience, pepTalk, projects, services, site, testimonials } from '../../data/site'
import { Lines, Magnetic, Parallax, Reveal } from '../components/motion'
import { WorkCard } from '../components/WorkCard'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

export function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <HeroField />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-10 pt-24 sm:px-8 sm:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="mb-7 flex flex-wrap items-center gap-2"
          >
            <span className="round inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
              <span className="round size-1.5 rounded-full bg-accent" aria-hidden />
              Portfolio + pep talk
            </span>
            <span className="round rounded-full border border-line px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
              {site.audience}
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(60px,13vw,200px)]">
            {site.name.split(' ').map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease }} className="mt-9 border-t border-line pt-6">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-lg">
                <p className="text-pretty text-[17px] leading-relaxed text-muted sm:text-[19px]">{site.intro}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-faint">
                  {site.role} · {site.handle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#karya"
                  className="round inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Lihat karya
                  <ArrowUpRight className="size-4" />
                </a>
                <a
                  href="#pep-talk"
                  className="round inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[15px] font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Baca pep talk
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-line py-5" aria-hidden>
        <ul className="font-display flex w-max animate-marquee items-center gap-10 whitespace-nowrap text-[28px] text-fg/60 sm:text-[36px]">
          {[...site.marquee, ...site.marquee].map((item, i) => (
            <li key={i} className="flex items-center gap-10">
              {item}
              <span className="round size-2 rounded-full bg-accent" />
            </li>
          ))}
        </ul>
      </div>

      {/* Kenapa site ini ada */}
      <section id="kenapa" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <Parallax src="/images/portrait.jpg" alt={site.name} className="aspect-[3/4] max-w-[460px] rounded-image" strength={6} />
          </Reveal>
          <div className="flex flex-col justify-center">
            <Lines
              as="h2"
              className="font-display text-balance text-[40px] sm:text-[56px] lg:text-[64px]"
              lines={['Kenapa site', 'ini ada']}
            />
            <Reveal delay={0.2} className="mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">
              <p>
                Gue bikin website sejak kelas sepuluh, dimulai dari laptop yang kipasnya berisik. Tiga tahun kemudian projek yang paling gue banggakan bukan yang paling keren
                secara desain — tapi yang bikin orang lain bisa ikut belajar.
              </p>
              <p className="mt-4">
                Jadi halaman ini dua fungsi: portfolio buat orang yang mau kerja bareng gue, dan pep talk buat Gen Alpha yang lagi mulai, plus Gen Beta yang belum lahir waktu
                gue nulis ini.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-8">
              <Link to="/about" className="link-draw inline-flex items-center gap-1.5 text-[15px] font-medium">
                Versi panjangnya
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Karya */}
      <section id="karya" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="flex items-end justify-between gap-6">
          <Lines as="h2" className="font-display text-[44px] sm:text-[64px]" lines={['Karya gue']} />
          <Reveal className="hidden pb-2 text-[13px] text-muted sm:block">{projects.length} projek, 2024 sampai sekarang</Reveal>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8 lg:gap-y-20">
          {projects.map((p, i) => (
            <WorkCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* Level up */}
      <section id="level-up" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-28 sm:px-8 sm:pt-40">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <Lines as="h2" className="font-display text-[40px] sm:text-[56px]" lines={['Level up']} />
            <Reveal delay={0.1} className="mt-5 max-w-sm text-[16px] leading-relaxed text-muted">
              Rank gue naik bukan karena sekali viral. Ini tiga level yang beneran gue lewatin, lengkap sama bagian gagalnya.
            </Reveal>
          </div>
          <ol className="border-t border-line">
            {experience.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.06}>
                <li className="grid gap-2 border-b border-line py-7 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6">
                  <span className="text-[12px] uppercase tracking-[0.14em] tabular-nums text-accent">{e.period}</span>
                  <span>
                    <span className="font-display block text-[28px] sm:text-[36px]">
                      <span className="mr-2 text-[13px] tabular-nums text-faint">0{i + 1}</span>
                      {e.title}
                    </span>
                    <span className="mt-1.5 block text-[15px] text-muted">{e.detail}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Skill */}
      <section id="skill" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-28 sm:px-8 sm:pt-40">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <Lines as="h2" className="font-display text-[40px] sm:text-[56px]" lines={['Skill gue']} />
            <Reveal delay={0.1} className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
              Empat hal, dikerjain sampai bener. Kebanyakan projek pakai dua di antaranya.
            </Reveal>
          </div>
          <Services />
        </div>
      </section>

      {/* Pep talk */}
      <section id="pep-talk" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-28 sm:px-8 sm:pt-40">
        <Lines as="h2" className="font-display text-balance text-[44px] sm:text-[64px]" lines={['Pep talk', 'buat dua generasi']} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {pepTalk.map((p, i) => (
            <Reveal key={p.tag} delay={i * 0.08}>
              <article
                className={cx(
                  'flex h-full flex-col rounded-[28px] border p-7 sm:p-9',
                  i === 0 ? 'border-accent/40 bg-accent/[0.06]' : 'border-line bg-surface',
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">{p.tag}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-faint">{p.age}</p>
                <h3 className="font-display mt-6 text-[36px] sm:text-[46px]">{p.title}</h3>
                <p className="mt-4 text-pretty text-[16px] leading-relaxed text-muted">{p.body}</p>
                <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[15px] leading-relaxed">
                  {p.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="round mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span className="text-fg/85">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kata mereka */}
      <section className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-40">
        <Testimonials />
      </section>
    </>
  )
}

// Colour fields behind the hero: acid lime, magenta, electric blue and violet,
// drifting slowly on black. The grain keeps it from reading as a flat gradient.
function HeroField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent_96%)]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, ease }} className="absolute inset-0">
        <div className="round absolute -top-[25%] right-[-12%] h-[95%] w-[70%] animate-drift-a rounded-full bg-[radial-gradient(closest-side,rgb(204_255_47/0.34),transparent)] blur-3xl" />
        <div className="round absolute -top-[10%] left-[-12%] h-[80%] w-[62%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(255_79_216/0.3),transparent)] blur-3xl" />
        <div className="round absolute top-[22%] left-[32%] h-[70%] w-[56%] animate-drift-c rounded-full bg-[radial-gradient(closest-side,rgb(74_120_255/0.34),transparent)] blur-3xl" />
        <div className="round absolute top-[45%] right-[12%] h-[50%] w-[40%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(150_90_255/0.28),transparent)] blur-3xl" />
      </motion.div>
      <div className="grain absolute inset-0" />
    </div>
  )
}

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="border-t border-line">
      {services.map((s, i) => {
        const isOpen = open === i
        return (
          <li key={s.title} className="border-b border-line">
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)} className="group flex w-full items-center gap-6 py-7 text-left">
              <span className="w-10 shrink-0 text-[14px] tabular-nums text-faint">0{i + 1}</span>
              <span className={cx('font-display flex-1 text-[30px] transition-colors sm:text-[42px]', isOpen ? 'text-fg' : 'text-fg/60 group-hover:text-fg')}>{s.title}</span>
              <span
                className={cx(
                  'grid size-10 shrink-0 place-items-center rounded-[12px] border border-line-strong transition-colors duration-300',
                  isOpen && 'border-accent bg-accent text-bg',
                )}
              >
                <Plus className={cx('size-4 transition-transform duration-500', isOpen && 'rotate-45')} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                  <p className="max-w-xl pb-8 pl-16 text-pretty text-[16px] leading-relaxed text-muted">{s.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

function Testimonials() {
  const [index, setIndex] = useState(0)
  const t = testimonials[index]
  return (
    <div className="rounded-[32px] bg-accent px-6 py-14 text-bg sm:px-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.blockquote key={index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
            <p className="font-display text-balance text-[30px] leading-[1.08] sm:text-[44px]">“{t.quote}”</p>
            <footer className="mt-8 text-[15px] text-bg/60">
              <span className="text-bg">{t.name}</span>, {t.role}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
        <div className="mt-10 flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Pep talk ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cx('h-1.5 rounded-[3px] transition-all duration-500', i === index ? 'w-10 bg-bg' : 'w-4 bg-bg/30 hover:bg-bg/50')}
            />
          ))}
          <Magnetic className="ml-auto">
            <button
              type="button"
              onClick={() => setIndex((index + 1) % testimonials.length)}
              className="grid size-12 place-items-center rounded-[14px] border border-bg/20 transition-colors hover:bg-bg hover:text-accent"
              aria-label="Berikutnya"
            >
              <ArrowUpRight className="size-4 rotate-45" />
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  )
}
