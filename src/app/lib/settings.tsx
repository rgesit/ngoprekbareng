import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { content, type Content, type Lang } from '../../data/site'

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

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = content[lang].ui.docTitle
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  const value = useMemo<Settings>(
    () => ({ lang, setLang, theme, toggleTheme, c: content[lang] }),
    [lang, setLang, theme, toggleTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used inside SettingsProvider')
  return value
}
