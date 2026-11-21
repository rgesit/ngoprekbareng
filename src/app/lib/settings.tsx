import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { Content, Lang, Project } from '../../data/site'
import {
  mergedContent,
  mergedProjects,
  mergedSite,
  portraitFor,
  type ContentOverrides,
  type SiteInfo,
} from '../../data/overrides'
import { cmsFetch, cmsOrigin } from './api'

export type Theme = 'dark' | 'light'

const LANG_KEY = 'lang'
const THEME_KEY = 'theme'
const THEME_COLOR = { dark: '#0b0b0f', light: '#f6f5f1' } as const

interface Settings {
  lang: Lang
  setLang: (lang: Lang) => void
  theme: Theme
  toggleTheme: () => void
  c: Content
  site: SiteInfo
  projects: Project[]
  portrait: string
  overrides: ContentOverrides | null
  reload: () => Promise<void>
}

const SettingsContext = createContext<Settings | null>(null)

function storedLang(): Lang {
  const value = window.localStorage.getItem(LANG_KEY)
  return value === 'en' ? 'en' : 'id'
}

function storedTheme(): Theme {
  const value = window.localStorage.getItem(THEME_KEY)
  if (value === 'light' || value === 'dark') return value
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (typeof window === 'undefined' ? 'id' : storedLang()))
  const [theme, setTheme] = useState<Theme>(() => (typeof window === 'undefined' ? 'dark' : storedTheme()))
  const [overrides, setOverrides] = useState<ContentOverrides | null>(null)

  const reload = useCallback(async () => {
    try {
      const data = await cmsFetch<ContentOverrides>('/api/content')
      setOverrides(data && typeof data === 'object' ? data : null)
    } catch {
      // CMS belum di-deploy atau offline: pakai konten default di site.ts.
      setOverrides(null)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(LANG_KEY, next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem(THEME_KEY, next)
      return next
    })
  }, [])

  const site = useMemo(() => mergedSite(overrides), [overrides])
  const content = useMemo(() => mergedContent(lang, overrides), [lang, overrides])
  const projects = useMemo(() => mergedProjects(lang, overrides), [lang, overrides])
  const portrait = useMemo(() => portraitFor(overrides, cmsOrigin), [overrides])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = content.ui.docTitle
  }, [lang, content.ui.docTitle])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  const value = useMemo<Settings>(
    () => ({ lang, setLang, theme, toggleTheme, c: content, site, projects, portrait, overrides, reload }),
    [lang, setLang, theme, toggleTheme, content, site, projects, portrait, overrides, reload],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used inside SettingsProvider')
  return value
}
