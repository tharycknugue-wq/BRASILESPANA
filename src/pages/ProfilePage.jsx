import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  AtSign, Mail, MapPin, Star, CreditCard, Camera, Pencil, Check, X,
  Instagram, Facebook, MessageCircle, Phone, Gift, Copy, Share2, Coins, Plus, Trash2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import DigitalCardModal from '../components/DigitalCardModal'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder } from '../lib/founders'
import { validateEmail } from '../lib/security'
import { supabase } from '../lib/supabase'

const REWARD_LABEL = '2,99 €'
const EXTRAS_KEY = 'be_profile_extras'
const ALLOW_KEY  = 'be_invite_allow'

const TEXT = {
  pt: {
    title: 'Meu perfil',
    subtitle: 'Seu perfil público — é dele que sai o seu cartão de visitas',
    loginRequired: 'Entre para ver seu perfil.',
    goLogin: 'Ir para Entrar',
    loading: 'Carregando...',
    accountFree: 'Plano Grátis',
    accountAdv: 'Anunciante',
    edit: 'Editar perfil',
    save: 'Salvar',
    cancel: 'Cancelar',
    saved: 'Perfil salvo',
    addPhoto: 'Adicionar foto',
    changePhoto: 'Trocar foto',
    photoHint: 'Sua foto ou a do seu estabelecimento',
    nameLabel: 'Nome / Estabelecimento',
    namePh: 'Ex: Maria Silva ou Padaria do Zé',
    locationLabel: 'Localização',
    locationPh: 'Ex: Madrid, Espanha',
    bioLabel: 'Sobre',
    bioPh: 'Conte em uma linha o que você faz',
    socialTitle: 'Redes sociais e contato',
    socialDesc: 'Esses contatos aparecem no seu cartão de visitas.',
    whatsapp: 'WhatsApp',
    phone: 'Telefone',
    email: 'E-mail',
    instagram: 'Instagram',
    facebook: 'Facebook',
    emptySocial: 'Nenhum contato adicionado ainda.',
    cardTitle: 'Cartão de visitas',
    cardDesc: 'Gere e compartilhe seu cartão em qualquer rede. Ele usa os dados acima.',
    cardBtn: 'Gerar cartão de visitas',
    editAdv: 'Editar perfil de anunciante',
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
    terms: 'Estas condições integram os Termos de Uso da plataforma.',
    seeTerms: 'Ver Termos',
    manageTitle: 'Quem pode convidar com link',
    manageDesc: 'Adicione o e-mail de quem pode usar o programa de indicação. Isso NÃO dá acesso ao painel.',
    managePh: 'email@exemplo.com',
    manageAdd: 'Adicionar',
    manageEmpty: 'Nenhum e-mail liberado ainda.',
    manageRemove: 'Remover',
    manageInvalid: 'E-mail inválido',
    manageNote: 'No modo atual a lista vale neste navegador; com o servidor conectado passa a valer para todos.',
  },
  es: {
    title: 'Mi perfil',
    subtitle: 'Tu perfil público — de aquí sale tu tarjeta de visita',
    loginRequired: 'Inicia sesión para ver tu perfil.',
    goLogin: 'Ir a Entrar',
    loading: 'Cargando...',
    accountFree: 'Plan Gratis',
    accountAdv: 'Anunciante',
    edit: 'Editar perfil',
    save: 'Guardar',
    cancel: 'Cancelar',
    saved: 'Perfil guardado',
    addPhoto: 'Añadir foto',
    changePhoto: 'Cambiar foto',
    photoHint: 'Tu foto o la de tu establecimiento',
    nameLabel: 'Nombre / Establecimiento',
    namePh: 'Ej: María Silva o Panadería de Zé',
    locationLabel: 'Ubicación',
    locationPh: 'Ej: Madrid, España',
    bioLabel: 'Sobre',
    bioPh: 'Cuenta en una línea lo que haces',
    socialTitle: 'Redes sociales y contacto',
    socialDesc: 'Estos contactos aparecen en tu tarjeta de visita.',
    whatsapp: 'WhatsApp',
    phone: 'Teléfono',
    email: 'E-mail',
    instagram: 'Instagram',
    facebook: 'Facebook',
    emptySocial: 'Aún no añadiste ningún contacto.',
    cardTitle: 'Tarjeta de visita',
    cardDesc: 'Genera y comparte tu tarjeta en cualquier red. Usa los datos de arriba.',
    cardBtn: 'Generar tarjeta de visita',
    editAdv: 'Editar perfil de anunciante',
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
    terms: 'Estas condiciones forman parte de los Términos de Uso de la plataforma.',
    seeTerms: 'Ver Términos',
    manageTitle: 'Quién puede invitar con enlace',
    manageDesc: 'Añade el e-mail de quien puede usar el programa de invitación. Esto NO da acceso al panel.',
    managePh: 'email@ejemplo.com',
    manageAdd: 'Añadir',
    manageEmpty: 'Aún no hay e-mails habilitados.',
    manageRemove: 'Quitar',
    manageInvalid: 'E-mail inválido',
    manageNote: 'En el modo actual la lista vale en este navegador; con el servidor conectado pasa a valer para todos.',
  },
}

function eur(cents) {
  return (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function loadExtras() {
  try { return JSON.parse(localStorage.getItem(EXTRAS_KEY) || '{}') } catch { return {} }
}
function persistExtras(obj) {
  try { localStorage.setItem(EXTRAS_KEY, JSON.stringify(obj)) } catch { /* ignore */ }
}
function loadAllow() {
  try { const a = JSON.parse(localStorage.getItem(ALLOW_KEY) || '[]'); return Array.isArray(a) ? a : [] } catch { return [] }
}
function persistAllow(list) {
  try { localStorage.setItem(ALLOW_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

/* Reduz a imagem antes de guardar (avatar leve, cabe no localStorage) */
function fileToResizedDataURL(file, max = 360) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = new Image()
    reader.onerror = reject
    reader.onload = () => { img.src = reader.result }
    img.onerror = reject
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    reader.readAsDataURL(file)
  })
}

const EMPTY = {
  photo: '', display_name: '', location: '', bio: '',
  instagram: '', facebook: '', whatsapp: '', phone: '', email: '',
}

export default function ProfilePage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]
  const fileRef = useRef(null)

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ total: 0, paid_cents: 0, pending_cents: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)

  const [model, setModel] = useState(EMPTY)
  const [draft, setDraft] = useState(EMPTY)
  const [editing, setEditing] = useState(false)
  const [savedTick, setSavedTick] = useState(false)
  const [allow, setAllow] = useState(() => loadAllow())
  const [newEmail, setNewEmail] = useState('')
  const [allowErr, setAllowErr] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const extras = loadExtras()
      const meta = user?.user_metadata || {}

      if (user && supabase) {
        const [{ data: prof }, { data: statRows }, { data: ap }] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
          supabase.rpc('my_referral_stats'),
          supabase.from('advertiser_profiles')
            .select('display_name,headline,location,logo_path,card_whatsapp,card_phone,card_email,card_instagram,card_facebook')
            .eq('user_id', user.id).maybeSingle(),
        ])
        if (cancelled) return
        setProfile(prof || null)
        const s = Array.isArray(statRows) ? statRows[0] : statRows
        if (s) setStats({ total: s.total || 0, paid_cents: s.paid_cents || 0, pending_cents: s.pending_cents || 0 })
        let logoUrl = ''
        if (ap?.logo_path) {
          try { logoUrl = supabase.storage.from('avatars').getPublicUrl(ap.logo_path).data.publicUrl } catch { /* ignore */ }
        }
        setModel({
          photo:        extras.photo || logoUrl || '',
          display_name: ap?.display_name || prof?.full_name || meta.full_name || '',
          location:     ap?.location || extras.location || '',
          bio:          ap?.headline || extras.bio || '',
          instagram:    ap?.card_instagram || extras.instagram || '',
          facebook:     ap?.card_facebook || extras.facebook || '',
          whatsapp:     ap?.card_whatsapp || prof?.whatsapp || meta.whatsapp || '',
          phone:        ap?.card_phone || extras.phone || '',
          email:        ap?.card_email || user.email || '',
        })
      } else {
        // Modo demonstração — tudo do navegador
        if (cancelled) return
        setModel({
          photo:        extras.photo || '',
          display_name: extras.display_name || meta.full_name || '',
          location:     extras.location || '',
          bio:          extras.bio || '',
          instagram:    extras.instagram || '',
          facebook:     extras.facebook || '',
          whatsapp:     extras.whatsapp || meta.whatsapp || '',
          phone:        extras.phone || '',
          email:        extras.email || user?.email || '',
        })
      }
      setLoading(false)
    }
    if (!authLoading) load()
    return () => { cancelled = true }
  }, [user, authLoading])

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
    return <Shell><main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
        <button onClick={() => navigate('/entrar')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goLogin}</button>
      </div></main></Shell>
  }

  const meta = user.user_metadata || {}
  const username = profile?.username || meta.username || ''
  const isAdv = (profile?.account_type || meta.account_type) === 'advertiser'
  const link = `${window.location.origin}/cadastro?ref=${username}`
  const founder = isFounder(user, profile?.role)
  const myEmail = (user.email || '').trim().toLowerCase()
  const canInvite = founder || allow.includes(myEmail)

  const addAllow = () => {
    const e = newEmail.trim().toLowerCase()
    if (!validateEmail(e)) { setAllowErr(t.manageInvalid); return }
    if (allow.includes(e)) { setNewEmail(''); setAllowErr(''); return }
    const next = [...allow, e]
    setAllow(next); persistAllow(next); setNewEmail(''); setAllowErr('')
  }
  const removeAllow = (e) => {
    const next = allow.filter(x => x !== e)
    setAllow(next); persistAllow(next)
  }

  const startEdit = () => { setDraft(model); setEditing(true) }
  const cancelEdit = () => { setEditing(false); setDraft(EMPTY) }

  const persistModel = async (next) => {
    setModel(next)
    const cur = loadExtras()
    persistExtras({ ...cur, ...next })
    if (supabase && user) {
      try {
        await supabase.from('advertiser_profiles').upsert({
          user_id:        user.id,
          display_name:   next.display_name,
          headline:       next.bio,
          location:       next.location,
          card_whatsapp:  next.whatsapp,
          card_phone:     next.phone,
          card_email:     next.email,
          card_instagram: next.instagram,
          card_facebook:  next.facebook,
        }, { onConflict: 'user_id' })
      } catch { /* best-effort */ }
    }
  }

  const saveEdit = async () => {
    await persistModel({ ...draft, photo: model.photo })
    setEditing(false)
    setSavedTick(true)
    setTimeout(() => setSavedTick(false), 2200)
  }

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToResizedDataURL(file)
      await persistModel({ ...model, photo: dataUrl })
    } catch { /* ignore */ }
    if (fileRef.current) fileRef.current.value = ''
  }

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ }
  }
  const shareLink = async () => {
    const data = { title: 'BRASILESPAÑA', text: t.shareMsg, url: link }
    try { if (navigator.share) { await navigator.share(data); return } } catch { return }
    copyLink()
  }
  const whatsLink = `https://wa.me/?text=${encodeURIComponent(t.shareMsg + ' ' + link)}`

  const initial = (model.display_name || username || 'B').charAt(0).toUpperCase()
  const v = editing ? draft : model
  const setV = (k, val) => setDraft(d => ({ ...d, [k]: val }))

  const socials = [
    { k: 'whatsapp',  Icon: MessageCircle, label: t.whatsapp },
    { k: 'phone',     Icon: Phone,         label: t.phone },
    { k: 'email',     Icon: Mail,          label: t.email },
    { k: 'instagram', Icon: Instagram,     label: t.instagram },
    { k: 'facebook',  Icon: Facebook,      label: t.facebook },
  ]
  const filledSocials = socials.filter(s => model[s.k])

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-brand-green'

  return (
    <Shell>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{t.title}</h1>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
          {!editing ? (
            <button onClick={startEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: '#1A7A2E' }}>
              <Pencil size={15} /> {t.edit}
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-white text-gray-600 border border-gray-200">
                <X size={15} /> {t.cancel}
              </button>
              <button onClick={saveEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: '#1A7A2E' }}>
                <Check size={15} /> {t.save}
              </button>
            </div>
          )}
        </div>

        {savedTick && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
               style={{ background: '#E8F5E9', color: '#1A7A2E' }}>
            <Check size={16} /> {t.saved}
          </div>
        )}

        {/* HERO — perfil estilo rede social */}
        <section className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
          <div className="h-24" style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #1A7A2E 130%)' }} />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col items-center text-center">
              {/* Avatar + botão de foto */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {model.photo
                      ? <img src={model.photo} alt={model.display_name || username} className="w-full h-full object-cover" />
                      : <span className="text-4xl font-black" style={{ color: '#1A7A2E' }}>{initial}</span>}
                  </div>
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  title={model.photo ? t.changePhoto : t.addPhoto}
                  aria-label={model.photo ? t.changePhoto : t.addPhoto}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: '#1A7A2E' }}>
                  <Camera size={16} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{t.photoHint}</p>

              {/* Nome / localização / bio */}
              {!editing ? (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mt-2">
                    {model.display_name || (username ? '@' + username : '—')}
                  </h2>
                  {username && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <AtSign size={13} />{username}
                    </p>
                  )}
                  {model.location && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} style={{ color: '#1A7A2E' }} />{model.location}
                    </p>
                  )}
                  {model.bio && <p className="text-sm text-gray-600 mt-2 max-w-md">{model.bio}</p>}
                </>
              ) : (
                <div className="w-full max-w-md mt-3 space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t.nameLabel}</label>
                    <input className={inputCls} value={v.display_name}
                      onChange={e => setV('display_name', e.target.value)} placeholder={t.namePh} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t.locationLabel}</label>
                    <input className={inputCls} value={v.location}
                      onChange={e => setV('location', e.target.value)} placeholder={t.locationPh} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{t.bioLabel}</label>
                    <input className={inputCls} value={v.bio}
                      onChange={e => setV('bio', e.target.value)} placeholder={t.bioPh} />
                  </div>
                </div>
              )}

              <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: isAdv ? '#FFF7DB' : '#E8F5E9', color: isAdv ? '#7B5E00' : '#1A7A2E' }}>
                <Star size={12} /> {isAdv ? t.accountAdv : t.accountFree}
              </span>
            </div>
          </div>
        </section>

        {/* REDES SOCIAIS / CONTATO */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="font-black text-gray-900">{t.socialTitle}</h2>
          <p className="text-xs text-gray-500 mt-0.5 mb-4">{t.socialDesc}</p>

          {!editing ? (
            filledSocials.length ? (
              <ul className="space-y-3">
                {filledSocials.map(({ k, Icon, label }) => (
                  <li key={k} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 flex-shrink-0">
                      <Icon size={15} className="text-gray-500" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">{label}</div>
                      <div className="font-semibold text-gray-800 text-sm break-words">{model[k]}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">{t.emptySocial}</p>
            )
          ) : (
            <div className="space-y-3">
              {socials.map(({ k, Icon, label }) => (
                <div key={k}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                    <Icon size={13} /> {label}
                  </label>
                  <input className={inputCls} value={v[k]} onChange={e => setV(k, e.target.value)}
                    placeholder={label} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CARTÃO DE VISITAS */}
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
              {isAdv && (
                <Link to="/anunciante/perfil"
                  className="block mt-3 text-sm font-bold hover:underline"
                  style={{ color: '#1A7A2E' }}>
                  {t.editAdv} →
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* GESTÃO — quem pode convidar com link (só fundador) */}
        {founder && (
          <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Gift size={18} style={{ color: '#1A7A2E' }} />
              <h2 className="font-black text-gray-900">{t.manageTitle}</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t.manageDesc}</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={e => { setNewEmail(e.target.value); setAllowErr('') }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAllow() } }}
                placeholder={t.managePh}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-brand-green"
              />
              <button onClick={addAllow}
                className="px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 flex-shrink-0"
                style={{ background: '#1A7A2E' }}>
                <Plus size={15} /> {t.manageAdd}
              </button>
            </div>
            {allowErr && <p className="text-xs text-red-500 mt-1.5">{allowErr}</p>}
            {allow.length ? (
              <ul className="mt-4 space-y-2">
                {allow.map(em => (
                  <li key={em} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
                    <span className="text-sm text-gray-700 break-all">{em}</span>
                    <button onClick={() => removeAllow(em)} aria-label={t.manageRemove}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 flex-shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 mt-4">{t.manageEmpty}</p>
            )}
            <p className="text-xs text-gray-400 mt-4">{t.manageNote}</p>
          </section>
        )}

        {/* CONVIDE COM LINK — fundador ou e-mail liberado */}
        {canInvite && (
          <>
            <section className="rounded-3xl shadow-md p-6 mb-6 text-white"
              style={{ background: 'linear-gradient(135deg, #1A7A2E 0%, #0d5e1f 100%)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Gift size={20} style={{ color: '#F5C800' }} />
                <h2 className="font-black text-lg">{t.inviteTitle}</h2>
              </div>
              <p className="text-sm opacity-90 mb-4">{t.inviteDesc}</p>

              <label className="block text-xs font-semibold opacity-80 mb-1">{t.yourLink}</label>
              <div className="flex gap-2 mb-4">
                <input readOnly value={link} onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm text-gray-800 bg-white/95 min-w-0" />
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
                {t.terms}{' '}
                <Link to="/termos" className="underline" style={{ color: '#1A7A2E' }}>{t.seeTerms}</Link>
              </p>
            </section>
          </>
        )}
      </main>

      <DigitalCardModal
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        advertiser={{
          username,
          card_name:    model.display_name || '',
          display_name: model.display_name || username,
          headline:     model.bio || model.location || '',
          logoUrl:      model.photo || null,
          whatsapp:     model.whatsapp || '',
          phone:        model.phone || '',
          email:        model.email || user.email || '',
          instagram:    model.instagram || '',
          facebook:     model.facebook || '',
          linkPath:     `/anunciante/${username}`,
        }}
      />
    </Shell>
  )
}
