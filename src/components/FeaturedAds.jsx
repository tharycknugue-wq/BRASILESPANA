import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star } from 'lucide-react'

const SAMPLE_ADS = [
  {
    id: 1,
    category: 'servicos',
    categoryPt: 'Serviços',
    categoryEs: 'Servicios',
    icon: '🔧',
    titlePt: 'Eletricista certificado — atendo toda Barcelona',
    titleEs: 'Electricista certificado — atiendo toda Barcelona',
    location: 'Barcelona, Catalunha',
    time: '2h atrás',
    price: 'Desde €30/h',
    featured: true,
    color: '#E8F5E9',
    dot: '#1A7A2E',
  },
  {
    id: 2,
    category: 'vagas',
    categoryPt: 'Vagas',
    categoryEs: 'Empleo',
    icon: '💼',
    titlePt: 'Recepcionista bilíngue — empresa internacional em Madrid',
    titleEs: 'Recepcionista bilingüe — empresa internacional en Madrid',
    location: 'Madrid',
    time: '5h atrás',
    price: '€1.400/mês',
    featured: true,
    color: '#FFF3E0',
    dot: '#E65100',
  },
  {
    id: 3,
    category: 'produtos',
    categoryPt: 'Produtos',
    categoryEs: 'Productos',
    icon: '📦',
    titlePt: 'Vendo bicicleta elétrica seminova — excelente estado',
    titleEs: 'Vendo bicicleta eléctrica seminueva — excelente estado',
    location: 'Valencia',
    time: '1 dia atrás',
    price: '€350',
    featured: false,
    color: '#E3F2FD',
    dot: '#1565C0',
  },
  {
    id: 4,
    category: 'doacao',
    categoryPt: 'Doação',
    categoryEs: 'Donación',
    icon: '❤️',
    titlePt: 'Doo roupas infantis tamanho 2-4 anos — Sevilla',
    titleEs: 'Dono ropa infantil talla 2-4 años — Sevilla',
    location: 'Sevilla, Andaluzia',
    time: '3h atrás',
    price: 'Gratuito',
    featured: false,
    color: '#FFEBEE',
    dot: '#CC1714',
  },
  {
    id: 5,
    category: 'promocoes',
    categoryPt: 'Promoções',
    categoryEs: 'Promociones',
    icon: '🏷️',
    titlePt: '30% desconto em aulas de espanhol para brasileiros',
    titleEs: '30% descuento en clases de español para brasileños',
    location: 'Online / Toda España',
    time: '1h atrás',
    price: '€15/aula',
    featured: true,
    color: '#FFFDE7',
    dot: '#F5C800',
  },
  {
    id: 6,
    category: 'voluntariado',
    categoryPt: 'Voluntariado',
    categoryEs: 'Voluntariado',
    icon: '🤝',
    titlePt: 'Voluntários para apoio a imigrantes recém-chegados',
    titleEs: 'Voluntarios para apoyo a inmigrantes recién llegados',
    location: 'Madrid',
    time: '6h atrás',
    price: 'Voluntário',
    featured: false,
    color: '#E0F2F1',
    dot: '#00695C',
  },
]

export default function FeaturedAds({ lang }) {
  const navigate = useNavigate()

  const t = {
    pt: { title: 'Anúncios em Destaque', subtitle: 'Publicados recentemente pela comunidade', seeAll: 'Ver todos', ago: 'atrás', free: 'Gratuito' },
    es: { title: 'Anuncios Destacados', subtitle: 'Publicados recientemente por la comunidad', seeAll: 'Ver todos', ago: 'antes', free: 'Gratuito' },
  }[lang]

  return (
    <section className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
          <p className="text-gray-400 text-sm mt-0.5">{t.subtitle}</p>
        </div>
        <button
          onClick={() => navigate('/anuncios/todos')}
          className="text-sm font-semibold text-brand-green hover:underline"
        >
          {t.seeAll} →
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_ADS.map((ad) => (
          <div
            key={ad.id}
            onClick={() => navigate(`/anuncios/${ad.category}`)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer
                       hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
          >
            {/* Category badge */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{ background: ad.color, color: ad.dot }}
              >
                {ad.icon} {ad[lang === 'pt' ? 'categoryPt' : 'categoryEs']}
              </span>
              {ad.featured && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={10} fill="currentColor" /> Destaque
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-3 group-hover:text-brand-green transition-colors line-clamp-2">
              {ad[lang === 'pt' ? 'titlePt' : 'titleEs']}
            </h3>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {ad.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {ad.time}
              </span>
            </div>

            {/* Price */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span
                className="font-bold text-sm"
                style={{ color: ad.price === 'Gratuito' || ad.price === 'Voluntário' ? '#1A7A2E' : '#1A7A2E' }}
              >
                {ad.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
