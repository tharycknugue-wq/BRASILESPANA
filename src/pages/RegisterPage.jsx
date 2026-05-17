import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, AtSign, Mail, Lock, Eye, EyeOff, Phone, CheckCircle, XCircle, Check, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import {
  sanitize,
  validateEmail,
  validatePassword,
  maskPhone,
  getCSRFToken,
  AUTH_ERRORS,
  safeLog,
} from '../lib/security'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

const TEXT = {
  pt: {
    title:     'Criar sua conta',
    subtitle:  'Junte-se à comunidade BRASILESPANA',
    name:      'Nome completo',
    namePh:    'Seu nome',
    username:  'Nome de usuário',
    usernamePh:'usuario123',
    usernameHelp: 'Único, 3-20 caracteres. Letras minúsculas, números e _',
    email:     'E-mail',
    emailPh:   'seu@email.com',
    password:  'Senha',
    confirm:   'Confirmar senha',
    confirmPh: 'Repita a senha',
    whatsapp:  'WhatsApp (com código do país)',
    whatsappPh:'+34 600 000 000',
    terms:     'Aceito os ',
    submitFree:       'Criar conta grátis (só navegar)',
    submitAdvertiser: 'Quero anunciar (12,99 €/mês)',
    chooseTitle:      'Como você quer começar?',
    chooseFreeDesc:   'Navega, contata anunciantes e usa a comunidade. Pode virar Anunciante depois.',
    chooseAdvDesc:    'Tudo do plano grátis + publica seus anúncios em todas as categorias.',
    successTitleFree: 'Conta criada!',
    successTitleAdv:  'Conta criada — falta um passo',
    successDescConfirm: 'Enviamos um e-mail de confirmação para',
    successDescConfirm2: 'Clique no link para ativar sua conta.',
    successDescAdv:   'Depois de confirmar o e-mail, conclua a assinatura de 12,99 €/mês no seu painel.',
    successBtn:       'Ir para o início',
    hasAccount:'Já tenho conta — ',
    loginLink: 'Entrar',
    passwordRules: {
      length:    'Mínimo 8 caracteres',
      uppercase: '1 letra maiúscula',
      number:    '1 número',
      symbol:    '1 símbolo (!@#$...)',
    },
    errors: {
      nameRequired:     'Informe seu nome completo',
      nameTooShort:     'Nome muito curto (mínimo 3 caracteres)',
      usernameRequired: 'Escolha um nome de usuário',
      usernameFormat:   '3-20 caracteres, apenas letras minúsculas, números e _',
      usernameTaken:    'Esse nome de usuário já está em uso',
      emailRequired:    'Informe seu e-mail',
      emailInvalid:     'E-mail inválido',
      confirmRequired:  'Confirme sua senha',
      confirmMatch:     'As senhas não coincidem',
      whatsappRequired: 'Informe seu WhatsApp',
      whatsappInvalid:  'Formato inválido. Ex: +34 600 000 000',
      termsRequired:    'Aceite os termos para continuar',
    },
    usernameAvailable: 'Disponível',
    usernameChecking:  'Verificando...',
  },
  es: {
    title:     'Crear tu cuenta',
    subtitle:  'Únete a la comunidad BRASILESPANA',
    name:      'Nombre completo',
    namePh:    'Tu nombre',
    username:  'Nombre de usuario',
    usernamePh:'usuario123',
    usernameHelp: 'Único, 3-20 caracteres. Minúsculas, números y _',
    email:     'E-mail',
    emailPh:   'tu@email.com',
    password:  'Contraseña',
    confirm:   'Confirmar contraseña',
    confirmPh: 'Repite la contraseña',
    whatsapp:  'WhatsApp (con código de país)',
    whatsappPh:'+34 600 000 000',
    terms:     'Acepto los ',
    submitFree:       'Crear cuenta gratis (solo navegar)',
    submitAdvertiser: 'Quiero anunciar (12,99 €/mes)',
    chooseTitle:      '¿Cómo quieres empezar?',
    chooseFreeDesc:   'Navega, contacta anunciantes y usa la comunidad. Puedes pasar a Anunciante después.',
    chooseAdvDesc:    'Todo del plan gratis + publicas tus anuncios en todas las categorías.',
    successTitleFree: '¡Cuenta creada!',
    successTitleAdv:  'Cuenta creada — falta un paso',
    successDescConfirm: 'Enviamos un e-mail de confirmación a',
    successDescConfirm2: 'Haz clic en el enlace para activar tu cuenta.',
    successDescAdv:   'Tras confirmar el e-mail, completa la suscripción de 12,99 €/mes en tu panel.',
    successBtn:       'Ir al inicio',
    hasAccount:'Ya tengo cuenta — ',
    loginLink: 'Entrar',
    passwordRules: {
      length:    'Mínimo 8 caracteres',
      uppercase: '1 letra mayúscula',
      number:    '1 número',
      symbol:    '1 símbolo (!@#$...)',
    },
    errors: {
      nameRequired:     'Ingresa tu nombre completo',
      nameTooShort:     'Nombre muy corto (mínimo 3 caracteres)',
      usernameRequired: 'Elige un nombre de usuario',
      usernameFormat:   '3-20 caracteres, solo minúsculas, números y _',
      usernameTaken:    'Ese nombre de usuario ya está en uso',
      emailRequired:    'Ingresa tu e-mail',
      emailInvalid:     'E-mail inválido',
      confirmRequired:  'Confirma tu contraseña',
      confirmMatch:     'Las contraseñas no coinciden',
      whatsappRequired: 'Ingresa tu WhatsApp',
      whatsappInvalid:  'Formato inválido. Ej: +34 600 000 000',
      termsRequired:    'Acepta los términos para continuar',
    },
    usernameAvailable: 'Disponible',
    usernameChecking:  'Verificando...',
  },
}

const USERNAME_RE = /^[a-z0-9_]{3,20}$/

function validatePhone(phone) {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone)
}

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

function Field({ label, icon: Icon, error, touched, valid, hint, children }) {
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
      {hint && !showError && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {showError && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const { lang }            = useLang()
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [success, setSuccess]   = useState(null)
  const [serverError, setServerError] = useState('')
  const [touched, setTouch]     = useState({})
  const [usernameCheck, setUsernameCheck] = useState({ checking: false, available: null })
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', confirm: '', whatsapp: '', terms: false,
  })

  const { setDemoUser, isDemo } = useAuth()
  const navigate  = useNavigate()
  const t         = TEXT[lang]
  const errs      = AUTH_ERRORS[lang]
  const csrfToken = getCSRFToken()
  const pwCheck   = validatePassword(form.password)

  // Código de indicação vindo do link (?ref=usuario)
  const refCode = (() => {
    try {
      const r = new URLSearchParams(window.location.search).get('ref') || ''
      return r.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)
    } catch { return '' }
  })()

  // Checagem de disponibilidade do username com debounce
  useEffect(() => {
    if (!USERNAME_RE.test(form.username)) {
      setUsernameCheck({ checking: false, available: null })
      return
    }
    let cancelled = false
    setUsernameCheck({ checking: true, available: null })
    const id = setTimeout(async () => {
      try {
        if (!supabase) {
          if (!cancelled) setUsernameCheck({ checking: false, available: true })
          return
        }
        const { data, error } = await supabase.rpc('username_available', { u: form.username })
        if (cancelled) return
        if (error) setUsernameCheck({ checking: false, available: null })
        else setUsernameCheck({ checking: false, available: !!data })
      } catch {
        if (!cancelled) setUsernameCheck({ checking: false, available: null })
      }
    }, 500)
    return () => { cancelled = true; clearTimeout(id) }
  }, [form.username])

  const fieldErrors = {
    name:     !form.name.trim()                ? t.errors.nameRequired
              : form.name.trim().length < 3    ? t.errors.nameTooShort
              : '',
    username: !form.username                   ? t.errors.usernameRequired
              : !USERNAME_RE.test(form.username) ? t.errors.usernameFormat
              : usernameCheck.available === false ? t.errors.usernameTaken
              : '',
    email:    !form.email                      ? t.errors.emailRequired
              : !validateEmail(form.email)     ? t.errors.emailInvalid
              : '',
    password: !pwCheck.valid && form.password  ? '' : '',
    confirm:  !form.confirm                    ? t.errors.confirmRequired
              : form.confirm !== form.password ? t.errors.confirmMatch
              : '',
    whatsapp: !form.whatsapp.trim()            ? t.errors.whatsappRequired
              : !validatePhone(form.whatsapp)  ? t.errors.whatsappInvalid
              : '',
    terms:    !form.terms                      ? t.errors.termsRequired : '',
  }

  const isFormValid = Object.values(fieldErrors).every(e => !e)
                   && pwCheck.valid
                   && form.terms
                   && usernameCheck.available === true

  const update = (key, val) => {
    let clean
    if (key === 'terms')         clean = val
    else if (key === 'username') clean = sanitize(String(val)).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)
    else                         clean = sanitize(String(val))
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

  const submitWith = async (accountType, ev) => {
    ev.preventDefault()
    setTouch({ name: true, username: true, email: true, password: true, confirm: true, whatsapp: true, terms: true })

    if (!isFormValid) return

    setLoading(true); setLoadingPlan(accountType); setServerError('')

    try {
      safeLog('Register attempt', {
        name: form.name, username: form.username, email: form.email,
        whatsapp: maskPhone(form.whatsapp), accountType,
      })

      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email:    form.email,
          password: form.password,
          options:  {
            data: {
              full_name:    form.name,
              username:     form.username,
              whatsapp:     form.whatsapp,
              lang,
              account_type: accountType,
              ref:          refCode || undefined,
            },
            emailRedirectTo: `${window.location.origin}/entrar`,
          },
        })
        if (error) throw error
      } else {
        // Modo demonstração: guarda o usuário no navegador para revisar as telas
        await new Promise(r => setTimeout(r, 1000))
        setDemoUser({
          email: form.email,
          full_name: form.name,
          username: form.username,
          whatsapp: form.whatsapp,
          account_type: accountType,
          lang,
        })
      }
      setSuccess({ accountType, email: form.email })
    } catch {
      setServerError(errs.emailInUse)
    } finally {
      setLoading(false); setLoadingPlan(null)
    }
  }

  /* ── Tela de sucesso ── */
  if (success) {
    const isAdv = success.accountType === 'advertiser'
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
        <PageHeader backTo="/" />        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: '#E8F5E9' }}>
              <Mail size={36} style={{ color: '#1A7A2E' }} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {isAdv ? t.successTitleAdv : t.successTitleFree}
            </h2>
            <p className="text-gray-600 text-sm mb-1">{t.successDescConfirm}</p>
            <p className="font-bold text-gray-900 text-sm mb-3 break-all">{success.email}</p>
            <p className="text-gray-500 text-xs mb-5">{t.successDescConfirm2}</p>
            {isAdv && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                <p className="text-xs text-amber-800 leading-snug">{t.successDescAdv}</p>
              </div>
            )}
            <button onClick={() => navigate(success.email.trim().toLowerCase().endsWith('@fundador.com') ? '/fundador' : '/')}
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
      <PageHeader backTo="/" />

      <input type="hidden" name="_csrf" value={csrfToken} readOnly />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg px-6 py-8">

            <div className="text-center mb-7">
              <h1 className="text-xl font-black text-gray-900 mb-1">{t.title}</h1>
              <p className="text-sm text-gray-400">{t.subtitle}</p>
              {refCode && (
                <p className="mt-3 inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                   style={{ background: '#E8F5E9', color: '#1A7A2E' }}>
                  🎉 {lang === 'pt' ? 'Convidado por' : 'Invitado por'} <strong>@{refCode}</strong>
                </p>
              )}
            </div>

            {isDemo && (
              <div className="mb-5 p-3 rounded-xl text-xs leading-relaxed"
                   style={{ background: '#FFF7DB', border: '1px solid #F5C800', color: '#7B5E00' }}>
                <strong>🧪 {lang === 'pt' ? 'Modo demonstração' : 'Modo demostración'}</strong> — {lang === 'pt'
                  ? 'sem servidor. O cadastro é simulado só para revisar as telas; nada é salvo.'
                  : 'sin servidor. El registro es simulado solo para revisar las pantallas; no se guarda nada.'}
              </div>
            )}

            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                <XCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{serverError}</p>
              </div>
            )}

            <form noValidate className="flex flex-col gap-4">

              <Field label={t.name} icon={User}
                     error={fieldErrors.name} touched={touched.name} valid={!fieldErrors.name}>
                <input type="text" autoComplete="name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  onBlur={() => touch('name')}
                  placeholder={t.namePh}
                  className={inputClass('name')} />
              </Field>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.username}</label>
                <div className="relative">
                  <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input type="text" autoComplete="username"
                    value={form.username}
                    onChange={e => update('username', e.target.value)}
                    onBlur={() => touch('username')}
                    placeholder={t.usernamePh}
                    className={inputClass('username')} />
                  {usernameCheck.checking && (
                    <Loader2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                  )}
                  {!usernameCheck.checking && usernameCheck.available === true && !fieldErrors.username && (
                    <CheckCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#1A7A2E' }} />
                  )}
                  {!usernameCheck.checking && usernameCheck.available === false && (
                    <XCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                  )}
                </div>
                {touched.username && fieldErrors.username
                  ? <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>
                  : usernameCheck.checking
                    ? <p className="text-xs text-gray-400 mt-1">{t.usernameChecking}</p>
                    : usernameCheck.available === true
                      ? <p className="text-xs font-medium mt-1" style={{ color: '#1A7A2E' }}>✓ {t.usernameAvailable}</p>
                      : <p className="text-xs text-gray-400 mt-1">{t.usernameHelp}</p>}
              </div>

              <Field label={t.email} icon={Mail}
                     error={fieldErrors.email} touched={touched.email} valid={!fieldErrors.email}>
                <input type="email" autoComplete="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  onBlur={() => touch('email')}
                  placeholder={t.emailPh}
                  className={inputClass('email')} />
              </Field>

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

                {(touched.password || form.password) && (
                  <ul className="mt-2 space-y-1 pl-1">
                    <PasswordRule met={pwCheck.rules.length}    label={t.passwordRules.length}    />
                    <PasswordRule met={pwCheck.rules.uppercase} label={t.passwordRules.uppercase} />
                    <PasswordRule met={pwCheck.rules.number}    label={t.passwordRules.number}    />
                    <PasswordRule met={pwCheck.rules.symbol}    label={t.passwordRules.symbol}    />
                  </ul>
                )}
              </div>

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

              <Field label={t.whatsapp} icon={Phone}
                     error={fieldErrors.whatsapp} touched={touched.whatsapp} valid={!fieldErrors.whatsapp}>
                <input type="tel" autoComplete="tel"
                  value={form.whatsapp}
                  onChange={e => update('whatsapp', e.target.value)}
                  onBlur={() => touch('whatsapp')}
                  placeholder={t.whatsappPh}
                  className={inputClass('whatsapp')} />
              </Field>

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
                    <Link to="/termos" target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold underline" style={{ color: '#1A7A2E' }}>
                      {lang === 'pt' ? 'termos de uso' : 'términos de uso'}
                    </Link>
                    {lang === 'pt' ? ' e ' : ' y '}
                    <Link to="/privacidade" target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold underline" style={{ color: '#1A7A2E' }}>
                      {lang === 'pt' ? 'política de privacidade' : 'política de privacidad'}
                    </Link>
                  </span>
                </label>
                {touched.terms && fieldErrors.terms && (
                  <p className="text-xs text-red-500 mt-1 ml-8">{fieldErrors.terms}</p>
                )}
              </div>

              {/* Dois botões: Grátis (só navegar) ou Anunciante (12,99 €) */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">{t.chooseTitle}</p>

                <button
                  type="button"
                  onClick={(ev) => submitWith('free', ev)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             font-bold text-white text-sm transition-all active:scale-95
                             disabled:opacity-60 disabled:cursor-not-allowed mb-2"
                  style={{ background: '#1A7A2E' }}
                >
                  {loadingPlan === 'free'
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : null}
                  {t.submitFree}
                </button>
                <p className="text-xs text-gray-500 mb-3 px-1">{t.chooseFreeDesc}</p>

                <button
                  type="button"
                  onClick={(ev) => submitWith('advertiser', ev)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             font-bold text-sm transition-all active:scale-95 border-2
                             disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ borderColor: '#F5C800', background: '#FFFDE7', color: '#7B5E00' }}
                >
                  {loadingPlan === 'advertiser'
                    ? <span className="w-4 h-4 border-2 border-yellow-700/30 border-t-yellow-700 rounded-full animate-spin" />
                    : null}
                  ★ {t.submitAdvertiser}
                </button>
                <p className="text-xs text-gray-500 mt-1 px-1">{t.chooseAdvDesc}</p>
              </div>
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
