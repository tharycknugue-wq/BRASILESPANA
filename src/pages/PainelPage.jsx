import { useEffect, useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { Plus, LogOut, Edit, Trash2, Mail, Phone, AlertCircle, AtSign, Star, Zap, ShieldCheck, ShieldAlert, Clock, Store, ExternalLink } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder } from '../lib/founders'
import { supabase } from '../lib/supabase'

const TEXT = {
  pt: {
    title: 'Meu painel',
    subtitle: 'Gerencie seus anúncios e dados',
    welcome: 'Olá',
    yourAds: 'Seus anúncios',
    noAds: 'Você ainda não publicou nenhum anúncio',
    noAdsFree: 'Você está no plano grátis. Para publicar anúncios, vire Anunciante.',
    newAd: 'Novo anúncio',
    profile: 'Seus dados',
    username: 'Usuário',
    name: 'Nome',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    signOut: 'Sair da conta',
    loginRequired: 'Faça login para acessar seu painel',
    goLogin: 'Ir para Entrar',
    edit: 'Editar',
    delete: 'Remover',
    confirmDelete: 'Tem certeza? Esta ação não pode ser desfeita.',
    status: { active: 'Ativo', pending: 'Em revisão', expired: 'Expirado', removed: 'Removido' },
    loading: 'Carregando...',
    accountFree: 'Plano Grátis',
    accountAdv: 'Anunciante',
    upgradeTitle: 'Virar Anunciante',
    upgradeDesc: 'Publique seus anúncios em todas as categorias por 12,99 € / mês.',
    upgradeBtn: 'Assinar plano (12,99 €/mês)',
    kycTitle: 'Verifique sua identidade',
    kycDesc: 'Para publicar anúncios, conclua a verificação de documentos.',
    kycBtn: 'Iniciar verificação',
    kycPending: 'Verificação em análise',
    kycPendingDesc: 'Recebemos seus documentos. Avisaremos por e-mail (até 48h úteis).',
    kycRejected: 'Verificação não aprovada',
    kycRejectedDesc: 'Revise seus documentos e envie novamente.',
    kycRetry: 'Reenviar documentos',
    editAdvProfile: 'Editar perfil de anunciante',
    viewPublic: 'Ver página pública',
    dangerTitle: 'Zona de risco',
    deleteAccount: 'Excluir minha conta e dados',
    deleteConfirm: 'Tem certeza? Isso apaga seus anúncios, perfil e documentos. Esta ação é irreversível.',
    deleteDone: 'Conta e dados excluídos. A remoção é finalizada em até 30 dias conforme a Política de Privacidade.',
    deleting: 'Excluindo...',
  },
  es: {
    title: 'Mi panel',
    subtitle: 'Gestiona tus anuncios y datos',
    welcome: 'Hola',
    yourAds: 'Tus anuncios',
    noAds: 'Aún no has publicado ningún anuncio',
    noAdsFree: 'Estás en el plan gratis. Para publicar anuncios, hazte Anunciante.',
    newAd: 'Nuevo anuncio',
    profile: 'Tus datos',
    username: 'Usuario',
    name: 'Nombre',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    signOut: 'Cerrar sesión',
    loginRequired: 'Inicia sesión para acceder a tu panel',
    goLogin: 'Ir a Entrar',
    edit: 'Editar',
    delete: 'Eliminar',
    confirmDelete: '¿Seguro? Esta acción no se puede deshacer.',
    status: { active: 'Activo', pending: 'En revisión', expired: 'Expirado', removed: 'Eliminado' },
    loading: 'Cargando...',
    accountFree: 'Plan Gratis',
    accountAdv: 'Anunciante',
    upgradeTitle: 'Hazte Anunciante',
    upgradeDesc: 'Publica tus anuncios en todas las categorías por 12,99 € / mes.',
    upgradeBtn: 'Suscribirse (12,99 €/mes)',
    kycTitle: 'Verifica tu identidad',
    kycDesc: 'Para publicar anuncios, completa la verificación de documentos.',
    kycBtn: 'Iniciar verificación',
    kycPending: 'Verificación en análisis',
    kycPendingDesc: 'Hemos recibido tus documentos. Te avisaremos por e-mail (hasta 48h hábiles).',
    kycRejected: 'Verificación no aprobada',
    kycRejectedDesc: 'Revisa tus documentos y envíalos de nuevo.',
    kycRetry: 'Reenviar documentos',
    editAdvProfile: 'Editar perfil de anunciante',
    viewPublic: 'Ver página pública',
    dangerTitle: 'Zona de riesgo',
    deleteAccount: 'Eliminar mi cuenta y datos',
    deleteConfirm: '¿Seguro? Esto borra tus anuncios, perfil y documentos. Esta acción es irreversible.',
    deleteDone: 'Cuenta y datos eliminados. La eliminación se finaliza en hasta 30 días según la Política de Privacidad.',
    deleting: 'Eliminando...',
  },
}

export default function PainelPage() {
  const { lang } = useLang()
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]
  const [profile, setProfile] = useState(null)
  const [ads, setAds]       = useState([])
  const [loadingAds, setLoadingAds] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user || !supabase) { setLoadingAds(false); return }
      const [{ data: prof }, { data: adsData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('ads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      if (cancelled) return
      setProfile(prof || null)
      setAds(adsData || [])
      setLoadingAds(false)
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

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const [deleting, setDeleting] = useState(false)
  const handleDeleteAccount = async () => {
    if (!window.confirm(t.deleteConfirm)) return
    setDeleting(true)
    try {
      if (supabase && user) {
        // Apaga os dados do usuário (RLS garante que só apaga os próprios).
        await supabase.from('reviews').delete().eq('author_id', user.id)
        await supabase.from('ads').delete().eq('user_id', user.id)
        await supabase.from('documents').delete().eq('user_id', user.id)
        await supabase.from('advertiser_profiles').delete().eq('user_id', user.id)
        await supabase.from('profiles').delete().eq('id', user.id)
      }
      window.alert(t.deleteDone)
      await signOut()
      navigate('/')
    } catch {
      setDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
        <PageHeader />
        <main className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          {t.loading}
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
        <PageHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-xs">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-yellow-600" />
            </div>
            <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
            <Link to="/entrar"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: '#1A7A2E' }}>
              {t.goLogin}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isFounder(user, profile?.role)) {
    return <Navigate to="/" replace />
  }

  const meta = user.user_metadata || {}
  const isAdvertiser = profile?.account_type === 'advertiser'
  const kycStatus = profile?.kyc_status || 'none'
  const kycVerified = kycStatus === 'verified'
  const canPublish = isAdvertiser && kycVerified

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
            <p className="text-gray-500 text-sm">
              {t.welcome}, {profile?.full_name || meta.full_name || user.email}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: isAdvertiser ? '#FFFDE7' : '#E8F5E9',
              color:      isAdvertiser ? '#7B5E00' : '#1A7A2E',
              border:     isAdvertiser ? '1px solid #F5C800' : '1px solid #1A7A2E',
            }}
          >
            <Star size={11} fill={isAdvertiser ? '#F5C800' : 'none'} />
            {isAdvertiser ? t.accountAdv : t.accountFree}
          </span>
        </div>

        {!isAdvertiser && (
          <section className="rounded-3xl shadow-md p-5 mb-6 text-white"
            style={{ background: 'linear-gradient(135deg, #F5C800 0%, #E5A800 100%)' }}>
            <div className="flex items-start gap-3">
              <Zap size={22} className="text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-black text-base mb-0.5" style={{ color: '#3a2a00' }}>{t.upgradeTitle}</h3>
                <p className="text-xs mb-3" style={{ color: '#3a2a00' }}>{t.upgradeDesc}</p>
                <button
                  onClick={() => navigate('/assinatura')}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white hover:opacity-90 transition-opacity"
                  style={{ color: '#1A7A2E' }}
                >
                  {t.upgradeBtn}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* KYC — só para anunciante ainda não verificado */}
        {isAdvertiser && !kycVerified && (
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
                  <button
                    onClick={() => navigate('/anunciante/verificacao')}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: '#1A7A2E' }}>
                    {kycStatus === 'rejected' ? t.kycRetry : t.kycBtn}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {canPublish && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => navigate('/assinatura')}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-sm text-sm font-bold text-gray-700 hover:shadow-md transition-shadow">
              <Star size={16} style={{ color: '#F5C800' }} fill="#F5C800" /> {t.accountAdv}
            </button>
            <button
              onClick={() => navigate('/anunciante/perfil')}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-sm text-sm font-bold text-gray-700 hover:shadow-md transition-shadow">
              <Store size={16} style={{ color: '#1A7A2E' }} /> {t.editAdvProfile}
            </button>
            <button
              onClick={() => navigate(`/anunciante/${(profile?.username || '').toLowerCase()}`)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-sm text-sm font-bold text-gray-700 hover:shadow-md transition-shadow">
              <ExternalLink size={16} style={{ color: '#1A7A2E' }} /> {t.viewPublic}
            </button>
          </div>
        )}

        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">{t.yourAds}</h2>
            {canPublish && (
              <button
                onClick={() => navigate('/novo-anuncio')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: '#1A7A2E' }}>
                <Plus size={14} /> {t.newAd}
              </button>
            )}
          </div>

          {loadingAds ? (
            <p className="text-sm text-gray-400">{t.loading}</p>
          ) : ads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">{isAdvertiser ? t.noAds : t.noAdsFree}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {ads.map(ad => (
                <li key={ad.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{ad.title}</p>
                    <p className="text-xs text-gray-400">{t.status[ad.status] || ad.status}</p>
                  </div>
                  <Link to={`/anuncio/${ad.id}`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    title={t.edit}>
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDelete(ad.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                    title={t.delete}>
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">{t.profile}</h2>
            <button
              onClick={() => navigate('/perfil')}
              className="text-sm font-bold hover:underline"
              style={{ color: '#1A7A2E' }}>
              {lang === 'pt' ? 'Meu perfil + convide e ganhe →' : 'Mi perfil + invita y gana →'}
            </button>
          </div>
          <ul className="space-y-3 text-sm">
            {profile?.username && (
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100">
                  <AtSign size={15} className="text-gray-500" />
                </span>
                <div>
                  <div className="text-xs text-gray-400">{t.username}</div>
                  <div className="font-semibold text-gray-800">@{profile.username}</div>
                </div>
              </li>
            )}
            <li className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100">
                <Mail size={15} className="text-gray-500" />
              </span>
              <div>
                <div className="text-xs text-gray-400">{t.email}</div>
                <div className="font-semibold text-gray-800">{user.email}</div>
              </div>
            </li>
            {(profile?.whatsapp || meta.whatsapp) && (
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100">
                  <Phone size={15} className="text-gray-500" />
                </span>
                <div>
                  <div className="text-xs text-gray-400">{t.whatsapp}</div>
                  <div className="font-semibold text-gray-800">{profile?.whatsapp || meta.whatsapp}</div>
                </div>
              </li>
            )}
          </ul>
        </section>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors mb-6"
        >
          <LogOut size={15} /> {t.signOut}
        </button>

        {/* Zona de risco — exclusão de conta (RGPD/LGPD) */}
        <section className="rounded-2xl border border-red-200 p-4">
          <h3 className="text-xs font-black uppercase tracking-wide text-red-500 mb-2">{t.dangerTitle}</h3>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            <Trash2 size={15} /> {deleting ? t.deleting : t.deleteAccount}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  )
}
