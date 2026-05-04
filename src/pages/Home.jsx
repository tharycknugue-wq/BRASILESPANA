import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import Logo from '../components/Logo'
import LocationFilter from '../components/LocationFilter'
import Footer from '../components/Footer'

// Ordem exata da grade 3x3:
// Linha 1: Serviços | Produtos  | Desapego
// Linha 2: Doação   | Adoção    | Voluntariado
// Linha 3: Vagas    | Promoções | Ver tudo
const CATEGORIES = [
  { id: 'servicos',     icon: '🔧', pt: 'Serviços',       es: 'Servicios',    subtitlePt: '',                                  subtitleEs: ''                                  },
  { id: 'produtos',     icon: '📦', pt: 'Produtos',       es: 'Productos',    subtitlePt: '',                                  subtitleEs: ''                                  },
  { id: 'desapego',     icon: '♻️', pt: 'Desapego',       es: 'Desapego',     subtitlePt: 'Itens usados com precinho camarada', subtitleEs: 'Artículos usados a buen precio'   },
  { id: 'doacao',       icon: '❤️', pt: 'Doação',         es: 'Donación',     subtitlePt: 'Compartilhando com amor',            subtitleEs: 'Compartiendo con amor'             },
  { id: 'adocao-pets',  icon: '🐾', pt: 'Adoção',         es: 'Adopción',     subtitlePt: 'Adote com amor e responsabilidade',  subtitleEs: 'Adopta con amor y responsabilidad' },
  { id: 'voluntariado', icon: '🤝', pt: 'Voluntariado',   es: 'Voluntariado', subtitlePt: '',                                  subtitleEs: ''                                  },
  { id: 'vagas',        icon: '💼', pt: 'Vagas',          es: 'Empleo',       subtitlePt: '',                                  subtitleEs: ''                                  },
  { id: 'promocoes',    icon: '🏷️', pt: 'Promoções',      es: 'Promociones',  subtitlePt: '',                                  subtitleEs: ''                                  },
]

const LOCATION_BUTTONS = {
  pt: [
    { id: 'comunidade', icon: '🗺️', label: 'Comunidade Autônoma' },
    { id: 'provincia',  icon: '📍', label: 'Província'            },
    { id: 'municipio',  icon: '🏙️', label: 'Município'            },
    { id: 'bairro',     icon: '🏘️', label: 'Bairro'               },
  ],
  es: [
    { id: 'comunidade', icon: '🗺️', label: 'Comunidad Autónoma' },
    { id: 'provincia',  icon: '📍', label: 'Provincia'           },
    { id: 'municipio',  icon: '🏙️', label: 'Municipio'           },
    { id: 'bairro',     icon: '🏘️', label: 'Barrio'              },
  ],
}

const NAV_ITEMS = [
  { to: '/',              pt: 'Início',        es: 'Inicio' },
  { to: '/sobre',         pt: 'Sobre',         es: 'Sobre nosotros' },
  { to: '/como-funciona', pt: 'Como funciona', es: 'Cómo funciona' },
  { to: '/contato',       pt: 'Contato',       es: 'Contacto' },
]

const TEXT = {
  pt: {
    welcome: 'Bem-vindo à sua comunidade na Espanha',
    desc: 'Encontre e ofereça serviços, produtos, vagas, doações e muito mais — em português, perto de você.',
    cta: 'ANUNCIE OU ENCONTRE',
    location: 'Escolha sua localização',
    login: 'Entrar',
    publish: 'Publicar Anúncio',
  },
  es: {
    welcome: 'Bienvenido a tu comunidad en España',
    desc: 'Encuentra y ofrece servicios, productos, empleos, donaciones y mucho más — en tu idioma, cerca de ti.',
    cta: 'ANUNCIA O ENCUENTRA',
    location: 'Elige tu ubicación',
    login: 'Entrar',
    publish: 'Publicar Anuncio',
  },
}

/* ── Flag selector data ── */
const FLAGS = [
  {
    id:      'pt',
    emoji:   '🇧🇷',
    code:    'PT',
    label:   'Português',
    sublabel: 'do Brasil',
  },
  {
    id:      'es',
    emoji:   '🇪🇸',
    code:    'ES',
    label:   'Español',
    sublabel: 'de España',
  },
]

export default function Home() {
  const [lang, setLang]       = useState('pt')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const t = TEXT[lang]
  const menuRef = useRef(null)

  /* Close menu on outside click */
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>

      {/* ===== NAO ALTERAR - HEADER APROVADO ===== */}
      {/* ══════════════════════════════════════════
          HEADER — imagem de fundo (céu)
      ══════════════════════════════════════════ */}
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
        {/* ── Faixa superior: Menu (esq) + Sair (dir) ── */}
        <div className="flex items-center justify-between px-4 pt-4" ref={menuRef}>

          {/* Menu — esquerda */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="px-4 py-2 rounded-xl font-semibold text-sm
                       bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
          >
            {menuOpen ? <X size={20} /> : 'Menu'}
          </button>

          {/* Botão Sair — direita */}
          <button
            onClick={() => navigate('/entrar')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                       bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
          >
            <LogOut size={14} />
            {lang === 'pt' ? 'Sair' : 'Salir'}
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              className="absolute top-16 left-4 w-52 bg-white rounded-2xl shadow-xl z-50
                         border border-gray-100 overflow-hidden animate-fade-in"
            >
              {NAV_ITEMS.map(item => (
                <button
                  key={item.to}
                  onClick={() => { navigate(item.to); setMenuOpen(false) }}
                  className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700
                             hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {item[lang]}
                </button>
              ))}
              <div className="border-t border-gray-100 mx-4" />
              <button
                onClick={() => { navigate('/novo-anuncio'); setMenuOpen(false) }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-brand-green
                           hover:bg-green-50 transition-colors"
              >
                + {t.publish}
              </button>
            </div>
          )}
        </div>


      </header>
      {/* ===== NAO ALTERAR - HEADER APROVADO ===== */}

      {/* ══════════════════════════════════════════
          BODY
      ══════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">

        {/* ── FAIXA TRICOLOR (logo transição entre header e body) ── */}
        <div className="flex w-full h-2 mb-10">
          <div className="flex-1" style={{ background: '#1A7A2E' }} />
          <div className="flex-1" style={{ background: '#F5C800' }} />
          <div className="flex-1" style={{ background: '#CC1714' }} />
        </div>

        {/* ── SELETOR DE IDIOMA ── */}
        <div className="flex gap-4 mb-8">
          {FLAGS.map(flag => {
            const active = lang === flag.id
            return (
              <button
                key={flag.id}
                onClick={() => setLang(flag.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer select-none"
                style={{
                  background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                  boxShadow:  active ? '0 0 0 2.5px #1A7A2E, 0 4px 14px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.12)',
                  transform:  active ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{flag.emoji}</span>
                <span
                  className="font-black text-base"
                  style={{ color: active ? '#1A7A2E' : '#444' }}
                >
                  {flag.code}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── TEXTO DE BOAS-VINDAS ── */}
        <div className="text-center max-w-sm mb-8">
          <p className="font-bold text-gray-800 text-lg leading-snug mb-2">{t.welcome}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
        </div>

        {/* ── BOTÃO PRINCIPAL: ANUNCIE OU ENCONTRE ── */}
        <div className="w-full max-w-md mb-6">
          <div
            className="rounded-3xl overflow-hidden shadow-xl"
            style={{ background: '#1A7A2E' }}
          >
            <div className="px-6 pt-5 pb-4 text-center">
              <span className="text-white font-black text-xl sm:text-2xl tracking-wide">
                {t.cta}
              </span>
            </div>

            {/* Grade 3×3 fixa */}
            <div className="px-4 pb-5 grid grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => {
                const subtitle = lang === 'pt' ? cat.subtitlePt : cat.subtitleEs
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/anuncios/${cat.id}`)}
                    className="flex flex-col items-center gap-1 py-3 px-1 rounded-2xl bg-white
                               hover:bg-yellow-50 active:scale-95 transition-all duration-150 cursor-pointer group"
                  >
                    <span className="text-2xl leading-none">{cat.icon}</span>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-brand-green leading-tight text-center">
                      {cat[lang]}
                    </span>
                    {subtitle && (
                      <span className="text-[10px] text-gray-400 leading-tight text-center line-clamp-2">
                        {subtitle}
                      </span>
                    )}
                  </button>
                )
              })}

              {/* Ver Tudo — posição [3,3]: fundo branco, borda verde, texto verde */}
              <button
                onClick={() => navigate('/anuncios/todos')}
                className="flex flex-col items-center gap-1 py-3 px-1 rounded-2xl
                           bg-white hover:bg-green-50 active:scale-95 transition-all duration-150 cursor-pointer"
                style={{ border: '2px solid #1A7A2E' }}
              >
                <span className="text-2xl leading-none">🔍</span>
                <span
                  className="text-xs font-bold leading-tight text-center"
                  style={{ color: '#1A7A2E' }}
                >
                  {lang === 'pt' ? 'Ver Tudo' : 'Ver Todo'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── LOCALIZAÇÃO ── */}
        <LocationFilter lang={lang} />

      </main>

      <Footer lang={lang} />
    </div>
  )
}
