import { useNavigate } from 'react-router-dom'
import {
  Wrench, ShoppingBag, RefreshCw, Heart, Briefcase, HandHeart, Tag
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'servicos',
    icon: Wrench,
    color: '#1A7A2E',
    bg: '#E8F5E9',
    pt: { label: 'Serviços', desc: 'Profissionais e autônomos' },
    es: { label: 'Servicios', desc: 'Profesionales y autónomos' },
  },
  {
    id: 'produtos',
    icon: ShoppingBag,
    color: '#1565C0',
    bg: '#E3F2FD',
    pt: { label: 'Produtos', desc: 'Compra e venda de itens' },
    es: { label: 'Productos', desc: 'Compra y venta de artículos' },
  },
  {
    id: 'desapego',
    icon: RefreshCw,
    color: '#6A1B9A',
    bg: '#F3E5F5',
    pt: { label: 'Desapego', desc: 'Itens usados com valor' },
    es: { label: 'Desapego', desc: 'Artículos usados con valor' },
  },
  {
    id: 'doacao',
    icon: Heart,
    color: '#CC1714',
    bg: '#FFEBEE',
    pt: { label: 'Doação', desc: 'Dando com amor' },
    es: { label: 'Donación', desc: 'Dando con amor' },
  },
  {
    id: 'vagas',
    icon: Briefcase,
    color: '#E65100',
    bg: '#FFF3E0',
    pt: { label: 'Vagas', desc: 'Emprego e oportunidades' },
    es: { label: 'Empleo', desc: 'Trabajo y oportunidades' },
  },
  {
    id: 'voluntariado',
    icon: HandHeart,
    color: '#00695C',
    bg: '#E0F2F1',
    pt: { label: 'Voluntariado', desc: 'Ajude e faça a diferença' },
    es: { label: 'Voluntariado', desc: 'Ayuda y marca la diferencia' },
  },
  {
    id: 'promocoes',
    icon: Tag,
    color: '#F5C800',
    bg: '#FFFDE7',
    pt: { label: 'Promoções', desc: 'Ofertas e descontos' },
    es: { label: 'Promociones', desc: 'Ofertas y descuentos' },
  },
]

export default function CategorySection({ lang }) {
  const navigate = useNavigate()

  const t = {
    pt: { title: 'Anuncie ou Encontre', subtitle: 'Escolha uma categoria para começar' },
    es: { title: 'Anuncia o Encuentra', subtitle: 'Elige una categoría para comenzar' },
  }[lang]

  return (
    <section className="max-w-5xl mx-auto px-4 py-6 animate-slide-up">
      {/* Section Header — styled as a big action card */}
      <div
        className="rounded-3xl p-6 sm:p-8 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1A7A2E 0%, #145c22 100%)' }}
      >
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 text-white mb-3">
            {lang === 'pt' ? '🇧🇷 Para brasileiros na Espanha' : '🇧🇷 Para brasileños en España'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">{t.title}</h2>
          <p className="text-green-200 text-sm">{t.subtitle}</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const info = cat[lang]
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/anuncios/${cat.id}`)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white cursor-pointer
                           transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: cat.bg }}
                >
                  <Icon size={22} style={{ color: cat.color }} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{info.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5 hidden sm:block leading-tight">{info.desc}</p>
                </div>
              </button>
            )
          })}

          {/* CTA card - "all categories" */}
          <button
            onClick={() => navigate('/anuncios/todos')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-white/30
                       cursor-pointer transition-all duration-200 hover:border-white hover:bg-white/10 active:scale-95 text-center"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">
                {lang === 'pt' ? 'Ver Tudo' : 'Ver Todo'}
              </p>
              <p className="text-green-200 text-xs mt-0.5 hidden sm:block">
                {lang === 'pt' ? 'Todos os anúncios' : 'Todos los anuncios'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
