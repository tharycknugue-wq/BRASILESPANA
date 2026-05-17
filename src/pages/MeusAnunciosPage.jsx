import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Plus, Edit, Trash2, Star, Zap, ShieldCheck, ShieldAlert, Clock,
  Store, ExternalLink, AlertCircle,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { listMine, effectiveStatus, statusLabel } from '../lib/moderation'

const TEXT = {
  pt: {
    title: 'Meus anúncios',
    subtitle: 'Publique e gerencie seus anúncios',
    loading: 'Carregando...',
    loginRequired: 'Faça login para acessar sua área de anunciante',
    goLogin: 'Ir para Entrar',
    notAdvTitle: 'Esta área é para Anunciantes',
    notAdvDesc: 'Você está no plano grátis — pode pesquisar e contatar anunciantes. Para publicar anúncios, vire Anunciante por 12,99 € / mês.',
    becomeAdv: 'Quero anunciar (12,99 €/mês)',
    accountFree: 'Plano Grátis',
    accountAdv: 'Anunciante',
    kycTitle: 'Verifique sua identidade',
    kycDesc: 'Para publicar anúncios, conclua a verificação de documentos.',
    kycBtn: 'Iniciar verificação',
    kycPending: 'Verificação em análise',
    kycPendingDesc: 'Recebemos seus documentos. Avisaremos por e-mail (até 48h úteis).',
    kycRejected: 'Verificação não aprovada',
    kycRejectedDesc: 'Revise seus documentos e envie novamente.',
    kycRetry: 'Reenviar documentos',
    subTitle: 'Assinatura necessária',
    subDesc: 'Ative sua assinatura de Anunciante (12,99 €/mês) para publicar.',
    subBtn: 'Ativar assinatura',
    subActive: 'Assinatura ativa',
    newAd: 'Novo anúncio',
    yourAds: 'Seus anúncios',
    noAds: 'Você ainda não publicou nenhum anúncio.',
    editAdvProfile: 'Editar perfil de anunciante',
    viewPublic: 'Ver página pública',
    edit: 'Editar',
    delete: 'Remover',
    confirmDelete: 'Tem certeza? Esta ação não pode ser desfeita.',
    status: { active: 'Ativo', pending: 'Em revisão', expired: 'Expirado', removed: 'Removido' },
    readyTitle: 'Tudo pronto para publicar',
    readyDesc: 'Sua conta está verificada e a assinatura está ativa.',
  },
  es: {
    title: 'Mis anuncios',
    subtitle: 'Publica y gestiona tus anuncios',
    loading: 'Cargando...',
    loginRequired: 'Inicia sesión para acceder a tu área de anunciante',
    goLogin: 'Ir a Entrar',
    notAdvTitle: 'Esta área es para Anunciantes',
    notAdvDesc: 'Estás en el plan gratis — puedes buscar y contactar anunciantes. Para publicar anuncios, hazte Anunciante por 12,99 € / mes.',
    becomeAdv: 'Quiero anunciar (12,99 €/mes)',
    accountFree: 'Plan Gratis',
    accountAdv: 'Anunciante',
    kycTitle: 'Verifica tu identidad',
    kycDesc: 'Para publicar anuncios, completa la verificación de documentos.',
    kycBtn: 'Iniciar verificación',
    kycPending: 'Verificación en análisis',
    kycPendingDesc: 'Hemos recibido tus documentos. Te avisaremos por e-mail (hasta 48h hábiles).',
    kycRejected: 'Verificación no aprobada',
    kycRejectedDesc: 'Revisa tus documentos y envíalos de nuevo.',
    kycRetry: 'Reenviar documentos',
    subTitle: 'Suscripción necesaria',
    subDesc: 'Activa tu suscripción de Anunciante (12,99 €/mes) para publicar.',
    subBtn: 'Activar suscripción',
    subActive: 'Suscripción activa',
    newAd: 'Nuevo anuncio',
    yourAds: 'Tus anuncios',
    noAds: 'Aún no has publicado ningún anuncio.',
    editAdvProfile: 'Editar perfil de anunciante',
    viewPublic: 'Ver página pública',
    edit: 'Editar',
    delete: 'Eliminar',
    confirmDelete: '¿Seguro? Esta acción no se puede deshacer.',
    status: { active: 'Activo', pending: 'En revisión', expired: 'Expirado', removed: 'Eliminado' },
    readyTitle: 'Todo listo para publicar',
    readyDesc: 'Tu cuenta está verificada y la suscripción está activa.',
  },
}

export default function MeusAnunciosPage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]

  const [profile, setProfile] = useState(null)
  const [ads, setAds] = useState([])
  const [subActive, setSubActive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user) { setLoading(false); return }
      if (!supabase) {
        setAds(listMine(user.email))
        setSubActive(false)
        setLoading(false)
        return
      }
      const [{ data: prof }, { data: adsData }, { data: sub }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('ads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle(),
      ])
      if (cancelled) return
      setProfile(prof || null)
      setAds(adsData || [])
      setSubActive(sub?.status === 'active')
      setLoading(false)
    }
    if (!authLoading) load()
    return () => { cancelled = true }
  }, [user, authLoading])

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return
    if (!supabase) return
    await supabase.from('ads').delete().eq('id', id)
    setAds(prev => prev.filter(a => a.id !== id))
  }

  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader back="/" />
      {children}
      <Footer />
    </div>
  )

  if (authLoading || loading) {
    return <Shell><main className="flex-1 flex items-center justify-center text-gray-500 text-sm">{t.loading}</main></Shell>
  }

  if (!user) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-xs">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-yellow-600" />
            </div>
            <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
            <Link to="/entrar" className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>
              {t.goLogin}
            </Link>
          </div>
        </main>
      </Shell>
    )
  }

  const meta = user.user_metadata || {}
  const isAdvertiser = (profile?.account_type || meta.account_type) === 'advertiser'

  // Plano grátis → convida a virar Anunciante
  if (!isAdvertiser) {
    return (
      <Shell>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FFF7DB' }}>
              <Store size={28} style={{ color: '#7B5E00' }} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{t.notAdvTitle}</h1>
            <p className="text-gray-500 text-sm mb-6">{t.notAdvDesc}</p>
            <button onClick={() => navigate('/assinatura')}
              className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: '#1A7A2E' }}>
              ★ {t.becomeAdv}
            </button>
          </div>
        </main>
      </Shell>
    )
  }

  const kycStatus = profile?.kyc_status || 'none'
  const kycVerified = kycStatus === 'verified'
  const isDemo = !supabase
  // No demo (sem backend p/ KYC/pagamento) o anunciante já pode publicar
  // para testar o fluxo + moderação; em produção exige KYC + assinatura.
  const canPublish = isDemo ? isAdvertiser : (isAdvertiser && kycVerified && subActive)

  return (
    <Shell>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: '#FFFDE7', color: '#7B5E00', border: '1px solid #F5C800' }}>
            <Star size={11} fill="#F5C800" /> {t.accountAdv}
          </span>
        </div>

        {/* KYC */}
        {!kycVerified && (
          <section className="rounded-3xl shadow-md p-5 mb-6 border-2"
            style={{
              background: kycStatus === 'rejected' ? '#FEF2F2' : kycStatus === 'pending' ? '#F0F9FF' : '#E8F5E9',
              borderColor: kycStatus === 'rejected' ? '#FCA5A5' : kycStatus === 'pending' ? '#93C5FD' : '#1A7A2E',
            }}>
            <div className="flex items-start gap-3">
              {kycStatus === 'rejected'
                ? <ShieldAlert size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
                : kycStatus === 'pending'
                  ? <Clock size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  : <ShieldCheck size={22} className="flex-shrink-0 mt-0.5" style={{ color: '#1A7A2E' }} />}
              <div className="flex-1">
                <h3 className="font-black text-base mb-0.5 text-gray-900">
                  {kycStatus === 'rejected' ? t.kycRejected : kycStatus === 'pending' ? t.kycPending : t.kycTitle}
                </h3>
                <p className="text-xs mb-3 text-gray-600">
                  {kycStatus === 'rejected'
                    ? (profile?.kyc_note || t.kycRejectedDesc)
                    : kycStatus === 'pending' ? t.kycPendingDesc : t.kycDesc}
                </p>
                {kycStatus !== 'pending' && (
                  <button onClick={() => navigate('/anunciante/verificacao')}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: '#1A7A2E' }}>
                    {kycStatus === 'rejected' ? t.kycRetry : t.kycBtn}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Assinatura */}
        {!subActive && (
          <section className="rounded-3xl shadow-md p-5 mb-6 text-white"
            style={{ background: 'linear-gradient(135deg, #F5C800 0%, #E5A800 100%)' }}>
            <div className="flex items-start gap-3">
              <Zap size={22} className="flex-shrink-0 mt-0.5" style={{ color: '#3a2a00' }} />
              <div className="flex-1">
                <h3 className="font-black text-base mb-0.5" style={{ color: '#3a2a00' }}>{t.subTitle}</h3>
                <p className="text-xs mb-3" style={{ color: '#3a2a00' }}>{t.subDesc}</p>
                <button onClick={() => navigate('/assinatura')}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white" style={{ color: '#1A7A2E' }}>
                  {t.subBtn}
                </button>
              </div>
            </div>
          </section>
        )}

        {canPublish && (
          <section className="rounded-3xl shadow-md p-5 mb-6 border-2"
            style={{ background: '#E8F5E9', borderColor: '#1A7A2E' }}>
            <div className="flex items-start gap-3">
              <ShieldCheck size={22} className="flex-shrink-0 mt-0.5" style={{ color: '#1A7A2E' }} />
              <div>
                <h3 className="font-black text-base mb-0.5 text-gray-900">{t.readyTitle}</h3>
                <p className="text-xs text-gray-600">{t.readyDesc}</p>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => navigate('/anunciante/perfil')}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-sm text-sm font-bold text-gray-700 hover:shadow-md transition-shadow">
            <Store size={16} style={{ color: '#1A7A2E' }} /> {t.editAdvProfile}
          </button>
          <button onClick={() => navigate(`/anunciante/${(profile?.username || meta.username || '').toLowerCase()}`)}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-sm text-sm font-bold text-gray-700 hover:shadow-md transition-shadow">
            <ExternalLink size={16} style={{ color: '#1A7A2E' }} /> {t.viewPublic}
          </button>
        </div>

        <section className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">{t.yourAds}</h2>
            <button
              onClick={() => navigate('/novo-anuncio')}
              disabled={!canPublish}
              title={!canPublish ? t.subTitle : ''}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#1A7A2E' }}>
              <Plus size={14} /> {t.newAd}
            </button>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">{t.noAds}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {ads.map(ad => (
                <li key={ad.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{ad.title}</p>
                    <p className="text-xs text-gray-400">
                      {isDemo ? statusLabel(effectiveStatus(ad), lang) : (t.status[ad.status] || ad.status)}
                      {isDemo && ad.flags?.length > 0 ? ` · ⚠ ${ad.flags.length}` : ''}
                    </p>
                  </div>
                  <Link to={`/anuncio/${ad.id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title={t.edit}>
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDelete(ad.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title={t.delete}>
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Shell>
  )
}
