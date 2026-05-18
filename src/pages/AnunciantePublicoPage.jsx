import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Store, Star, MapPin, Wallet, Truck, Tag, Share2, MessageSquare, Send, AlertCircle,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import DigitalCardModal from '../components/DigitalCardModal'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { sanitize } from '../lib/security'

const TEXT = {
  pt: {
    notFound: 'Anunciante não encontrado',
    notFoundDesc: 'Este perfil não existe ou ainda não foi verificado.',
    backHome: 'Voltar ao início',
    loading: 'Carregando...',
    ads: 'Anúncios',
    noAds: 'Nenhum anúncio ativo no momento.',
    payment: 'Formas de pagamento',
    delivery: 'Entrega',
    deliveryYes: 'Faz entrega',
    deliveryNo: 'Não faz entrega',
    radius: 'Raio', fee: 'Frete', eta: 'Prazo',
    promo: 'Em promoção',
    reviews: 'Avaliações',
    noReviews: 'Ainda sem avaliações.',
    leaveReview: 'Deixe sua avaliação',
    yourRating: 'Sua nota',
    comment: 'Comentário (opcional)',
    commentPh: 'Conte sua experiência...',
    send: 'Enviar avaliação',
    sending: 'Enviando...',
    sent: 'Avaliação enviada. Obrigado!',
    loginToReview: 'Entre para avaliar este anunciante.',
    goLogin: 'Entrar',
    ownProfile: 'Esta é a sua página pública.',
    share: 'Compartilhar',
    digitalCard: 'Cartão digital',
    methodCorreio: 'Correio', methodEntregador: 'Entregador', methodOutros: 'Outros',
    err: 'Erro ao enviar. Tente novamente.',
  },
  es: {
    notFound: 'Anunciante no encontrado',
    notFoundDesc: 'Este perfil no existe o aún no fue verificado.',
    backHome: 'Volver al inicio',
    loading: 'Cargando...',
    ads: 'Anuncios',
    noAds: 'Ningún anuncio activo por ahora.',
    payment: 'Formas de pago',
    delivery: 'Entrega',
    deliveryYes: 'Hace entrega',
    deliveryNo: 'No hace entrega',
    radius: 'Radio', fee: 'Envío', eta: 'Plazo',
    promo: 'En promoción',
    reviews: 'Valoraciones',
    noReviews: 'Aún sin valoraciones.',
    leaveReview: 'Deja tu valoración',
    yourRating: 'Tu nota',
    comment: 'Comentario (opcional)',
    commentPh: 'Cuenta tu experiencia...',
    send: 'Enviar valoración',
    sending: 'Enviando...',
    sent: '¡Valoración enviada. Gracias!',
    loginToReview: 'Inicia sesión para valorar a este anunciante.',
    goLogin: 'Entrar',
    ownProfile: 'Esta es tu página pública.',
    share: 'Compartir',
    digitalCard: 'Tarjeta digital',
    methodCorreio: 'Correo', methodEntregador: 'Mensajero', methodOutros: 'Otros',
    err: 'Error al enviar. Inténtalo de nuevo.',
  },
}

function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          className={i <= Math.round(value) ? 'text-amber-400' : 'text-gray-300'}
          fill={i <= Math.round(value) ? 'currentColor' : 'none'} />
      ))}
    </span>
  )
}

export default function AnunciantePublicoPage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user } = useAuth()
  const t = TEXT[lang]

  const [adv, setAdv] = useState(null)
  const [ads, setAds] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [sending, setSending] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')
  const [cardOpen, setCardOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabase) { setNotFound(true); setLoading(false); return }
      const { data, error } = await supabase.rpc('advertiser_by_username', { u: username })
      const row = Array.isArray(data) ? data[0] : data
      if (cancelled) return
      if (error || !row) { setNotFound(true); setLoading(false); return }
      setAdv(row)
      const [{ data: adsData }, { data: revData }] = await Promise.all([
        supabase.from('ads').select('*').eq('user_id', row.user_id).eq('status', 'active').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').eq('advertiser_id', row.user_id).order('created_at', { ascending: false }),
      ])
      if (cancelled) return
      setAds(adsData || [])
      setReviews(revData || [])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [username])

  const logoUrl = adv?.logo_path && supabase
    ? supabase.storage.from('avatars').getPublicUrl(adv.logo_path).data.publicUrl
    : null

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: adv?.display_name || `@${username}`, url }) } catch { /* cancel */ }
    } else {
      try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
    }
  }

  const submitReview = async () => {
    if (!user) { navigate('/entrar'); return }
    if (myRating < 1) return
    setSending(true); setReviewMsg('')
    try {
      if (supabase) {
        const { error } = await supabase.from('reviews').upsert({
          advertiser_id: adv.user_id,
          author_id: user.id,
          rating: myRating,
          comment: myComment || null,
        }, { onConflict: 'advertiser_id,author_id' })
        if (error) throw error
        const { data: revData } = await supabase.from('reviews')
          .select('*').eq('advertiser_id', adv.user_id).order('created_at', { ascending: false })
        setReviews(revData || [])
      }
      setReviewMsg(t.sent)
      setMyComment(''); setMyRating(0)
    } catch {
      setReviewMsg(t.err)
    } finally {
      setSending(false)
    }
  }

  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader />
      {children}
      <Footer />
    </div>
  )

  if (loading) return <Shell><main className="flex-1 flex items-center justify-center text-gray-500 text-sm">{t.loading}</main></Shell>

  if (notFound || !adv) {
    return (
      <Shell><main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">{t.notFound}</h1>
          <p className="text-gray-500 text-sm mb-6">{t.notFoundDesc}</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.backHome}</Link>
        </div>
      </main></Shell>
    )
  }

  const isOwner = user && user.id === adv.user_id
  const d = adv.delivery || {}
  const methodLabel = { methodCorreio: t.methodCorreio, methodEntregador: t.methodEntregador, methodOutros: t.methodOutros }[d.method] || d.method

  return (
    <Shell>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Cabeçalho do anunciante */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-5">
          <div className="h-20" style={{ background: 'linear-gradient(135deg, #1A7A2E 0%, #145c22 100%)' }} />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0 border-4 border-white">
                {logoUrl
                  ? <img src={logoUrl} alt={adv.display_name || username} className="w-full h-full object-cover" />
                  : <Store size={36} className="text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-xl font-black text-gray-900 truncate">{adv.display_name || `@${adv.username}`}</h1>
                <p className="text-xs text-gray-400">@{adv.username}</p>
              </div>
            </div>

            {adv.headline && <p className="text-sm font-semibold text-gray-700 mt-3">{adv.headline}</p>}

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
              {(adv.city || adv.province) && (
                <span className="flex items-center gap-1"><MapPin size={12} /> {[adv.city, adv.province].filter(Boolean).join(', ')}</span>
              )}
              <span className="flex items-center gap-1">
                <Stars value={adv.avg_rating} /> <span className="font-semibold text-gray-700">{Number(adv.avg_rating).toFixed(1)}</span>
                <span className="text-gray-400">({adv.review_count})</span>
              </span>
              {adv.promo_active && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                  <Tag size={11} /> {t.promo}
                </span>
              )}
            </div>

            {adv.bio && <p className="text-sm text-gray-600 leading-relaxed mt-3 whitespace-pre-line">{adv.bio}</p>}

            <div className="flex gap-2 mt-4">
              <button onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700">
                <Share2 size={13} /> {t.share}
              </button>
              <button onClick={() => setCardOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white"
                style={{ background: '#F5C800', color: '#3a2a00' }}>
                <Tag size={13} /> {t.digitalCard}
              </button>
              {isOwner && (
                <button onClick={() => navigate('/anunciante/perfil')}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#1A7A2E' }}>
                  {lang === 'pt' ? 'Editar perfil' : 'Editar perfil'}
                </button>
              )}
            </div>
            {isOwner && <p className="text-xs text-gray-400 mt-2">{t.ownProfile}</p>}
          </div>
        </div>

        {/* Pagamento + Entrega */}
        {(adv.payment_methods?.length > 0 || d.enabled !== undefined) && (
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {adv.payment_methods?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-2"><Wallet size={15} /> {t.payment}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {adv.payment_methods.map(p => (
                    <span key={p} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-brand-green">{p}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-800 mb-2"><Truck size={15} /> {t.delivery}</h3>
              {d.enabled ? (
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li className="font-semibold text-brand-green">{t.deliveryYes}{methodLabel ? ` · ${methodLabel}` : ''}</li>
                  {d.radius_km != null && <li>{t.radius}: {d.radius_km} km</li>}
                  {d.fee != null && <li>{t.fee}: €{d.fee}</li>}
                  {d.eta && <li>{t.eta}: {d.eta}</li>}
                </ul>
              ) : <p className="text-xs text-gray-400">{t.deliveryNo}</p>}
            </div>
          </div>
        )}

        {/* Anúncios do anunciante */}
        <h2 className="text-lg font-black text-gray-900 mb-3 px-1">{t.ads} ({ads.length})</h2>
        {ads.length === 0 ? (
          <p className="text-sm text-gray-400 mb-6 px-1">{t.noAds}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {ads.map(ad => (
              <div key={ad.id} onClick={() => navigate(`/anuncio/${ad.id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">{ad.title}</h3>
                  {ad.promo && <Tag size={13} className="text-amber-500 flex-shrink-0" />}
                </div>
                {ad.price && <span className="font-bold text-sm" style={{ color: '#1A7A2E' }}>{ad.price}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Avaliações */}
        <section className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">{t.reviews} ({adv.review_count})</h2>

          {!isOwner && (
            user ? (
              <div className="border border-gray-100 rounded-2xl p-4 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">{t.leaveReview}</p>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs text-gray-400 mr-2">{t.yourRating}:</span>
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} type="button" onClick={() => setMyRating(i)}>
                      <Star size={22} className={i <= myRating ? 'text-amber-400' : 'text-gray-300'} fill={i <= myRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <textarea rows={3} value={myComment} onChange={e => setMyComment(sanitize(e.target.value))}
                  placeholder={t.commentPh}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-y focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 mb-3" />
                {reviewMsg && <p className="text-xs mb-2 font-medium" style={{ color: reviewMsg === t.sent ? '#1A7A2E' : '#dc2626' }}>{reviewMsg}</p>}
                <button onClick={submitReview} disabled={sending || myRating < 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: '#1A7A2E' }}>
                  {sending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
                  {sending ? t.sending : t.send}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 border border-gray-100 rounded-2xl p-4 mb-5">
                <span className="flex items-center gap-2 text-sm text-gray-600"><AlertCircle size={15} className="text-amber-500" /> {t.loginToReview}</span>
                <Link to="/entrar" className="px-3 py-2 rounded-lg text-xs font-bold text-white flex-shrink-0" style={{ background: '#1A7A2E' }}>{t.goLogin}</Link>
              </div>
            )
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">{t.noReviews}</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map(r => (
                <li key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Stars value={r.rating} size={13} />
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'es-ES')}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-700 flex items-start gap-1.5"><MessageSquare size={13} className="text-gray-300 mt-0.5 flex-shrink-0" /> {r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <DigitalCardModal
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        advertiser={{
          username: adv.username,
          card_name: adv.card_name || '',
          display_name: adv.display_name,
          logoUrl,
          whatsapp:  adv.card_whatsapp || '',
          phone:     adv.card_phone || '',
          email:     adv.card_email || '',
          instagram: adv.card_instagram || '',
          facebook:  adv.card_facebook || '',
          linkPath: `/anunciante/${adv.username}`,
        }}
      />
    </Shell>
  )
}
