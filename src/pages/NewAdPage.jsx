import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { sanitize } from '../lib/security'
import { addAd } from '../lib/moderation'

const CATEGORY_ID = {
  'Serviços': 'servicos', 'Servicios': 'servicos',
  'Produtos': 'produtos', 'Productos': 'produtos',
  'Desapego': 'desapego',
  'Doação': 'doacao', 'Donación': 'doacao',
  'Adoção': 'adocao-pets', 'Adopción': 'adocao-pets',
  'Vagas': 'vagas', 'Empleo': 'vagas',
  'Voluntariado': 'voluntariado',
  'Promoções': 'promocoes', 'Promociones': 'promocoes',
}

const CATEGORIES = {
  pt: ['Serviços', 'Produtos', 'Desapego', 'Doação', 'Adoção', 'Vagas', 'Voluntariado', 'Promoções'],
  es: ['Servicios', 'Productos', 'Desapego', 'Donación', 'Adopción', 'Empleo', 'Voluntariado', 'Promociones'],
}

const COMUNIDADES = {
  pt: ['Andaluzia','Aragão','Astúrias','Canárias','Cantábria','Castela-A Mancha','Castela e Leão',
       'Catalunha','Extremadura','Galiza','Ilhas Baleares','La Rioja','Madrid','Múrcia','Navarra',
       'País Basco','Valência'],
  es: ['Andalucía','Aragón','Asturias','Canarias','Cantabria','Castilla-La Mancha','Castilla y León',
       'Cataluña','Extremadura','Galicia','Islas Baleares','La Rioja','Madrid','Murcia','Navarra',
       'País Vasco','Valencia'],
}

const STEPS = {
  pt: ['Categoria', 'Detalhes', 'Localização', 'Confirmar'],
  es: ['Categoría', 'Detalles', 'Ubicación', 'Confirmar'],
}

export default function NewAdPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    contact: '',
    location: '',
    province: '',
    city: '',
    promo: false,
  })

  // Guard: só anunciante com KYC verificado pode acessar.
  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/entrar'); return }
    if (!supabase) {
      // Modo demo: diferencia pelo tipo de conta do cadastro
      if (user.user_metadata?.account_type !== 'advertiser') navigate('/assinatura')
      return
    }
    let cancelled = false
    supabase.from('profiles').select('account_type,kyc_status').eq('id', user.id).maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return
        if (data.account_type !== 'advertiser' || data.kyc_status !== 'verified') {
          navigate('/anunciante/verificacao')
        }
      })
    return () => { cancelled = true }
  }, [user, authLoading, navigate])

  const t = {
    pt: {
      title: 'Publicar Anúncio',
      back: 'Voltar',
      next: 'Próximo',
      submit: 'Publicar',
      selectCat: 'Escolha a categoria',
      adTitle: 'Título do anúncio',
      adDesc: 'Descrição',
      adPrice: 'Preço (opcional)',
      adContact: 'Contato (WhatsApp ou e-mail)',
      adLocation: 'Comunidade Autônoma',
      adProvince: 'Província',
      adCity: 'Cidade',
      confirm: 'Confirmar publicação',
      successTitle: 'Anúncio publicado!',
      successDesc: 'Seu anúncio foi enviado para revisão e será publicado em breve.',
      goHome: 'Voltar ao início',
      placeholders: {
        title: 'Ex: Eletricista disponível em Barcelona',
        desc: 'Descreva seu serviço, produto ou oportunidade...',
        price: 'Ex: €30/h ou Grátis',
        contact: '+34 600 000 000 ou email@exemplo.com',
      },
    },
    es: {
      title: 'Publicar Anuncio',
      back: 'Volver',
      next: 'Siguiente',
      submit: 'Publicar',
      selectCat: 'Elige la categoría',
      adTitle: 'Título del anuncio',
      adDesc: 'Descripción',
      adPrice: 'Precio (opcional)',
      adContact: 'Contacto (WhatsApp o e-mail)',
      adLocation: 'Comunidad Autónoma',
      adProvince: 'Provincia',
      adCity: 'Ciudad',
      confirm: 'Confirmar publicación',
      successTitle: '¡Anuncio publicado!',
      successDesc: 'Tu anuncio fue enviado a revisión y será publicado pronto.',
      goHome: 'Volver al inicio',
      placeholders: {
        title: 'Ej: Electricista disponible en Barcelona',
        desc: 'Describe tu servicio, producto u oportunidad...',
        price: 'Ej: €30/h o Gratis',
        contact: '+34 600 000 000 o email@ejemplo.com',
      },
    },
  }[lang]

  const cats = CATEGORIES[lang]
  const steps = STEPS[lang]

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: sanitize(val) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/entrar'); return }
    setSubmitting(true); setSubmitError('')

    try {
      if (supabase) {
        const { error } = await supabase.from('ads').insert({
          user_id:     user.id,
          category:    CATEGORY_ID[form.category] || form.category,
          title:       form.title,
          description: form.description,
          price:       form.price || null,
          contact:     form.contact,
          comunidade:  form.location,
          provincia:   form.province || null,
          municipio:   form.city,
          promo:       !!form.promo,
          status:      'pending',
        })
        if (error) throw error
      } else {
        await new Promise(r => setTimeout(r, 400))
        addAd({
          ownerEmail:  user.email,
          ownerName:   user.user_metadata?.full_name || user.email,
          category:    CATEGORY_ID[form.category] || form.category,
          title:       form.title,
          description: form.description,
          price:       form.price || '',
          contact:     form.contact,
          comunidade:  form.location,
          provincia:   form.province || '',
          municipio:   form.city,
          promo:       !!form.promo,
        })
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(lang === 'pt'
        ? 'Erro ao publicar. Tente novamente.'
        : 'Error al publicar. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-blue">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"
                 style={{ background: '#E8F5E9' }}>
              <CheckCircle size={40} style={{ color: '#1A7A2E' }} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{t.successTitle}</h2>
            <p className="text-gray-500 text-sm mb-8">{t.successDesc}</p>
            <button onClick={() => navigate('/')} className="btn-primary w-full">
              {t.goHome}
            </button>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-blue">
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
        {/* Back */}
        <button
          onClick={() => step === 0 ? navigate('/') : setStep(s => s - 1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors mb-6"
        >
          <ArrowLeft size={16} /> {t.back}
        </button>

        <h1 className="text-2xl font-black text-gray-900 mb-6">{t.title}</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i < step ? 'bg-brand-green text-white' : i === step ? 'bg-brand-green text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-brand-green' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-brand-green' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">
          {/* Step 0: Category */}
          {step === 0 && (
            <div>
              <h2 className="font-bold text-gray-800 mb-4">{t.selectCat}</h2>
              <div className="grid grid-cols-2 gap-3">
                {cats.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { updateForm('category', cat); setStep(1) }}
                    className={`p-4 rounded-2xl border-2 text-sm font-semibold text-left transition-all
                      ${form.category === cat
                        ? 'border-brand-green bg-green-50 text-brand-green'
                        : 'border-gray-200 hover:border-brand-green text-gray-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setStep(2) }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adTitle} *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => updateForm('title', e.target.value)}
                  placeholder={t.placeholders.title}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adDesc} *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  placeholder={t.placeholders.desc}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adPrice}</label>
                <input
                  value={form.price}
                  onChange={e => updateForm('price', e.target.value)}
                  placeholder={t.placeholders.price}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adContact} *</label>
                <input
                  required
                  value={form.contact}
                  onChange={e => updateForm('contact', e.target.value)}
                  placeholder={t.placeholders.contact}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>

              {/* Photo upload placeholder */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-green transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">{lang === 'pt' ? 'Adicionar fotos (opcional)' : 'Añadir fotos (opcional)'}</p>
              </div>

              <button type="submit" className="btn-primary w-full">{t.next}</button>
            </form>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setStep(3) }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adLocation} *</label>
                <select
                  required
                  value={form.location}
                  onChange={e => updateForm('location', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                >
                  <option value="">—</option>
                  {COMUNIDADES[lang].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adProvince}</label>
                <input
                  value={form.province}
                  onChange={e => updateForm('province', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.adCity} *</label>
                <input
                  required
                  value={form.city}
                  onChange={e => updateForm('city', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <button type="submit" className="btn-primary w-full">{t.next}</button>
            </form>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-gray-800 mb-4">{t.confirm}</h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: lang === 'pt' ? 'Categoria' : 'Categoría', val: form.category },
                  { label: lang === 'pt' ? 'Título' : 'Título', val: form.title },
                  { label: lang === 'pt' ? 'Preço' : 'Precio', val: form.price || '—' },
                  { label: lang === 'pt' ? 'Localização' : 'Ubicación', val: [form.city, form.location].filter(Boolean).join(', ') },
                  { label: lang === 'pt' ? 'Contato' : 'Contacto', val: form.contact },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-400 font-medium">{label}</span>
                    <span className="text-gray-800 font-semibold text-right max-w-[60%] truncate">{val}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 cursor-pointer select-none p-3 rounded-xl border border-gray-100 mb-4">
                <input type="checkbox" checked={!!form.promo}
                  onChange={e => setForm(f => ({ ...f, promo: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-yellow-500" />
                <span>
                  <span className="text-sm font-bold text-gray-800">
                    🏷️ {lang === 'pt' ? 'Marcar como Promoção' : 'Marcar como Promoción'}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {lang === 'pt'
                      ? 'Aparece destacado na categoria Promoções.'
                      : 'Aparece destacado en la categoría Promociones.'}
                  </span>
                </span>
              </label>
              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-3">
                  <AlertTriangle size={15} className="text-red-500" />
                  <p className="text-xs text-red-600">{submitError}</p>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60"
              >
                {submitting
                  ? (lang === 'pt' ? 'Publicando...' : 'Publicando...')
                  : t.submit}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
