import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, ChevronDown, Info, PlayCircle, MessageSquare,
  Share2, FileText, LayoutDashboard, Megaphone, LogIn, UserPlus, LogOut,
  Instagram, Facebook, Music2, Youtube, MessageCircle, Send, UserCircle, Download,
  ShieldCheck, Inbox, Users, CreditCard, BarChart3, MessagesSquare, Globe,
} from 'lucide-react'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder, founderInfo } from '../lib/founders'

const FOUNDER_NAV = [
  { tab: 'tasks',   Icon: LayoutDashboard, pt: 'Início (tarefas)',  es: 'Inicio (tareas)' },
  { tab: 'mod',     Icon: ShieldCheck,    pt: 'Moderação',          es: 'Moderación' },
  { tab: 'inbox',   Icon: Inbox,          pt: 'Caixa (meu setor)',  es: 'Bandeja (mi sector)' },
  { tab: 'users',   Icon: Users,          pt: 'Usuários',           es: 'Usuarios' },
  { tab: 'fin',     Icon: CreditCard,     pt: 'Financeiro',         es: 'Finanzas' },
  { tab: 'metrics', Icon: BarChart3,      pt: 'Métricas',           es: 'Métricas' },
  { tab: 'fchat',   Icon: MessagesSquare, pt: 'Chat dos fundadores',es: 'Chat de fundadores' },
]
import { SOCIAL } from '../lib/social'

const T = {
  pt: {
    menu: 'Menu',
    home: 'Início',
    about: 'Sobre Nós',
    aboutSub: [
      { label: 'Apresentação', to: '/sobre#apresentacao' },
      { label: 'Missão',       to: '/sobre#missao' },
      { label: 'Visão',        to: '/sobre#visao' },
      { label: 'Valores',      to: '/sobre#valores' },
    ],
    tutorial: 'Tutorial',
    tutorialSub: [{ label: 'Como funciona', to: '/como-funciona' }],
    contact: 'Contato',
    contactSub: [
      { label: 'Fale conosco', to: '/contato' },
      { label: 'Suporte',      to: '/contato' },
      { label: 'Comunidade',   to: '/contato' },
      { label: 'Sugestões',    to: '/contato' },
      { label: 'Resoluções',   to: '/contato' },
    ],
    social: 'Redes Sociais',
    downloadApp: 'Baixar app',
    terms: 'Termos de Uso',
    login: 'Entrar',
    register: 'Criar conta',
    panel: 'Console de Fundador',
    profile: 'Meu perfil',
    publish: 'Publicar Anúncio',
    myAds: 'Meus anúncios',
    signout: 'Sair',
  },
  es: {
    menu: 'Menú',
    home: 'Inicio',
    about: 'Sobre Nosotros',
    aboutSub: [
      { label: 'Presentación', to: '/sobre#apresentacao' },
      { label: 'Misión',       to: '/sobre#missao' },
      { label: 'Visión',       to: '/sobre#visao' },
      { label: 'Valores',      to: '/sobre#valores' },
    ],
    tutorial: 'Tutorial',
    tutorialSub: [{ label: 'Cómo funciona', to: '/como-funciona' }],
    contact: 'Contacto',
    contactSub: [
      { label: 'Habla con nosotros', to: '/contato' },
      { label: 'Soporte',            to: '/contato' },
      { label: 'Comunidad',          to: '/contato' },
      { label: 'Sugerencias',        to: '/contato' },
      { label: 'Resoluciones',       to: '/contato' },
    ],
    social: 'Redes Sociales',
    downloadApp: 'Descargar app',
    terms: 'Términos de Uso',
    login: 'Entrar',
    register: 'Crear cuenta',
    panel: 'Consola de Fundador',
    profile: 'Mi perfil',
    publish: 'Publicar Anuncio',
    myAds: 'Mis anuncios',
    signout: 'Salir',
  },
}

const SOCIAL_DEFS = [
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'facebook',  label: 'Facebook',  Icon: Facebook },
  { key: 'tiktok',    label: 'TikTok',    Icon: Music2 },
  { key: 'youtube',   label: 'YouTube',   Icon: Youtube },
  { key: 'whatsapp',  label: 'WhatsApp',  Icon: MessageCircle },
  { key: 'telegram',  label: 'Telegram',  Icon: Send },
]

function Group({ icon: Icon, label, children, onPick, to }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => (children ? setOpen(o => !o) : onPick(to))}
        aria-expanded={children ? open : undefined}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left
                   text-sm font-semibold text-gray-800 hover:bg-green-50 transition-colors"
      >
        <span className="flex items-center gap-3">
          <Icon size={17} style={{ color: '#1A7A2E' }} />
          {label}
        </span>
        {children && (
          <ChevronDown size={15}
            className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      {children && open && <div className="pb-2">{children}</div>}
    </div>
  )
}

export default function SideMenu({ open, onClose }) {
  const navigate = useNavigate()
  const { lang } = useLang()
  const { user, signOut } = useAuth()
  const founder = isFounder(user)
  const me = founder ? founderInfo(user) : null
  const isAdvertiser = user?.user_metadata?.account_type === 'advertiser'
  const goFounder = (tab) => { onClose(); navigate('/fundador', { state: { tab } }) }
  const t = T[lang]

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  const go = (to) => {
    onClose()
    if (to.includes('#')) {
      const [path, hash] = to.split('#')
      navigate(path)
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 250)
    } else {
      navigate(to)
    }
  }

  const handleSignOut = async () => { onClose(); await signOut(); navigate('/') }
  const socials = SOCIAL_DEFS.filter(s => SOCIAL[s.key])

  const subBtn = (item, i) => (
    <button key={i} onClick={() => go(item.to)}
      className="w-full text-left pl-14 pr-5 py-2.5 text-sm text-gray-600 hover:text-brand-green hover:bg-green-50 transition-colors">
      {item.label}
    </button>
  )

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={t.menu}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <nav className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl
                      flex flex-col animate-slide-in overflow-y-auto">
        {/* Cabeçalho do menu */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
             style={{ background: '#1A7A2E' }}>
          <span className="font-black text-white text-lg">{t.menu}</span>
          <button onClick={onClose} aria-label="Fechar" className="text-white/90 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Conta — visível logo no topo (logado) */}
        {user && (
          <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-gray-100"
               style={{ background: '#F0FAF1' }}>
            <span className="text-xs text-gray-600 truncate min-w-0">{user.email}</span>
            <button onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm font-black text-red-600 hover:text-red-700 flex-shrink-0">
              <LogOut size={16} /> {t.signout}
            </button>
          </div>
        )}

        {/* Conta — visível logo no topo (deslogado) */}
        {!user && (
          <div className="px-5 py-3 border-b border-gray-100 flex gap-2"
               style={{ background: '#F0FAF1' }}>
            <button onClick={() => go('/entrar')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: '#1A7A2E' }}>
              <LogIn size={15} /> {t.login}
            </button>
            <button onClick={() => go('/cadastro')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold border"
              style={{ borderColor: '#1A7A2E', color: '#1A7A2E' }}>
              <UserPlus size={15} /> {t.register}
            </button>
          </div>
        )}

        {/* Menu do FUNDADOR — coerente com o setor */}
        {founder && (
          <div className="border-b border-gray-100">
            <div className="px-5 py-3 bg-green-50">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                {lang === 'es' ? 'Tu sector' : 'Seu setor'}
              </p>
              <p className="font-black text-gray-900">{me?.name} · {me?.area}</p>
            </div>
            {FOUNDER_NAV.map(it => (
              <button key={it.tab} onClick={() => goFounder(it.tab)}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50">
                <it.Icon size={17} style={{ color: '#1A7A2E' }} />
                {lang === 'es' ? it.es : it.pt}
              </button>
            ))}
            <button onClick={() => go('/')}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-500 hover:bg-gray-50">
              <Globe size={17} /> {lang === 'es' ? 'Ver sitio público' : 'Ver site público'}
            </button>
          </div>
        )}

        {!founder && (<>
        <Group icon={Info} label={t.about}>
          {t.aboutSub.map(subBtn)}
        </Group>

        <Group icon={PlayCircle} label={t.tutorial}>
          {t.tutorialSub.map(subBtn)}
        </Group>

        <Group icon={MessageSquare} label={t.contact}>
          {t.contactSub.map(subBtn)}
        </Group>

        {socials.length > 0 && (
          <Group icon={Share2} label={t.social}>
            {socials.map(({ key, label, Icon }) => (
              <a key={key} href={SOCIAL[key]} target="_blank" rel="noopener noreferrer"
                 onClick={onClose}
                 className="flex items-center gap-3 pl-14 pr-5 py-2.5 text-sm text-gray-600 hover:text-brand-green hover:bg-green-50 transition-colors">
                <Icon size={15} /> {label}
              </a>
            ))}
          </Group>
        )}

        <Group icon={Download} label={t.downloadApp} onPick={go} to="/baixar-app" />

        <Group icon={FileText} label={t.terms} onPick={go} to="/termos" />
        </>)}

        {/* Ações de conta — quem está logado e NÃO é fundador */}
        {user && !founder && (
          <div className="mt-auto border-t border-gray-100 py-2">
            <button onClick={() => go('/perfil')}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50">
              <UserCircle size={17} style={{ color: '#1A7A2E' }} /> {t.profile}
            </button>
            {founder && (
              <button onClick={() => go('/fundador')}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-green-50">
                <LayoutDashboard size={17} style={{ color: '#1A7A2E' }} /> {t.panel}
              </button>
            )}
            {isAdvertiser && (
              <button onClick={() => go('/meus-anuncios')}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold hover:bg-green-50"
                style={{ color: '#1A7A2E' }}>
                <Megaphone size={17} /> {t.myAds}
              </button>
            )}
            <button onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
              <LogOut size={17} /> {t.signout}
            </button>
          </div>
        )}
      </nav>
    </div>
  )
}
