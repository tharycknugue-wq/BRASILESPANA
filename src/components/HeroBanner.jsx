export default function HeroBanner({ lang }) {
  const t = {
    pt: {
      welcome: 'Bem-vindo à sua comunidade!',
      tagline: 'O marketplace feito para brasileiros que vivem na Espanha.',
      desc: 'Encontre serviços, produtos, vagas de emprego, doações e muito mais — perto de você, no seu idioma.',
      stats: [
        { value: '10k+', label: 'Brasileiros' },
        { value: '50+', label: 'Cidades' },
        { value: '7', label: 'Categorias' },
      ],
    },
    es: {
      welcome: '¡Bienvenido a tu comunidad!',
      tagline: 'El marketplace hecho para brasileños que viven en España.',
      desc: 'Encuentra servicios, productos, ofertas de trabajo, donaciones y mucho más — cerca de ti, en tu idioma.',
      stats: [
        { value: '10k+', label: 'Brasileños' },
        { value: '50+', label: 'Ciudades' },
        { value: '7', label: 'Categorías' },
      ],
    },
  }[lang]

  return (
    <div className="text-center py-10 px-4 animate-fade-in">
      {/* Flag stripe accent */}
      <div className="flex justify-center mb-6">
        <div className="flex rounded-full overflow-hidden shadow-md h-2 w-40">
          <div className="flex-1" style={{ background: '#1A7A2E' }} />
          <div className="flex-1" style={{ background: '#F5C800' }} />
          <div className="flex-1" style={{ background: '#CC1714' }} />
        </div>
      </div>

      <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-2">
        {t.welcome}
      </p>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 text-shadow">
        {t.tagline}
      </h1>

      <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        {t.desc}
      </p>

      {/* Stats */}
      <div className="flex justify-center gap-8 mt-8">
        {t.stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-black" style={{ color: '#1A7A2E' }}>{s.value}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
