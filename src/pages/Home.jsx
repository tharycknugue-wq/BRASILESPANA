import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu as MenuIcon, Instagram } from 'lucide-react'
import LocationFilter from '../components/LocationFilter'
import Footer from '../components/Footer'
import InstallAppButton from '../components/InstallAppButton'
import SideMenu from '../components/SideMenu'
import LangToggle from '../components/LangToggle'
import { useLang } from '../lib/lang'
import { SOCIAL } from '../lib/social'

/* Grade 3×3 aprovada (ESTADO_APROVADO): 9 categorias. */
const CATEGORIES = [
  { id: 'servicos',     icon: '🔧', pt: 'Serviços',     es: 'Servicios',    subPt: 'Profissionais autônomos e empresas', subEs: 'Profesionales autónomos y empresas' },
  { id: 'produtos',     icon: '📦', pt: 'Produtos',     es: 'Productos',    subPt: 'Compra e venda de itens',            subEs: 'Compra y venta de artículos' },
  { id: 'desapego',     icon: '♻️', pt: 'Desapego',     es: 'Desapego',     subPt: 'Itens usados com precinho camarada',  subEs: 'Artículos usados a buen precio' },
  { id: 'doacao',       icon: '❤️', pt: 'Doação',       es: 'Donación',     subPt: 'Partilhando com amor',               subEs: 'Compartiendo con amor' },
  { id: 'adocao-pets',  icon: '🐾', pt: 'Adoção',       es: 'Adopción',     subPt: 'Adote com responsabilidade',         subEs: 'Adopta con responsabilidad' },
  { id: 'voluntariado', icon: '🤝', pt: 'Voluntariado', es: 'Voluntariado', subPt: 'Ajudar faz a diferença',             subEs: 'Ayudar marca la diferencia' },
  { id: 'vagas',        icon: '💼', pt: 'Vagas',        es: 'Empleo',       subPt: 'Empregos e oportunidades',           subEs: 'Empleos y oportunidades' },
  { id: 'promocoes',    icon: '🏷️', pt: 'Promoções',    es: 'Promociones',  subPt: 'Ofertas e descontos',                subEs: 'Ofertas y descuentos' },
  { id: 'todos',        icon: '🔍', pt: 'Ver Tudo',     es: 'Ver Todo',     subPt: 'Todos os anúncios',                  subEs: 'Todos los anuncios' },
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

export default function Home() {
  const { lang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const t = TEXT[lang]

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
        <div className="flex items-center px-4 pt-4">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                       bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
          >
            <MenuIcon size={16} /> Menu
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

        {/* Seletor de idioma — componente padrão */}
        <div className="mb-7">
          <LangToggle />
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
            <div className="px-4 pb-5 grid grid-cols-3 gap-2.5">
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

        {/* Localização */}
        <LocationFilter lang={lang} />

        {/* Acesso ao Instagram — abaixo do filtro de localização */}
        {SOCIAL.instagram && (
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full font-bold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(90deg, #F58529, #DD2A7B, #8134AF)' }}
          >
            <Instagram size={18} />
            {t.followIg}
          </a>
        )}
      </main>

      <Footer lang={lang} />
      <InstallAppButton />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
