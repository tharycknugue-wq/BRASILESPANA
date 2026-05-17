import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Upload, X, Store, Truck, Wallet, Tag, CheckCircle, AlertTriangle, ExternalLink,
  CreditCard, MessageCircle, Phone, Mail, Instagram, Facebook,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { sanitize } from '../lib/security'

const TEXT = {
  pt: {
    back: 'Voltar',
    title: 'Meu perfil de anunciante',
    subtitle: 'Essas informações aparecem na sua página pública.',
    loginRequired: 'Entre para editar seu perfil.',
    goLogin: 'Ir para Entrar',
    needVerify: 'Conclua a verificação de anunciante primeiro.',
    goVerify: 'Ir para verificação',
    logo: 'Logo / foto',
    logoHint: 'JPG ou PNG · até 2 MB',
    changeLogo: 'Trocar imagem',
    displayName: 'Nome de exibição',
    displayNamePh: 'Ex: Padaria da Vila',
    headline: 'Frase curta',
    headlinePh: 'Ex: Pães e doces brasileiros em Madrid',
    bio: 'Apresentação',
    bioPh: 'Conte quem você é, o que oferece e seu diferencial...',
    payment: 'Formas de pagamento',
    paymentHint: 'Clique para adicionar ou digite a sua',
    paymentPh: 'Outra forma...',
    delivery: 'Entrega',
    doesDelivery: 'Você faz entrega?',
    yes: 'Sim', no: 'Não',
    method: 'Forma de entrega',
    methodCorreio: 'Correio',
    methodEntregador: 'Entregador',
    methodOutros: 'Outros',
    radius: 'Raio máximo (km)',
    fee: 'Valor do frete (€)',
    eta: 'Prazo de entrega',
    etaPh: 'Ex: 2 a 4 dias',
    promo: 'Ativar selo de Promoção',
    promoDesc: 'Seus anúncios aparecem destacados na categoria Promoções.',
    cardTitle: 'Contatos do cartão de visitas',
    cardDesc: 'Esses dados aparecem no seu cartão de visitas para o cliente entrar em contato.',
    cardName: 'Nome ou estabelecimento',
    cardNamePh: 'Ex: Padaria da Vila',
    cWhats: 'WhatsApp',
    cWhatsPh: '+34 600 000 000',
    cPhone: 'Telefone',
    cPhonePh: '+34 900 000 000',
    cEmail: 'E-mail',
    cEmailPh: 'contato@exemplo.com',
    cIg: 'Instagram',
    cIgPh: '@seu_perfil ou link',
    cFb: 'Facebook',
    cFbPh: 'Página ou link',
    save: 'Salvar perfil',
    saving: 'Salvando...',
    saved: 'Perfil salvo!',
    viewPublic: 'Ver minha página pública',
    err: 'Erro ao salvar. Tente novamente.',
    errImg: 'Imagem muito grande (máx. 2 MB).',
  },
  es: {
    back: 'Volver',
    title: 'Mi perfil de anunciante',
    subtitle: 'Esta información aparece en tu página pública.',
    loginRequired: 'Inicia sesión para editar tu perfil.',
    goLogin: 'Ir a Entrar',
    needVerify: 'Completa la verificación de anunciante primero.',
    goVerify: 'Ir a verificación',
    logo: 'Logo / foto',
    logoHint: 'JPG o PNG · hasta 2 MB',
    changeLogo: 'Cambiar imagen',
    displayName: 'Nombre para mostrar',
    displayNamePh: 'Ej: Panadería del Pueblo',
    headline: 'Frase corta',
    headlinePh: 'Ej: Panes y dulces brasileños en Madrid',
    bio: 'Presentación',
    bioPh: 'Cuenta quién eres, qué ofreces y tu diferencial...',
    payment: 'Formas de pago',
    paymentHint: 'Pulsa para añadir o escribe la tuya',
    paymentPh: 'Otra forma...',
    delivery: 'Entrega',
    doesDelivery: '¿Haces entrega?',
    yes: 'Sí', no: 'No',
    method: 'Forma de entrega',
    methodCorreio: 'Correo',
    methodEntregador: 'Mensajero',
    methodOutros: 'Otros',
    radius: 'Radio máximo (km)',
    fee: 'Coste de envío (€)',
    eta: 'Plazo de entrega',
    etaPh: 'Ej: 2 a 4 días',
    promo: 'Activar sello de Promoción',
    promoDesc: 'Tus anuncios aparecen destacados en la categoría Promociones.',
    cardTitle: 'Contactos de la tarjeta de visita',
    cardDesc: 'Estos datos aparecen en tu tarjeta de visita para que el cliente te contacte.',
    cardName: 'Nombre o establecimiento',
    cardNamePh: 'Ej: Panadería del Pueblo',
    cWhats: 'WhatsApp',
    cWhatsPh: '+34 600 000 000',
    cPhone: 'Teléfono',
    cPhonePh: '+34 900 000 000',
    cEmail: 'E-mail',
    cEmailPh: 'contacto@ejemplo.com',
    cIg: 'Instagram',
    cIgPh: '@tu_perfil o enlace',
    cFb: 'Facebook',
    cFbPh: 'Página o enlace',
    save: 'Guardar perfil',
    saving: 'Guardando...',
    saved: '¡Perfil guardado!',
    viewPublic: 'Ver mi página pública',
    err: 'Error al guardar. Inténtalo de nuevo.',
    errImg: 'Imagen demasiado grande (máx. 2 MB).',
  },
}

const PAY_SUGGESTIONS = ['Dinheiro', 'Transferência', 'Bizum', 'Cartão', 'PayPal']
const MAX_LOGO = 2 * 1024 * 1024

export default function EditarPerfilAnunciantePage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]

  const [profile, setProfile] = useState(null)
  const [loadingP, setLoadingP] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [form, setForm] = useState({
    display_name: '', headline: '', bio: '',
    payment_methods: [], promo_active: false,
    delivery_enabled: false, delivery_method: 'methodCorreio',
    delivery_radius: '', delivery_fee: '', delivery_eta: '',
    card_name: '', card_whatsapp: '', card_phone: '',
    card_email: '', card_instagram: '', card_facebook: '',
  })
  const [payInput, setPayInput] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user || !supabase) { setLoadingP(false); return }
      const [{ data: prof }, { data: ap }] = await Promise.all([
        supabase.from('profiles').select('account_type,kyc_status,full_name,username').eq('id', user.id).maybeSingle(),
        supabase.from('advertiser_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      ])
      if (cancelled) return
      setProfile(prof || null)
      if (ap) {
        const d = ap.delivery || {}
        setForm({
          display_name: ap.display_name || '',
          headline: ap.headline || '',
          bio: ap.bio || '',
          payment_methods: ap.payment_methods || [],
          promo_active: !!ap.promo_active,
          delivery_enabled: !!d.enabled,
          delivery_method: d.method || 'methodCorreio',
          delivery_radius: d.radius_km != null ? String(d.radius_km) : '',
          delivery_fee: d.fee != null ? String(d.fee) : '',
          delivery_eta: d.eta || '',
          card_name: ap.card_name || '',
          card_whatsapp: ap.card_whatsapp || '',
          card_phone: ap.card_phone || '',
          card_email: ap.card_email || '',
          card_instagram: ap.card_instagram || '',
          card_facebook: ap.card_facebook || '',
        })
        if (ap.logo_path) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(ap.logo_path)
          setLogoPreview(data.publicUrl)
        }
      } else if (prof) {
        setForm(f => ({ ...f, display_name: prof.full_name || '' }))
      }
      setLoadingP(false)
    }
    if (!authLoading) load()
    return () => { cancelled = true }
  }, [user, authLoading])

  const set = (k, v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? sanitize(v) : v }))

  const addPay = (val) => {
    const v = val.trim()
    if (!v || form.payment_methods.includes(v)) return
    setForm(f => ({ ...f, payment_methods: [...f.payment_methods, v] }))
    setPayInput('')
  }
  const removePay = (v) =>
    setForm(f => ({ ...f, payment_methods: f.payment_methods.filter(p => p !== v) }))

  const pickLogo = (file) => {
    if (file.size > MAX_LOGO) { setErr(t.errImg); return }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setErr('')
  }

  const handleSave = async () => {
    setSaving(true); setErr('')
    try {
      let logo_path = null
      if (supabase) {
        if (logoFile) {
          const ext = (logoFile.name.split('.').pop() || 'jpg').toLowerCase()
          logo_path = `${user.id}/logo.${ext}`
          const { error: upErr } = await supabase.storage.from('avatars').upload(logo_path, logoFile, { upsert: true })
          if (upErr) throw upErr
        }
        const payload = {
          user_id: user.id,
          display_name: form.display_name || null,
          headline: form.headline || null,
          bio: form.bio || null,
          payment_methods: form.payment_methods,
          promo_active: form.promo_active,
          card_name: form.card_name || null,
          card_whatsapp: form.card_whatsapp || null,
          card_phone: form.card_phone || null,
          card_email: form.card_email || null,
          card_instagram: form.card_instagram || null,
          card_facebook: form.card_facebook || null,
          delivery: form.delivery_enabled
            ? {
                enabled: true,
                method: form.delivery_method,
                radius_km: form.delivery_radius ? Number(form.delivery_radius) : null,
                fee: form.delivery_fee ? Number(form.delivery_fee) : null,
                eta: form.delivery_eta || null,
              }
            : { enabled: false },
          updated_at: new Date().toISOString(),
        }
        if (logo_path) payload.logo_path = logo_path
        const { error } = await supabase.from('advertiser_profiles').upsert(payload, { onConflict: 'user_id' })
        if (error) throw error
      } else {
        await new Promise(r => setTimeout(r, 700))
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setErr(t.err)
    } finally {
      setSaving(false)
    }
  }

  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader backTo="/painel" />
      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>
      {children}
      <Footer />
    </div>
  )

  if (authLoading || loadingP) {
    return <Shell><main className="flex-1 flex items-center justify-center text-gray-500 text-sm">…</main></Shell>
  }
  if (!user) {
    return <Shell><main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
        <button onClick={() => navigate('/entrar')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goLogin}</button>
      </div></main></Shell>
  }
  if (profile && (profile.account_type !== 'advertiser' || profile.kyc_status !== 'verified')) {
    return <Shell><main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <p className="text-gray-700 font-semibold mb-4">{t.needVerify}</p>
        <button onClick={() => navigate('/anunciante/verificacao')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goVerify}</button>
      </div></main></Shell>
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all'

  return (
    <Shell>
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
        <button onClick={() => navigate('/painel')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green mb-5">
          <ArrowLeft size={16} /> {t.back}
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Store size={22} style={{ color: '#1A7A2E' }} />
          <h1 className="text-2xl font-black text-gray-900">{t.title}</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">{t.subtitle}</p>

        {err && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
            <AlertTriangle size={15} className="text-red-500" />
            <p className="text-xs text-red-600">{err}</p>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-4">
            <CheckCircle size={15} className="text-green-600" />
            <p className="text-xs text-green-700">{t.saved}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-md space-y-5">
          {/* Logo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.logo}</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                {logoPreview
                  ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                  : <Store size={28} className="text-gray-300" />}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <Upload size={14} /> {t.changeLogo}
                </span>
                <input type="file" accept="image/jpeg,image/png" className="sr-only"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) pickLogo(f) }} />
                <p className="text-xs text-gray-400 mt-1">{t.logoHint}</p>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.displayName}</label>
            <input value={form.display_name} onChange={e => set('display_name', e.target.value)} placeholder={t.displayNamePh} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.headline}</label>
            <input value={form.headline} onChange={e => set('headline', e.target.value)} placeholder={t.headlinePh} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.bio}</label>
            <textarea rows={4} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder={t.bioPh} className={inputCls + ' resize-y'} />
          </div>

          {/* Pagamento */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <Wallet size={15} /> {t.payment}
            </label>
            <p className="text-xs text-gray-400 mb-2">{t.paymentHint}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {PAY_SUGGESTIONS.map(s => (
                <button key={s} type="button" onClick={() => addPay(s)}
                  disabled={form.payment_methods.includes(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-600 hover:border-brand-green disabled:opacity-40">
                  + {s}
                </button>
              ))}
            </div>
            {form.payment_methods.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.payment_methods.map(p => (
                  <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-brand-green">
                    {p}
                    <button type="button" onClick={() => removePay(p)} className="hover:text-red-500"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input value={payInput} onChange={e => setPayInput(sanitize(e.target.value))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPay(payInput) } }}
                placeholder={t.paymentPh} className={inputCls} />
              <button type="button" onClick={() => addPay(payInput)}
                className="px-4 rounded-xl text-sm font-bold text-white" style={{ background: '#1A7A2E' }}>+</button>
            </div>
          </div>

          {/* Entrega */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
              <Truck size={15} /> {t.delivery}
            </label>
            <div className="flex gap-2 mb-3">
              {[[true, t.yes], [false, t.no]].map(([val, label]) => (
                <button key={String(val)} type="button" onClick={() => set('delivery_enabled', val)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all
                    ${form.delivery_enabled === val ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-700 hover:border-brand-green'}`}>
                  {label}
                </button>
              ))}
            </div>
            {form.delivery_enabled && (
              <div className="space-y-3 border border-gray-100 rounded-xl p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[['methodCorreio', t.methodCorreio], ['methodEntregador', t.methodEntregador], ['methodOutros', t.methodOutros]].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => set('delivery_method', val)}
                      className={`px-2 py-2 rounded-xl border-2 text-xs font-bold transition-all
                        ${form.delivery_method === val ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-700'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min="0" value={form.delivery_radius} onChange={e => set('delivery_radius', e.target.value)} placeholder={t.radius} className={inputCls} />
                  <input type="number" min="0" step="0.01" value={form.delivery_fee} onChange={e => set('delivery_fee', e.target.value)} placeholder={t.fee} className={inputCls} />
                </div>
                <input value={form.delivery_eta} onChange={e => set('delivery_eta', e.target.value)} placeholder={t.eta + ' — ' + t.etaPh} className={inputCls} />
              </div>
            )}
          </div>

          {/* Promoção */}
          <label className="flex items-start gap-3 cursor-pointer select-none p-3 rounded-xl border border-gray-100">
            <input type="checkbox" checked={form.promo_active}
              onChange={e => set('promo_active', e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-yellow-500" />
            <span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-800"><Tag size={14} style={{ color: '#B8860B' }} /> {t.promo}</span>
              <span className="text-xs text-gray-500">{t.promoDesc}</span>
            </span>
          </label>

          {/* Contatos do cartão de visitas */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-1 mt-3">
              <CreditCard size={16} style={{ color: '#1A7A2E' }} />
              <h3 className="font-bold text-gray-800 text-sm">{t.cardTitle}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">{t.cardDesc}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t.cardName}</label>
                <input value={form.card_name} onChange={e => set('card_name', e.target.value)}
                  placeholder={t.cardNamePh} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1"><MessageCircle size={12} /> {t.cWhats}</label>
                  <input value={form.card_whatsapp} onChange={e => set('card_whatsapp', e.target.value)}
                    placeholder={t.cWhatsPh} className={inputCls} />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1"><Phone size={12} /> {t.cPhone}</label>
                  <input value={form.card_phone} onChange={e => set('card_phone', e.target.value)}
                    placeholder={t.cPhonePh} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1"><Mail size={12} /> {t.cEmail}</label>
                <input type="email" value={form.card_email} onChange={e => set('card_email', e.target.value)}
                  placeholder={t.cEmailPh} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1"><Instagram size={12} /> {t.cIg}</label>
                  <input value={form.card_instagram} onChange={e => set('card_instagram', e.target.value)}
                    placeholder={t.cIgPh} className={inputCls} />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1"><Facebook size={12} /> {t.cFb}</label>
                  <input value={form.card_facebook} onChange={e => set('card_facebook', e.target.value)}
                    placeholder={t.cFbPh} className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="btn-primary w-full disabled:opacity-60">
            {saving ? t.saving : t.save}
          </button>

          {profile && (
            <button
              onClick={() => navigate(`/anunciante/${(profile.username || '').toLowerCase()}`)}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-green hover:underline">
              <ExternalLink size={14} /> {t.viewPublic}
            </button>
          )}
        </div>
      </main>
    </Shell>
  )
}
