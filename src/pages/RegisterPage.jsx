import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Phone, CheckCircle, XCircle, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import {
  sanitize,
  validateEmail,
  validatePassword,
  maskPhone,
  getCSRFToken,
  AUTH_ERRORS,
  safeLog,
} from '../lib/security'

const TEXT = {
  pt: {
    title:     'Criar sua conta',
    subtitle:  'Junte-se à comunidade BRASILESPANA',
    name:      'Nome completo',
    namePh:    'Seu nome',
    email:     'E-mail',
    emailPh:   'seu@email.com',
    password:  'Senha',
    confirm:   'Confirmar senha',
    confirmPh: 'Repita a senha',
    whatsapp:  'WhatsApp (com código do país)',
    whatsappPh:'+34 600 000 000',
    terms:     'Aceito os ',
    termsLink: 'termos de uso e política de privacidade',
    submitBtn: 'Criar conta',
    hasAccount:'Já tenho conta — ',
    loginLink: 'Entrar',
    successTitle: 'Conta criada!',
    successDesc:  'Bem-vindo à comunidade! Agora você pode anunciar e encontrar o que precisa.',
    successBtn:   'Ir para o início',
    passwordRules: {
      length:    'Mínimo 8 caracteres',
      uppercase: '1 letra maiúscula',
      number:    '1 número',
      symbol:    '1 símbolo (!@#$...)',
    },
    errors: {
      nameRequired:    'Informe seu nome completo',
      nameTooShort:    'Nome muito curto (mínimo 3 caracteres)',
      emailRequired:   'Informe seu e-mail',
      emailInvalid:    'E-mail inválido',
      confirmRequired: 'Confirme sua senha',
      confirmMatch:    'As senhas não coincidem',
      whatsappRequired:'Informe seu WhatsApp',
      whatsappInvalid: 'Formato inválido. Ex: +34 600 000 000',
      termsRequired:   'Aceite os termos para continuar',
    },
  },
  es: {
    title:     'Crear tu cuenta',
    subtitle:  'Únete a la comunidad BRASILESPANA',
    name:      'Nombre completo',
    namePh:    'Tu nombre',
    email:     'E-mail',
    emailPh:   'tu@email.com',
    password:  'Contraseña',
    confirm:   'Confirmar contraseña',
    confirmPh: 'Repite la contraseña',
    whatsapp:  'WhatsApp (con código de país)',
    whatsappPh:'+34 600 000 000',
    terms:     'Acepto los ',
    termsLink: 'términos de uso y política de privacidad',
    submitBtn: 'Crear cuenta',
    hasAccount:'Ya tengo cuenta — ',
    loginLink: 'Entrar',
    successTitle: '¡Cuenta creada!',
    successDesc:  '¡Bienvenido a la comunidad! Ahora puedes anunciar y encontrar lo que necesitas.',
    successBtn:   'Ir al inicio',
    passwordRules: {
      length:    'Mínimo 8 caracteres',
      uppercase: '1 letra mayúscula',
      number:    '1 número',
      symbol:    '1 símbolo (!@#$...)',
    },
    errors: {
      nameRequired:    'Ingresa tu nombre completo',
      nameTooShort:    'Nombre muy corto (mínimo 3 caracteres)',
      emailRequired:   'Ingresa tu e-mail',
      emailInvalid:    'E-mail inválido',
      confirmRequired: 'Confirma tu contraseña',
      confirmMatch:    'Las contraseñas no coinciden',
      whatsappRequired:'Ingresa tu WhatsApp',
      whatsappInvalid: 'Formato inválido. Ej: +34 600 000 000',
      termsRequired:   'Acepta los términos para continuar',
    },
  },
}

/* Valida formato de WhatsApp/telefone internacional */
function validatePhone(phone) {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone)
}

/* Componente de regra de senha */
function PasswordRule({ met, label }) {
  return (
    <li className="flex items-center gap-1.5 text-xs transition-colors"
        style={{ color: met ? '#1A7A2E' : '#9ca3af' }}>
      {met
        ? <Check size={11} style={{ color: '#1A7A2E' }} />
        : <div className="w-2.5 h-2.5 rounded-full border border-gray-300" />}
      {label}
    </li>
  )
}

/* Componente de campo genérico */
function Field({ label, icon: Icon, error, touched, valid, children }) {
  const showSuccess = touched && valid && !error
  const showError   = touched && !!error
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
        {children}
        {showSuccess && <CheckCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#1A7A2E' }} />}
        {showError   && <XCircle    size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400" />}
      </div>
      {showError && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const [lang]              = useState('pt')
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [serverError, setServerError] = useState('')
  const [touched, setTouch]     = useState({})
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', whatsapp: '', terms: false,
  })

  const navigate  = useNavigate()
  const t         = TEXT[lang]
  const errs      = AUTH_ERRORS[lang]
  const csrfToken = getCSRFToken()
  const pwCheck   = validatePassword(form.password)

  /* Validação em tempo real por campo */
  const fieldErrors = {
    name:     !form.name.trim()                ? t.errors.nameRequired
              : form.name.trim().length < 3    ? t.errors.nameTooShort
              : '',
    email:    !form.email                      ? t.errors.emailRequired
              : !validateEmail(form.email)     ? t.errors.emailInvalid
              : '',
    password: !pwCheck.valid && form.password  ? '' : '',   // regras mostradas separadamente
    confirm:  !form.confirm                    ? t.errors.confirmRequired
              : form.confirm !== form.password ? t.errors.confirmMatch
              : '',
    whatsapp: !form.whatsapp.trim()            ? t.errors.whatsappRequired
              : !validatePhone(form.whatsapp)  ? t.errors.whatsappInvalid
              : '',
    terms:    !form.terms                      ? t.errors.termsRequired : '',
  }

  const isFormValid = Object.values(fieldErrors).every(e => !e) && pwCheck.valid && form.terms

  const update = (key, val) => {
    const clean = key === 'terms' ? val : sanitize(String(val))
    setForm(f => ({ ...f, [key]: clean }))
    setTouch(t => ({ ...t, [key]: true }))
    setServerError('')
  }

  const touch = (key) => setTouch(t => ({ ...t, [key]: true }))

  const inputClass = (key) => {
    const isTouched = touched[key]
    const hasError  = isTouched && fieldErrors[key]
    const isOk      = isTouched && !fieldErrors[key] && (key !== 'password' || pwCheck.valid)
    return `w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition-all
      focus:outline-none focus:ring-2
      ${hasError ? 'border-red-400 focus:ring-red-100 bg-red-50'
      : isOk     ? 'border-green-400 focus:ring-green-100 bg-green-50/30'
      :            'border-gray-200 focus:border-brand-green focus:ring-green-100'}`
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    // Marcar todos como tocados para mostrar erros
    setTouch({ name: true, email: true, password: true, confirm: true, whatsapp: true, terms: true })

    if (!isFormValid) return

    setLoading(true)
    setServerError('')

    try {
      // Log seguro — senha nunca aparece
      safeLog('Register attempt', { name: form.name, email: form.email, whatsapp: maskPhone(form.whatsapp) })

      /* ── Integrar com Supabase aqui ──
      const { data, error } = await supabase.auth.signUp({
        email:    form.email,
        password: form.password,
        options:  { data: { full_name: form.name, whatsapp: form.whatsapp } },
      })
      if (error) throw error
      ── */

      await new Promise(r => setTimeout(r, 1400))
      setSuccess(true)

    } catch {
      // Mensagem genérica — não revela detalhes do sistema
      setServerError(errs.emailInUse)
    } finally {
      setLoading(false)
    }
  }

  /* ── Tela de sucesso ── */
  if (success) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
        <PageHeader lang={lang} backTo="/" />
        <div className="flex w-full h-2">
          <div className="flex-1" style={{ background: '#1A7A2E' }} />
          <div className="flex-1" style={{ background: '#F5C800' }} />
          <div className="flex-1" style={{ background: '#CC1714' }} />
        </div>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-xs">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: '#E8F5E9' }}>
              <CheckCircle size={40} style={{ color: '#1A7A2E' }} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{t.successTitle}</h2>
            <p className="text-gray-400 text-sm mb-8">{t.successDesc}</p>
            <button onClick={() => navigate('/')}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
              style={{ background: '#1A7A2E' }}>
              {t.successBtn}
            </button>
          </div>
        </main>

        <Footer lang={lang} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader lang={lang} backTo="/" />

      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>

      <input type="hidden" name="_csrf" value={csrfToken} readOnly />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg px-6 py-8">

            <div className="text-center mb-7">
              <h1 className="text-xl font-black text-gray-900 mb-1">{t.title}</h1>
              <p className="text-sm text-gray-400">{t.subtitle}</p>
            </div>

            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                <XCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Nome */}
              <Field label={t.name} icon={User}
                     error={fieldErrors.name} touched={touched.name} valid={!fieldErrors.name}>
                <input type="text" autoComplete="name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  onBlur={() => touch('name')}
                  placeholder={t.namePh}
                  className={inputClass('name')} />
              </Field>

              {/* Email */}
              <Field label={t.email} icon={Mail}
                     error={fieldErrors.email} touched={touched.email} valid={!fieldErrors.email}>
                <input type="email" autoComplete="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  onBlur={() => touch('email')}
                  placeholder={t.emailPh}
                  className={inputClass('email')} />
              </Field>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.password}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    onBlur={() => touch('password')}
                    placeholder="••••••••"
                    className={`${inputClass('password')} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Regras de senha em tempo real */}
                {(touched.password || form.password) && (
                  <ul className="mt-2 space-y-1 pl-1">
                    <PasswordRule met={pwCheck.rules.length}    label={t.passwordRules.length}    />
                    <PasswordRule met={pwCheck.rules.uppercase} label={t.passwordRules.uppercase} />
                    <PasswordRule met={pwCheck.rules.number}    label={t.passwordRules.number}    />
                    <PasswordRule met={pwCheck.rules.symbol}    label={t.passwordRules.symbol}    />
                  </ul>
                )}
              </div>

              {/* Confirmar senha */}
              <Field label={t.confirm} icon={Lock}
                     error={fieldErrors.confirm} touched={touched.confirm} valid={!fieldErrors.confirm && !!form.confirm}>
                <input
                  type={showConf ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={e => update('confirm', e.target.value)}
                  onBlur={() => touch('confirm')}
                  placeholder={t.confirmPh}
                  className={`${inputClass('confirm')} pr-11`}
                />
                <button type="button" onClick={() => setShowConf(s => !s)}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </Field>

              {/* WhatsApp */}
              <Field label={t.whatsapp} icon={Phone}
                     error={fieldErrors.whatsapp} touched={touched.whatsapp} valid={!fieldErrors.whatsapp}>
                <input type="tel" autoComplete="tel"
                  value={form.whatsapp}
                  onChange={e => update('whatsapp', e.target.value)}
                  onBlur={() => touch('whatsapp')}
                  placeholder={t.whatsappPh}
                  className={inputClass('whatsapp')} />
              </Field>

              {/* Termos */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={form.terms}
                      onChange={e => update('terms', e.target.checked)}
                      className="sr-only" />
                    <div
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                      style={{
                        background:  form.terms ? '#1A7A2E' : 'white',
                        borderColor: touched.terms && !form.terms ? '#f87171'
                                   : form.terms ? '#1A7A2E' : '#d1d5db',
                      }}
                    >
                      {form.terms && (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 leading-snug">
                    {t.terms}
                    <span className="font-semibold underline" style={{ color: '#1A7A2E' }}>
                      {t.termsLink}
                    </span>
                  </span>
                </label>
                {touched.terms && fieldErrors.terms && (
                  <p className="text-xs text-red-500 mt-1 ml-8">{fieldErrors.terms}</p>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                           font-bold text-white text-sm transition-all active:scale-95 mt-1
                           disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#1A7A2E' }}
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : null}
                {t.submitBtn}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-5">
              {t.hasAccount}
              <Link to="/entrar" className="font-bold hover:underline" style={{ color: '#1A7A2E' }}>
                {t.loginLink}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
