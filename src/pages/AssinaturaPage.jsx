import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Star, ShieldCheck, AlertCircle, CreditCard } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

const TEXT = {
  pt: {
    back: 'Voltar',
    title: 'Plano Anunciante',
    price: '12,99 €',
    per: '/mês',
    subtitle: 'Publique seus anúncios para a comunidade brasileira na Espanha.',
    benefits: [
      'Anúncios ilimitados dentro do mês pago',
      'Página pública de anunciante com avaliações',
      'Cartão digital compartilhável',
      'Suporte prioritário por e-mail',
      'Acesso à comunidade de anunciantes',
      'Cancelamento descomplicado, sem fidelidade',
    ],
    loginRequired: 'Entre para assinar o plano.',
    goLogin: 'Ir para Entrar',
    needKyc: 'Conclua a verificação de anunciante antes de assinar.',
    goKyc: 'Ir para verificação',
    statusActive: 'Assinatura ativa',
    statusActiveDesc: 'Você já pode publicar anúncios.',
    validUntil: 'Válido até',
    goPanel: 'Ir para o painel',
    subscribe: 'Assinar com PayPal',
    soon: 'Pagamento PayPal em integração',
    soonDesc: 'A cobrança recorrente de 12,99 €/mês via PayPal será ativada em breve. Sua conta e verificação já estão prontas — assim que o pagamento estiver ativo, você poderá publicar.',
    securePay: 'Pagamento processado pelo PayPal. Não armazenamos dados do seu cartão.',
  },
  es: {
    back: 'Volver',
    title: 'Plan Anunciante',
    price: '12,99 €',
    per: '/mes',
    subtitle: 'Publica tus anuncios para la comunidad brasileña en España.',
    benefits: [
      'Anuncios ilimitados dentro del mes pagado',
      'Página pública de anunciante con valoraciones',
      'Tarjeta digital compartible',
      'Soporte prioritario por e-mail',
      'Acceso a la comunidad de anunciantes',
      'Cancelación sencilla, sin permanencia',
    ],
    loginRequired: 'Inicia sesión para suscribirte al plan.',
    goLogin: 'Ir a Entrar',
    needKyc: 'Completa la verificación de anunciante antes de suscribirte.',
    goKyc: 'Ir a verificación',
    statusActive: 'Suscripción activa',
    statusActiveDesc: 'Ya puedes publicar anuncios.',
    validUntil: 'Válido hasta',
    goPanel: 'Ir al panel',
    subscribe: 'Suscribirse con PayPal',
    soon: 'Pago PayPal en integración',
    soonDesc: 'El cobro recurrente de 12,99 €/mes vía PayPal se activará pronto. Tu cuenta y verificación ya están listas — en cuanto el pago esté activo, podrás publicar.',
    securePay: 'Pago procesado por PayPal. No almacenamos los datos de tu tarjeta.',
  },
}

export default function AssinaturaPage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]

  const [profile, setProfile] = useState(null)
  const [sub, setSub] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user || !supabase) { setLoading(false); return }
      const [{ data: prof }, { data: subscription }] = await Promise.all([
        supabase.from('profiles').select('account_type,kyc_status').eq('id', user.id).maybeSingle(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
      ])
      if (cancelled) return
      setProfile(prof || null)
      setSub(subscription || null)
      setLoading(false)
    }
    if (!authLoading) load()
    return () => { cancelled = true }
  }, [user, authLoading])

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

  if (authLoading || loading) {
    return <Shell><main className="flex-1 flex items-center justify-center text-gray-500 text-sm">…</main></Shell>
  }
  if (!user) {
    return <Shell><main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
        <button onClick={() => navigate('/entrar')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goLogin}</button>
      </div></main></Shell>
  }

  const subActive = sub && sub.status === 'active'

  return (
    <Shell>
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <button onClick={() => navigate('/painel')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green mb-5">
          <ArrowLeft size={16} /> {t.back}
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 text-center text-white" style={{ background: 'linear-gradient(135deg, #1A7A2E 0%, #0d5e1f 100%)' }}>
            <Star size={28} className="mx-auto mb-2" fill="#F5C800" style={{ color: '#F5C800' }} />
            <h1 className="text-xl font-black">{t.title}</h1>
            <div className="mt-2">
              <span className="text-4xl font-black">{t.price}</span>
              <span className="text-sm opacity-80">{t.per}</span>
            </div>
            <p className="text-xs opacity-90 mt-2">{t.subtitle}</p>
          </div>

          <div className="p-6">
            <ul className="space-y-2.5 mb-6">
              {t.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#1A7A2E' }} />
                  {b}
                </li>
              ))}
            </ul>

            {subActive ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-brand-green font-bold mb-1">
                  <ShieldCheck size={18} /> {t.statusActive}
                </div>
                <p className="text-xs text-gray-500 mb-1">{t.statusActiveDesc}</p>
                {sub.valid_until && (
                  <p className="text-xs text-gray-400 mb-4">
                    {t.validUntil} {new Date(sub.valid_until).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'es-ES')}
                  </p>
                )}
                <button onClick={() => navigate('/painel')}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>
                  {t.goPanel}
                </button>
              </div>
            ) : profile && profile.kyc_status !== 'verified' ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-amber-600 font-semibold text-sm mb-3">
                  <AlertCircle size={16} /> {t.needKyc}
                </div>
                <button onClick={() => navigate('/anunciante/verificacao')}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>
                  {t.goKyc}
                </button>
              </div>
            ) : (
              <div>
                {/* PayPal — placeholder até integração das credenciais */}
                <button
                  disabled
                  title="PayPal"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm opacity-70 cursor-not-allowed mb-3"
                  style={{ background: '#003087' }}>
                  <CreditCard size={16} /> {t.subscribe}
                </button>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-800 mb-0.5">⏳ {t.soon}</p>
                  <p className="text-xs text-amber-700 leading-snug">{t.soonDesc}</p>
                </div>
              </div>
            )}

            <p className="text-[11px] text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> {t.securePay}
            </p>
          </div>
        </div>
      </main>
    </Shell>
  )
}
