import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu as MenuIcon, Instagram } from 'lucide-react'
import LocationFilter from '../components/LocationFilter'
import Footer from '../components/Footer'
import InstallAppButton from '../components/InstallAppButton'
import SideMenu from '../components/SideMenu'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { SOCIAL } from '../lib/social'

/* Grade conforme build-spec: 6 categorias. */
const CATEGORIES = [
  { id: 'servicos',     icon: '🔧', pt: 'Serviços',     es: 'Servicios',    subPt: 'Profissionais autônomos e empresas', subEs: 'Profesionales autónomos y empresas' },
  { id: 'produtos',     icon: '📦', pt: 'Produtos',     es: 'Productos',    subPt: 'Compra e venda de itens',            subEs: 'Compra y venta de artículos' },
  { id: 'desapego',     icon: '♻️', pt: 'Desapego',     es: 'Desapego',     subPt: 'Itens usados com preço camarada',     subEs: 'Artículos usados a buen precio' },
  { id: 'doacao',       icon: '❤️', pt: 'Doação',       es: 'Donación',     subPt: 'Compartilhando com amor',            subEs: 'Compartiendo con amor' },
  { id: 'adocao-pets',  icon: '🐾', pt: 'Adoção',       es: 'Adopción',     subPt: 'Adote com amor e responsabilidade',  subEs: 'Adopta con amor y responsabilidad' },
  { id: 'voluntariado', icon: '💛', pt: 'Voluntariado', es: 'Voluntariado', subPt: 'Ajude e faça a diferença',           subEs: 'Ayuda y marca la diferencia' },
]

const TEXT = {
  pt: {
    title: 'Bem-vindo à sua comunidade na Espanha',
    sub1: 'Encontre oportunidades que falam a sua língua.',
    sub2: 'Conecte-se com brasileiros perto de você.',
    ctaPlan: 'Para anunciar, clique aqui e escolha seu plano.',
    grid: 'ANUNCIE OU ENCONTRE',
    exit: 'Sair',
    enter: 'Entrar',
    followIg: 'Siga no Instagram',
  },
  es: {
    title: 'Bienvenido a tu comunidad en España',
    sub1: 'Encuentra oportunidades que hablan tu idioma.',
    sub2: 'Conéctate con brasileños cerca de ti.',
    ctaPlan: 'Para anunciar, pulsa aquí y elige tu plan.',
    grid: 'ANUNCIA O ENCUENTRA',
    exit: 'Salir',
    enter: 'Entrar',
    followIg: 'Síguenos en Instagram',
  },
}

const FLAGS = [
  { id: 'pt', emoji: '🇧🇷', code: 'PT' },
  { id: 'es', emoji: '🇪🇸', code: 'ES' },
]

export default function Home() {
  const { lang, setLang } = useLang()
  const { user, signOut }  = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const t = TEXT[lang]

  // Dentro da plataforma o botão é sempre "Sair":
  // se houver sessão, encerra; se não, volta para a tela de acesso.
  const handleExit = async () => {
    if (user) await signOut()
    navigate('/entrar')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>

      {/* ══════════ HEADER (faixa azul + logo + Menu/Entrar) ══════════ */}
      <header
        className="w-full relative flex flex-col"
        style={{
          backgroundImage:    "url('/images/logomarca.png')",
          backgroundSize:     'contain',
          backgroundPosition: 'center center',
          backgroundRepeat:   'no-repeat',
          backgroundColor:    '#87CEEB',
          width:              '100%',
          height:             '160px',
        }}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                       bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
          >
            <MenuIcon size={16} /> Menu
          </button>

          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                       bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
          >
            <LogOut size={14} />
            {t.exit}
          </button>
        </div>
      </header>

      {/* Linha divisória tricolor */}
      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>

      {/* ══════════ BODY ══════════ */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12 pt-8">

        {/* Seletor de idioma */}
        <div className="flex gap-4 mb-7">
          {FLAGS.map(flag => {
            const active = lang === flag.id
            return (
              <button
                key={flag.id}
                onClick={() => setLang(flag.id)}
                aria-pressed={active}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer select-none"
                style={{
                  background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                  boxShadow:  active ? '0 0 0 2.5px #1A7A2E, 0 4px 14px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.12)',
                  transform:  active ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{flag.emoji}</span>
                <span className="font-black text-base" style={{ color: active ? '#1A7A2E' : '#444' }}>
                  {flag.code}
                </span>
              </button>
            )
          })}
        </div>

        {/* Hero */}
        <div className="text-center max-w-md mb-6">
          <h1 className="font-black text-gray-900 text-2xl sm:text-3xl leading-snug mb-3">
            {t.title}
          </h1>
          <p className="text-black text-base leading-relaxed">{t.sub1}</p>
          <p className="text-black text-base leading-relaxed">{t.sub2}</p>
        </div>

        {/* CTA planos (antes do grid) */}
        <button
          onClick={() => navigate('/assinatura')}
          className="mb-8 text-sm font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
          style={{ color: '#1A7A2E' }}
        >
          {t.ctaPlan}
        </button>

        {/* Grid ANUNCIE OU ENCONTRE — card verde, células brancas */}
        <div className="w-full max-w-md mb-8">
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{ background: '#1A7A2E' }}>
            <div className="px-6 pt-5 pb-4 text-center">
              <span className="text-white font-black text-xl sm:text-2xl tracking-wide">
                {t.grid}
              </span>
            </div>
            <div className="px-4 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/anuncios/${cat.id}`)}
                  className="flex flex-col items-center gap-1 py-4 px-2 rounded-2xl bg-white
                             hover:bg-yellow-50 active:scale-95 transition-all duration-150 cursor-pointer group"
                >
                  <span className="text-2xl leading-none">{cat.icon}</span>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-brand-green leading-tight text-center">
                    {cat[lang]}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight text-center">
                    {lang === 'pt' ? cat.subPt : cat.subEs}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Acesso ao Instagram */}
        {SOCIAL.instagram && (
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full font-bold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(90deg, #F58529, #DD2A7B, #8134AF)' }}
          >
            <Instagram size={18} />
            {t.followIg} · @app.brasilespana
          </a>
        )}

        {/* Localização */}
        <LocationFilter lang={lang} />
      </main>

      <Footer lang={lang} />
      <InstallAppButton />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
