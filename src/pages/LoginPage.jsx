import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle, ShieldAlert } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import {
  sanitize,
  validateEmail,
  rateLimiter,
  getCSRFToken,
  AUTH_ERRORS,
  safeLog,
} from '../lib/security'

const TEXT = {
  pt: {
    title:      'Entrar na sua conta',
    subtitle:   'Acesse sua conta BRASILESPANA',
    email:      'E-mail',
    emailPh:    'seu@email.com',
    password:   'Senha',
    passwordPh: 'Sua senha',
    forgot:     'Esqueci minha senha',
    loginBtn:   'Entrar',
    or:         'ou',
    register:   'Criar conta gratuita',
    attemptsLeft: (n) => `${n} tentativa${n !== 1 ? 's' : ''} restante${n !== 1 ? 's' : ''}`,
    errors: {
      emailRequired:    'Informe seu e-mail',
      emailInvalid:     'E-mail inválido',
      passwordRequired: 'Informe sua senha',
      passwordMin:      'Mínimo 8 caracteres',
    },
  },
  es: {
    title:      'Entrar en tu cuenta',
    subtitle:   'Accede a tu cuenta BRASILESPANA',
    email:      'E-mail',
    emailPh:    'tu@email.com',
    password:   'Contraseña',
    passwordPh: 'Tu contraseña',
    forgot:     'Olvidé mi contraseña',
    loginBtn:   'Entrar',
    or:         'o',
    register:   'Crear cuenta gratis',
    attemptsLeft: (n) => `${n} intento${n !== 1 ? 's' : ''} restante${n !== 1 ? 's' : ''}`,
    errors: {
      emailRequired:    'Ingresa tu e-mail',
      emailInvalid:     'E-mail inválido',
      passwordRequired: 'Ingresa tu contraseña',
      passwordMin:      'Mínimo 8 caracteres',
    },
  },
}

export default function LoginPage() {
  const { lang }            = useLang()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [blocked, setBlocked]   = useState(false)
  const [blockMin, setBlockMin] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState(rateLimiter.getRemainingAttempts())

  const navigate  = useNavigate()
  const t         = TEXT[lang]
  const errs      = AUTH_ERRORS[lang]
  const csrfToken = getCSRFToken()

  /* Verificar bloqueio ao montar e a cada tick */
  useEffect(() => {
    const check = () => {
      const isBlocked = rateLimiter.isBlocked()
      setBlocked(isBlocked)
      setBlockMin(rateLimiter.getRemainingTime())
      setRemainingAttempts(rateLimiter.getRemainingAttempts())
    }
    check()
    const interval = setInterval(check, 10_000)
    return () => clearInterval(interval)
  }, [])

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: sanitize(val) }))
    setErrors(e => ({ ...e, [key]: '' }))
    setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.email)                   e.email    = t.errors.emailRequired
    else if (!validateEmail(form.email)) e.email    = t.errors.emailInvalid
    if (!form.password)                e.password = t.errors.passwordRequired
    else if (form.password.length < 8) e.password = t.errors.passwordMin
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()

    if (rateLimiter.isBlocked()) {
      setBlocked(true)
      setServerError(errs.accountLocked(rateLimiter.getRemainingTime()))
      return
    }

    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    setServerError('')

    try {
      safeLog('Login attempt', { email: form.email, csrf: csrfToken })

      /* ── Integrar com Supabase aqui ──
      const { data, error } = await supabase.auth.signInWithPassword({
        email:    form.email,
        password: form.password,
      })
      if (error) throw error
      rateLimiter.reset()
      navigate('/')
      ── */

      // Simulação: força erro para demonstrar rate limiting
      await new Promise(r => setTimeout(r, 900))
      throw new Error('INVALID_CREDENTIALS')

    } catch {
      // Registrar tentativa falha ANTES de mostrar erro
      rateLimiter.record()
      const remaining = rateLimiter.getRemainingAttempts()
      setRemainingAttempts(remaining)

      if (rateLimiter.isBlocked()) {
        setBlocked(true)
        setServerError(errs.accountLocked(rateLimiter.getRemainingTime()))
      } else {
        // Mensagem genérica — não revela se e-mail existe ou não
        setServerError(errs.invalidCredentials)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputBase = (key) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all
     focus:outline-none focus:ring-2
     ${errors[key]
       ? 'border-red-400 focus:ring-red-100 bg-red-50'
       : 'border-gray-200 focus:border-brand-green focus:ring-green-100'}`

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader lang={lang} backTo="/" />

      {/* Faixa tricolor */}
      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>

      {/* CSRF token oculto — referência para backend */}
      <input type="hidden" name="_csrf" value={csrfToken} readOnly />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg px-6 py-8">

            {/* Título */}
            <div className="text-center mb-7">
              <h1 className="text-xl font-black text-gray-900 mb-1">{t.title}</h1>
              <p className="text-sm text-gray-400">{t.subtitle}</p>
            </div>

            {/* Banner de bloqueio */}
            {blocked && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 mb-5">
                <ShieldAlert size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">
                    {lang === 'pt' ? 'Acesso bloqueado' : 'Acceso bloqueado'}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">{errs.accountLocked(blockMin)}</p>
                </div>
              </div>
            )}

            {/* Erro do servidor */}
            {serverError && !blocked && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder={t.emailPh}
                    disabled={blocked}
                    className={inputBase('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Senha */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t.password}</label>
                  <button
                    type="button"
                    className="text-xs font-medium hover:underline"
                    style={{ color: '#1A7A2E' }}
                  >
                    {t.forgot}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder={t.passwordPh}
                    disabled={blocked}
                    className={`${inputBase('password')} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Tentativas restantes */}
              {!blocked && remainingAttempts < 5 && remainingAttempts > 0 && (
                <p className="text-xs text-amber-600 text-center font-medium">
                  ⚠ {t.attemptsLeft(remainingAttempts)}
                </p>
              )}

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading || blocked}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                           font-bold text-white text-sm transition-all active:scale-95 mt-1
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#1A7A2E' }}
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <LogIn size={16} />}
                {t.loginBtn}
              </button>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">{t.or}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Criar conta */}
            <Link
              to="/cadastro"
              className="w-full flex items-center justify-center py-3.5 rounded-xl
                         border-2 font-bold text-sm transition-all hover:bg-gray-50 active:scale-95"
              style={{ borderColor: '#1A7A2E', color: '#1A7A2E' }}
            >
              {t.register}
            </Link>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
