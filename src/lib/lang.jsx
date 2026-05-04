import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext(null)

const STORAGE_KEY = 'brasilespana-lang'
const DEFAULT_LANG = 'pt'
const VALID = ['pt', 'es']

const HTML_LANG = { pt: 'pt-BR', es: 'es-ES' }

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANG
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (VALID.includes(stored)) return stored
    } catch { /* localStorage unavailable */ }
    return DEFAULT_LANG
  })

  const setLang = (next) => {
    if (!VALID.includes(next)) return
    setLangState(next)
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
  }

  const toggleLang = () => setLang(lang === 'pt' ? 'es' : 'pt')

  // Sync <html lang="..."> for accessibility / SEO
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang] || HTML_LANG.pt
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

// Page-level title sync. Pass an object { pt, es } and the document title
// updates whenever the user toggles language.
export function usePageTitle(titles) {
  const { lang } = useLang()
  useEffect(() => {
    if (titles && titles[lang]) document.title = titles[lang]
  }, [lang, titles])
}
