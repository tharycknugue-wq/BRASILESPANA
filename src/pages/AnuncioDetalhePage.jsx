import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, MessageCircle, Mail, Phone, Share2, Flag, Star } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { supabase } from '../lib/supabase'

const CATEGORY_META = {
  servicos:      { pt: 'Serviços',     es: 'Servicios',    icon: '🔧', color: '#1A7A2E', bg: '#E8F5E9' },
  produtos:      { pt: 'Produtos',     es: 'Productos',    icon: '📦', color: '#1565C0', bg: '#E3F2FD' },
  desapego:      { pt: 'Desapego',     es: 'Desapego',     icon: '♻️', color: '#6A1B9A', bg: '#F3E5F5' },
  doacao:        { pt: 'Doação',       es: 'Donación',     icon: '❤️', color: '#CC1714', bg: '#FFEBEE' },
  'adocao-pets': { pt: 'Adoção',       es: 'Adopción',     icon: '🐾', color: '#7B5E3C', bg: '#F5EBE0' },
  vagas:         { pt: 'Vagas',        es: 'Empleo',       icon: '💼', color: '#E65100', bg: '#FFF3E0' },
  voluntariado:  { pt: 'Voluntariado', es: 'Voluntariado', icon: '🤝', color: '#00695C', bg: '#E0F2F1' },
  promocoes:     { pt: 'Promoções',    es: 'Promociones',  icon: '🏷️', color: '#B8860B', bg: '#FFFDE7' },
}

const TEXT = {
  pt: {
    back: 'Voltar',
    description: 'Descrição',
    contact: 'Entrar em contato',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    phone: 'Telefone',
    share: 'Compartilhar',
    report: 'Denunciar',
    loading: 'Carregando anúncio...',
    notFound: 'Anúncio não encontrado',
    backHome: 'Voltar para o início',
    publishedAt: 'Publicado em',
    location: 'Localização',
    safety: 'Dicas de segurança',
    safetyTip: 'Encontre o anunciante em local público, verifique o produto antes de pagar e nunca envie dinheiro adiantado.',
  },
  es: {
    back: 'Volver',
    description: 'Descripción',
    contact: 'Contactar',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    phone: 'Teléfono',
    share: 'Compartir',
    report: 'Reportar',
    loading: 'Cargando anuncio...',
    notFound: 'Anuncio no encontrado',
    backHome: 'Volver al inicio',
    publishedAt: 'Publicado en',
    location: 'Ubicación',
    safety: 'Consejos de seguridad',
    safetyTip: 'Reúnete con el anunciante en lugar público, verifica el producto antes de pagar y nunca envíes dinero por adelantado.',
  },
}

export default function AnuncioDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
  const t = TEXT[lang]
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchAd() {
      if (!supabase) {
        setNotFound(true); setLoading(false); return
      }
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .maybeSingle()
      if (cancelled) return
      if (error || !data) setNotFound(true)
      else setAd(data)
      setLoading(false)
    }
    fetchAd()
    return () => { cancelled = true }
  }, [id])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: ad?.title || 'BRASILESPANA', url }) } catch { /* user canceled */ }
    } else {
      try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-blue">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin" />
            {t.loading}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound || !ad) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-blue">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{t.notFound}</h1>
            <Link to="/" className="inline-block mt-4 px-6 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: '#1A7A2E' }}>
              {t.backHome}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const meta = CATEGORY_META[ad.category] || CATEGORY_META.servicos
  const created = ad.created_at ? new Date(ad.created_at).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'es-ES') : ''
  const whatsappHref = ad.contact && /^\+?\d/.test(ad.contact)
    ? `https://wa.me/${ad.contact.replace(/\D/g, '')}`
    : null
  const emailHref = ad.contact && ad.contact.includes('@') ? `mailto:${ad.contact}` : null

  return (
    <div className="min-h-screen flex flex-col bg-brand-blue">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors mb-4"
        >
          <ArrowLeft size={16} /> {t.back}
        </button>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {ad.photos && ad.photos.length > 0 && (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img src={ad.photos[0]} alt={ad.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: meta.bg, color: meta.color }}>
                {meta.icon} {meta[lang]}
              </span>
              {ad.featured && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={10} fill="currentColor" /> {lang === 'pt' ? 'Destaque' : 'Destacado'}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-3">{ad.title}</h1>

            {ad.price && (
              <div className="text-2xl font-black mb-4" style={{ color: meta.color }}>
                {ad.price}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {[ad.municipio, ad.provincia, ad.comunidade].filter(Boolean).join(', ') || '—'}
              </span>
              {created && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {t.publishedAt} {created}
                </span>
              )}
            </div>

            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">{t.description}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
              {ad.description}
            </p>

            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">{t.contact}</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white text-sm"
                   style={{ background: '#25D366' }}>
                  <MessageCircle size={16} /> {t.whatsapp}
                </a>
              )}
              {emailHref && (
                <a href={emailHref}
                   className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white text-sm"
                   style={{ background: '#1A7A2E' }}>
                  <Mail size={16} /> {t.email}
                </a>
              )}
              {!whatsappHref && !emailHref && ad.contact && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700">
                  <Phone size={16} /> {ad.contact}
                </div>
              )}
            </div>

            <div className="flex gap-2 text-xs">
              <button onClick={handleShare}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-700 transition-colors">
                <Share2 size={13} /> {t.share}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-700 transition-colors">
                <Flag size={13} /> {t.report}
              </button>
            </div>
          </div>
        </div>

        <aside className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="font-bold text-amber-900 text-sm mb-1">⚠️ {t.safety}</h3>
          <p className="text-xs text-amber-800 leading-relaxed">{t.safetyTip}</p>
        </aside>
      </main>

      <Footer />
    </div>
  )
}
