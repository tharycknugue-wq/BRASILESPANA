import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User, AtSign, Mail, Phone, MapPin, Star, ShieldCheck, CreditCard,
  Gift, Copy, Check, Share2, MessageCircle, Coins, Info,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import DigitalCardModal from '../components/DigitalCardModal'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

const REWARD_LABEL = '2,99 €'

const TEXT = {
  pt: {
    title: 'Meu perfil',
    subtitle: 'Seus dados cadastrais e seu link de indicação',
    loginRequired: 'Entre para ver seu perfil.',
    goLogin: 'Ir para Entrar',
    loading: 'Carregando...',
    dataTitle: 'Dados cadastrais',
    name: 'Nome completo',
    username: 'Nome de usuário',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    account: 'Tipo de conta',
    accountFree: 'Plano Grátis',
    accountAdv: 'Anunciante',
    nationality: 'Nacionalidade',
    natBR: 'Brasileiro(a)',
    natDual: 'Brasileiro(a) com dupla nacionalidade',
    address: 'Endereço',
    kyc: 'Verificação',
    kyc_none: 'Não iniciada',
    kyc_pending: 'Em análise',
    kyc_verified: 'Verificada',
    kyc_rejected: 'Não aprovada',
    member: 'Membro desde',
    editAdv: 'Editar perfil de anunciante',
    cardTitle: 'Cartão de visitas',
    cardDesc: 'Compartilhe seus anúncios e seu contato em qualquer rede. Quem abrir vai direto para a sua página.',
    cardBtn: 'Gerar cartão de visitas',
    inviteTitle: 'Convide com link',
    inviteDesc: `Compartilhe seu link. A cada novo usuário que se cadastrar por ele, você ganha ${REWARD_LABEL}.`,
    yourLink: 'Seu link de indicação',
    copy: 'Copiar',
    copied: 'Copiado!',
    share: 'Compartilhar',
    whats: 'WhatsApp',
    invited: 'Indicados',
    earned: 'Ganho liberado',
    pending: 'A liberar',
    rulesTitle: 'Como funcionam os pagamentos e as indicações',
    rules: [
      `Você ganha ${REWARD_LABEL} por cada novo usuário que criar a conta usando o seu link e confirmar o e-mail.`,
      'O valor entra como "A liberar" e passa a "Ganho liberado" após a confirmação da conta indicada.',
      'Os pagamentos acumulados são feitos via PayPal, mensalmente, a partir de 15,00 € acumulados.',
      'Indicações fraudulentas, contas falsas ou autoindicação são canceladas e podem suspender a conta.',
      'O valor por indicação pode ser revisado mediante aviso prévio, sem afetar valores já liberados.',
    ],
    shareMsg: 'Entra na BRASILESPAÑA, a comunidade dos brasileiros na Espanha:',
  },
  es: {
    title: 'Mi perfil',
    subtitle: 'Tus datos de registro y tu enlace de invitación',
    loginRequired: 'Inicia sesión para ver tu perfil.',
    goLogin: 'Ir a Entrar',
    loading: 'Cargando...',
    dataTitle: 'Datos de registro',
    name: 'Nombre completo',
    username: 'Nombre de usuario',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    account: 'Tipo de cuenta',
    accountFree: 'Plan Gratis',
    accountAdv: 'Anunciante',
    nationality: 'Nacionalidad',
    natBR: 'Brasileño(a)',
    natDual: 'Brasileño(a) con doble nacionalidad',
    address: 'Dirección',
    kyc: 'Verificación',
    kyc_none: 'No iniciada',
    kyc_pending: 'En análisis',
    kyc_verified: 'Verificada',
    kyc_rejected: 'No aprobada',
    member: 'Miembro desde',
    editAdv: 'Editar perfil de anunciante',
    cardTitle: 'Tarjeta de visita',
    cardDesc: 'Comparte tus anuncios y tu contacto en cualquier red. Quien la abra va directo a tu página.',
    cardBtn: 'Generar tarjeta de visita',
    inviteTitle: 'Invita con enlace',
    inviteDesc: `Comparte tu enlace. Por cada nuevo usuario que se registre con él, ganas ${REWARD_LABEL}.`,
    yourLink: 'Tu enlace de invitación',
    copy: 'Copiar',
    copied: '¡Copiado!',
    share: 'Compartir',
    whats: 'WhatsApp',
    invited: 'Invitados',
    earned: 'Ganancia liberada',
    pending: 'Por liberar',
    rulesTitle: 'Cómo funcionan los pagos y las invitaciones',
    rules: [
      `Ganas ${REWARD_LABEL} por cada nuevo usuario que cree la cuenta usando tu enlace y confirme el e-mail.`,
      'El importe entra como "Por liberar" y pasa a "Ganancia liberada" tras la confirmación de la cuenta invitada.',
      'Los pagos acumulados se hacen vía PayPal, mensualmente, a partir de 15,00 € acumulados.',
      'Invitaciones fraudulentas, cuentas falsas o autoinvitación se cancelan y pueden suspender la cuenta.',
      'El importe por invitación puede revisarse con aviso previo, sin afectar importes ya liberados.',
    ],
    shareMsg: 'Únete a BRASILESPAÑA, la comunidad de los brasileños en España:',
  },
}

function eur(cents) {
  return (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export default function ProfilePage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ total: 0, paid_cents: 0, pending_cents: 0 })
  const [advProfile, setAdvProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user || !supabase) { setLoading(false); return }
      const [{ data: prof }, { data: statRows }, { data: ap }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.rpc('my_referral_stats'),
        supabase.from('advertiser_profiles').select('display_name,headline,logo_path,card_name,card_whatsapp,card_phone,card_email,card_instagram,card_facebook').eq('user_id', user.id).maybeSingle(),
      ])
      if (cancelled) return
      setProfile(prof || null)
      const s = Array.isArray(statRows) ? statRows[0] : statRows
      if (s) setStats({ total: s.total || 0, paid_cents: s.paid_cents || 0, pending_cents: s.pending_cents || 0 })
      if (ap) {
        let logoUrl = null
        if (ap.logo_path) {
          try { logoUrl = supabase.storage.from('avatars').getPublicUrl(ap.logo_path).data.publicUrl } catch { /* ignore */ }
        }
        setAdvProfile({ ...ap, logoUrl })
      }
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
    return <Shell><main className="flex-1 flex items-center justify-center text-gray-500 text-sm">{t.loading}</main></Shell>
  }
  if (!user) {
    return <Shell><main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
        <button onClick={() => navigate('/entrar')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goLogin}</button>
      </div></main></Shell>
  }

  const meta = user.user_metadata || {}
  const username = profile?.username || meta.username || ''
  const isAdv = profile?.account_type === 'advertiser'
  const link = `${window.location.origin}/cadastro?ref=${username}`
  const kycKey = `kyc_${profile?.kyc_status || 'none'}`

  const Row = ({ icon: Icon, label, value }) => value ? (
    <li className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 flex-shrink-0">
        <Icon size={15} className="text-gray-500" />
      </span>
      <div className="min-w-0">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-semibold text-gray-800 text-sm break-words">{value}</div>
      </div>
    </li>
  ) : null

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ }
  }
  const shareLink = async () => {
    const data = { title: 'BRASILESPAÑA', text: t.shareMsg, url: link }
    try { if (navigator.share) { await navigator.share(data); return } } catch { return }
    copyLink()
  }
  const whatsLink = `https://wa.me/?text=${encodeURIComponent(t.shareMsg + ' ' + link)}`

  return (
    <Shell>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Dados cadastrais */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="font-black text-gray-900 mb-4">{t.dataTitle}</h2>
          <ul className="space-y-3">
            <Row icon={User}   label={t.name}     value={profile?.full_name || meta.full_name} />
            <Row icon={AtSign} label={t.username} value={username ? '@' + username : null} />
            <Row icon={Mail}   label={t.email}    value={user.email} />
            <Row icon={Phone}  label={t.whatsapp} value={profile?.whatsapp || meta.whatsapp} />
            <Row icon={Star}   label={t.account}  value={isAdv ? t.accountAdv : t.accountFree} />
            {profile?.nationality && (
              <Row icon={CreditCard} label={t.nationality}
                value={profile.nationality === 'brazilian_dual' ? t.natDual : t.natBR} />
            )}
            {(profile?.address || profile?.city) && (
              <Row icon={MapPin} label={t.address}
                value={[profile.address, profile.postal_code, profile.city, profile.province].filter(Boolean).join(', ')} />
            )}
            {isAdv && (
              <Row icon={ShieldCheck} label={t.kyc} value={t[kycKey]} />
            )}
            {profile?.created_at && (
              <Row icon={Info} label={t.member}
                value={new Date(profile.created_at).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'es-ES')} />
            )}
          </ul>

          {isAdv && (
            <Link to="/anunciante/perfil"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold hover:underline"
              style={{ color: '#1A7A2E' }}>
              {t.editAdv} →
            </Link>
          )}
        </section>

        {/* Cartão de visitas */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: '#E8F5E9' }}>
              <CreditCard size={20} style={{ color: '#1A7A2E' }} />
            </div>
            <div className="flex-1">
              <h2 className="font-black text-gray-900">{t.cardTitle}</h2>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">{t.cardDesc}</p>
              <button
                onClick={() => setCardOpen(true)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: '#1A7A2E' }}>
                {t.cardBtn}
              </button>
            </div>
          </div>
        </section>

        {/* Convide com link */}
        <section className="rounded-3xl shadow-md p-6 mb-6 text-white"
          style={{ background: 'linear-gradient(135deg, #1A7A2E 0%, #0d5e1f 100%)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Gift size={20} style={{ color: '#F5C800' }} />
            <h2 className="font-black text-lg">{t.inviteTitle}</h2>
          </div>
          <p className="text-sm opacity-90 mb-4">{t.inviteDesc}</p>

          <label className="block text-xs font-semibold opacity-80 mb-1">{t.yourLink}</label>
          <div className="flex gap-2 mb-4">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm text-gray-800 bg-white/95 min-w-0"
            />
            <button onClick={copyLink}
              className="px-3 rounded-xl bg-white text-sm font-bold flex items-center gap-1.5 flex-shrink-0"
              style={{ color: '#1A7A2E' }}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? t.copied : t.copy}
            </button>
          </div>

          <div className="flex gap-2 mb-5">
            <button onClick={shareLink}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-bold transition-colors">
              <Share2 size={15} /> {t.share}
            </button>
            <a href={whatsLink} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-bold transition-colors">
              <MessageCircle size={15} /> {t.whats}
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">{stats.total}</div>
              <div className="text-[11px] opacity-80">{t.invited}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black" style={{ color: '#F5C800' }}>{eur(stats.paid_cents)}</div>
              <div className="text-[11px] opacity-80">{t.earned}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">{eur(stats.pending_cents)}</div>
              <div className="text-[11px] opacity-80">{t.pending}</div>
            </div>
          </div>
        </section>

        {/* Regras de pagamento e indicação */}
        <section className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Coins size={18} style={{ color: '#B8860B' }} />
            <h2 className="font-black text-gray-900 text-base">{t.rulesTitle}</h2>
          </div>
          <ul className="space-y-2">
            {t.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#1A7A2E' }} />
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            {lang === 'pt'
              ? 'Estas condições integram os Termos de Uso da plataforma.'
              : 'Estas condiciones forman parte de los Términos de Uso de la plataforma.'}{' '}
            <Link to="/termos" className="underline" style={{ color: '#1A7A2E' }}>
              {lang === 'pt' ? 'Ver Termos' : 'Ver Términos'}
            </Link>
          </p>
        </section>
      </main>

      <DigitalCardModal
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        advertiser={{
          username,
          card_name: advProfile?.card_name || '',
          display_name: advProfile?.display_name || profile?.full_name || meta.full_name || username,
          logoUrl: advProfile?.logoUrl || null,
          whatsapp:  advProfile?.card_whatsapp || profile?.whatsapp || meta.whatsapp || '',
          phone:     advProfile?.card_phone || '',
          email:     advProfile?.card_email || user.email || '',
          instagram: advProfile?.card_instagram || '',
          facebook:  advProfile?.card_facebook || '',
          linkPath: `/anunciante/${username}`,
        }}
      />
    </Shell>
  )
}
