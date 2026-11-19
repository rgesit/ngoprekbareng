import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { site, type Lang } from '../../data/site'
import { cx } from '../lib/cx'
import { useSettings } from '../lib/settings'

const LANGS: Array<{ id: Lang; label: string }> = [
  { id: 'id', label: 'ID' },
  { id: 'en', label: 'EN' },
]

export function useLocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone }).format(new Date()))
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function Nav() {
  const time = useLocalTime()
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const { c, lang, setLang, theme, toggleTheme } = useSettings()

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 120)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const link = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cx(
          'link-draw text-[13px] transition-colors sm:text-[14px]',
          isActive || (to !== '/' && location.pathname.startsWith(to)) ? 'text-fg' : 'text-muted hover:text-fg',
        )
      }
    >
      {label}
    </NavLink>
  )

  return (
    <header className={cx('fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]', hidden && '-translate-y-full')}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-[15px] font-medium">{site.name}</span>
          <span className="hidden text-[12px] text-faint sm:inline">{site.handle}</span>
        </Link>
        <nav className="flex items-center gap-3.5 sm:gap-6">
          {link('/#karya', c.ui.navWork)}
          {link('/about', c.ui.navAbout)}
          <a href={`mailto:${site.email}`} className="link-draw text-[13px] text-muted transition-colors hover:text-fg sm:text-[14px]">
            {c.ui.navContact}
          </a>
          <span className="hidden text-[13px] tabular-nums text-faint md:inline">
            {site.location} {time}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? c.ui.themeToLight : c.ui.themeToDark}
              title={theme === 'dark' ? c.ui.themeToLight : c.ui.themeToDark}
              className="round grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <div className="round flex items-center gap-0.5 rounded-full border border-line p-0.5" role="group" aria-label={c.ui.langLabel}>
              {LANGS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLang(option.id)}
                  aria-pressed={lang === option.id}
                  className={cx(
                    'round rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors',
                    lang === option.id ? 'bg-accent text-bg' : 'text-muted hover:text-fg',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
