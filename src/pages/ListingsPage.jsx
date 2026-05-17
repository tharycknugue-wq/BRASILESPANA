import { useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, MapPin, Clock, Star, X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'

const CATEGORY_META = {
  servicos:     { pt: 'Serviços',     es: 'Servicios',     icon: '🔧', color: '#1A7A2E', bg: '#E8F5E9' },
  produtos:     { pt: 'Produtos',     es: 'Productos',     icon: '📦', color: '#1565C0', bg: '#E3F2FD' },
  desapego:     { pt: 'Desapego',     es: 'Desapego',      icon: '♻️', color: '#6A1B9A', bg: '#F3E5F5' },
  doacao:       { pt: 'Doação',       es: 'Donación',      icon: '❤️', color: '#CC1714', bg: '#FFEBEE' },
  'adocao-pets':{ pt: 'Adoção',       es: 'Adopción',      icon: '🐾', color: '#7B5E3C', bg: '#F5EBE0' },
  vagas:        { pt: 'Vagas',        es: 'Empleo',        icon: '💼', color: '#E65100', bg: '#FFF3E0' },
  voluntariado: { pt: 'Voluntariado', es: 'Voluntariado',  icon: '🤝', color: '#00695C', bg: '#E0F2F1' },
  promocoes:    { pt: 'Promoções',    es: 'Promociones',   icon: '🏷️', color: '#B8860B', bg: '#FFFDE7' },
  todos:        { pt: 'Todos',        es: 'Todos',         icon: '🔍', color: '#424242', bg: '#F5F5F5' },
}

/* Anúncios mock — bilingual via lang. Cada item tem versão PT e ES. */
const MOCK_RAW = [
  { titlePt: 'Eletricista certificado — toda Barcelona',  titleEs: 'Electricista certificado — toda Barcelona',  location: 'Barcelona', pricePt: '€35/h',       priceEs: '€35/h' },
  { titlePt: 'Aulas de português para espanhóis',         titleEs: 'Clases de portugués para españoles',         location: 'Madrid',    pricePt: '€20/h',       priceEs: '€20/h' },
  { titlePt: 'Bicicleta elétrica seminova',               titleEs: 'Bicicleta eléctrica seminueva',              location: 'Valencia',  pricePt: '€350',        priceEs: '€350' },
  { titlePt: 'Doação de roupas infantis tamanho 2-4',     titleEs: 'Donación de ropa infantil talla 2-4',        location: 'Sevilla',   pricePt: 'Grátis',      priceEs: 'Gratis' },
  { titlePt: 'Vaga: recepcionista bilíngue Madrid',       titleEs: 'Empleo: recepcionista bilingüe Madrid',      location: 'Bilbao',    pricePt: '€1.400/mês',  priceEs: '€1.400/mes' },
  { titlePt: 'Voluntários para ONG de imigrantes',        titleEs: 'Voluntarios para ONG de inmigrantes',        location: 'Málaga',    pricePt: 'Voluntário',  priceEs: 'Voluntario' },
  { titlePt: 'Promoção: 30% em aulas de espanhol',        titleEs: 'Promoción: 30% en clases de español',        location: 'Barcelona', pricePt: '€15/aula',    priceEs: '€15/clase' },
  { titlePt: 'Cuidado de idosos — experiência',           titleEs: 'Cuidado de ancianos — experiencia',          location: 'Madrid',    pricePt: '€18/h',       priceEs: '€18/h' },
  { titlePt: 'Smartphone Samsung seminovo',               titleEs: 'Smartphone Samsung seminuevo',               location: 'Valencia',  pricePt: '€200',        priceEs: '€200' },
  { titlePt: 'Limpeza residencial e comercial',           titleEs: 'Limpieza residencial y comercial',           location: 'Sevilla',   pricePt: '€25/h',       priceEs: '€25/h' },
  { titlePt: 'Mesa de jantar 6 lugares',                  titleEs: 'Mesa de comedor 6 plazas',                   location: 'Bilbao',    pricePt: '€80',         priceEs: '€80' },
  { titlePt: 'Aulas de reforço — matemática',             titleEs: 'Clases de refuerzo — matemáticas',           location: 'Málaga',    pricePt: '€15/h',       priceEs: '€15/h' },
]

const buildMockListings = (lang) => MOCK_RAW.map((it, i) => ({
  id: i + 1,
  title: lang === 'pt' ? it.titlePt : it.titleEs,
  location: it.location,
  time: lang === 'pt' ? `${i + 1}h atrás` : `hace ${i + 1}h`,
  price: lang === 'pt' ? it.pricePt : it.priceEs,
  featured: i % 4 === 0,
}))

const LOCATION_LABELS = {
  pt: { comunidade: 'Comunidade', provincia: 'Província', municipio: 'Município', bairro: 'Bairro' },
  es: { comunidade: 'Comunidad', provincia: 'Provincia', municipio: 'Municipio', barrio: 'Barrio' },
}

export default function ListingsPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { lang } = useLang()
  const [search, setSearch] = useState('')

  const meta = CATEGORY_META[category] || CATEGORY_META.todos
  const catLabel = meta[lang]
  const MOCK_LISTINGS = useMemo(() => buildMockListings(lang), [lang])

  const t = {
    pt: { search: 'Buscar anúncios...', filters: 'Filtros', results: 'resultados', noResults: 'Nenhum anúncio encontrado', publish: 'Publicar nesta categoria', locationFilters: 'Filtros de localização' },
    es: { search: 'Buscar anuncios...', filters: 'Filtros', results: 'resultados', noResults: 'Ningún anuncio encontrado', publish: 'Publicar en esta categoría', locationFilters: 'Filtros de ubicación' },
  }[lang]

  /* location params from URL (multi-value, comma-separated) */
  const locKeys = ['comunidade', 'provincia', 'municipio', 'bairro', 'barrio']
  const activeLocFilters = locKeys
    .filter(k => searchParams.get(k))
    .map(k => ({
      key:    k,
      values: searchParams.get(k).split(',').filter(Boolean),
      label:  LOCATION_LABELS[lang]?.[k] || k,
    }))

  const removeLocFilter = (key) => {
    const next = new URLSearchParams(searchParams)
    next.delete(key)
    setSearchParams(next)
  }

  const filtered = MOCK_LISTINGS.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchLoc = activeLocFilters.length === 0 ||
      activeLocFilters.some(f =>
        f.values.some(v => a.location.toLowerCase().includes(v.toLowerCase()))
      )
    return matchSearch && matchLoc
  })

  return (
    <div className="min-h-screen flex flex-col bg-brand-blue">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Back + Category Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors mb-4"
          >
            <ArrowLeft size={16} /> {lang === 'pt' ? 'Voltar' : 'Volver'}
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{ background: meta.bg }}
            >
              {meta.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{catLabel}</h1>
              <p className="text-gray-400 text-sm">{filtered.length} {t.results}</p>
            </div>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm
                         focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
          <button
            onClick={() => navigate('/novo-anuncio')}
            className="btn-primary text-sm px-4 hidden sm:block"
          >
            + {t.publish}
          </button>
        </div>

        {/* Location filter tags */}
        {activeLocFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5 px-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <MapPin size={11} /> {t.locationFilters}:
            </span>
            {activeLocFilters.map(f => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-brand-green"
              >
                {f.label}: {f.values.join(', ')}
                <button onClick={() => removeLocFilter(f.key)} className="hover:text-red-500 transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Listings grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-medium">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(ad => (
              <div
                key={ad.id}
                onClick={() => navigate(`/anuncio/${ad.id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer
                           hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon} {catLabel}
                  </span>
                  {ad.featured && (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={10} fill="currentColor" />
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-3 group-hover:text-brand-green transition-colors">
                  {ad.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {ad.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {ad.time}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="font-bold text-sm" style={{ color: meta.color }}>{ad.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
