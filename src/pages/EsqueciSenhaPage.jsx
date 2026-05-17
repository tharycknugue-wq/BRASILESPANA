import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Send, CheckCircle, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { sanitize, validateEmail, AUTH_ERRORS, safeLog } from '../lib/security'
import { supabase } from '../lib/supabase'

const TEXT = {
  pt: {
    title:    'Recuperar senha',
    subtitle: 'Enviaremos um link para o seu e-mail',
    email:    'E-mail',
    emailPh:  'seu@email.com',
    submit:   'Enviar link de recuperação',
    sending:  'Enviando...',
    successTitle: 'Verifique seu e-mail',
    successDesc:  'Enviamos um link de recuperação. O link expira em 1 hora.',
    backLogin: 'Voltar para Entrar',
    errors: {
      emailRequired: 'Informe seu e-mail',
      emailInvalid:  'E-mail inválido',
    },
  },
  es: {
    title:    'Recuperar contraseña',
    subtitle: 'Enviaremos un enlace a tu e-mail',
    email:    'E-mail',
    emailPh:  'tu@email.com',
    submit:   'Enviar enlace de recuperación',
    sending:  'Enviando...',
    successTitle: 'Revisa tu e-mail',
    successDesc:  'Te enviamos un enlace de recuperación. El enlace caduca en 1 hora.',
    backLogin: 'Volver a Entrar',
    errors: {
      emailRequired: 'Ingresa tu e-mail',
      emailInvalid:  'E-mail inválido',
    },
  },
}

export default function EsqueciSenhaPage() {
  const { lang } = useLang()
  const t        = TEXT[lang]
  const errs     = AUTH_ERRORS[lang]
  const [email, setEmail]       = useState('')
  const [error, setError]       = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!email)                     return setError(t.errors.emailRequired)
    if (!validateEmail(email))      return setError(t.errors.emailInvalid)

    setLoading(true); setServerError('')
    try {
      safeLog('Password reset request', { email })
      if (supabase) {
        const { error: e } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/entrar`,
        })
        if (e) throw e
      } else {
        await new Promise(r => setTimeout(r, 900))
      }
      setSent(true)
    } catch {
      setServerError(errs.generic)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
        <PageHeader showMenu={false} back="/entrar" />        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-xs">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: '#E8F5E9' }}>
              <CheckCircle size={40} style={{ color: '#1A7A2E' }} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{t.successTitle}</h2>
            <p className="text-gray-500 text-sm mb-8">{t.successDesc}</p>
            <Link to="/entrar"
              className="inline-block w-full py-3.5 rounded-xl font-bold text-white text-sm"
              style={{ background: '#1A7A2E' }}>
              {t.backLogin}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader showMenu={false} back="/entrar" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg px-6 py-8">
            <div className="text-center mb-7">
              <h1 className="text-xl font-black text-gray-900 mb-1">{t.title}</h1>
              <p className="text-sm text-gray-400">{t.subtitle}</p>
            </div>

            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(sanitize(e.target.value)); setError('') }}
                    placeholder={t.emailPh}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      error ? 'border-red-400 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-brand-green focus:ring-green-100'
                    }`}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-50"
                style={{ background: '#1A7A2E' }}
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Send size={15} />}
                {loading ? t.sending : t.submit}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
