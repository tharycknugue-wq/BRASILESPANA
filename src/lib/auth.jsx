import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

/* ──────────────────────────────────────────────────────────
   MODO DEMONSTRAÇÃO
   Quando o Supabase NÃO está configurado (.env.local ausente),
   a plataforma roda em modo demo: o "login" é simulado e
   guardado só no navegador, para revisar todas as telas.
   Nada é salvo num servidor.
────────────────────────────────────────────────────────── */
export const IS_DEMO = !supabase
const DEMO_KEY = 'be_demo_user'

function readDemoUser() {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function makeDemoUser({ email, full_name, username, whatsapp, account_type = 'free', lang = 'pt' }) {
  const safeEmail = email || 'demo@brasilespana.test'
  return {
    id: 'demo-user',
    email: safeEmail,
    user_metadata: {
      full_name: full_name || safeEmail.split('@')[0],
      username:  (username || safeEmail.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20),
      whatsapp:  whatsapp || '',
      account_type,
      lang,
    },
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      // Modo demo: recupera "sessão" fake do navegador
      setUser(readDemoUser())
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  /* Login simulado (só quando não há Supabase) */
  const signInDemo = (info = {}) => {
    const existing = readDemoUser()
    const u = existing || makeDemoUser(info)
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(u)) } catch { /* ignore */ }
    setUser(u)
    return u
  }

  /* Cria/atualiza o usuário demo a partir do cadastro */
  const setDemoUser = (info) => {
    const u = makeDemoUser(info)
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(u)) } catch { /* ignore */ }
    setUser(u)
    return u
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    } else {
      try { localStorage.removeItem(DEMO_KEY) } catch { /* ignore */ }
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInDemo, setDemoUser, isDemo: IS_DEMO }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
