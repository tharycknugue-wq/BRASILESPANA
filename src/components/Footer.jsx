import { Link } from 'react-router-dom'
import { Heart, Instagram, Facebook, MessageCircle } from 'lucide-react'

export default function Footer({ lang }) {
  const t = {
    pt: {
      tagline: 'Conectando brasileiros na Espanha',
      categories: 'Categorias',
      links: 'Links',
      about: 'Sobre nós',
      contact: 'Contato',
      privacy: 'Privacidade',
      terms: 'Termos de uso',
      rights: 'Todos os direitos reservados',
      made: 'Feito com',
      for: 'para brasileiros na Espanha',
      cats: ['Serviços', 'Produtos', 'Desapego', 'Doação', 'Vagas', 'Voluntariado', 'Promoções'],
    },
    es: {
      tagline: 'Conectando brasileños en España',
      categories: 'Categorías',
      links: 'Enlaces',
      about: 'Sobre nosotros',
      contact: 'Contacto',
      privacy: 'Privacidad',
      terms: 'Términos de uso',
      rights: 'Todos los derechos reservados',
      made: 'Hecho con',
      for: 'para brasileños en España',
      cats: ['Servicios', 'Productos', 'Desapego', 'Donación', 'Empleo', 'Voluntariado', 'Promociones'],
    },
  }[lang]

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-2">
              <img src="/images/logomarca.png" alt="BRASILESPANA" style={{ height: '36px', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.4))' }} />
            </div>
            <p className="text-sm text-gray-500 mb-4">{t.tagline}</p>
            <div className="flex gap-3">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-green transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">{t.categories}</h4>
            <ul className="space-y-2">
              {t.cats.map((cat) => (
                <li key={cat}>
                  <Link to={`/anuncios/${cat.toLowerCase()}`} className="text-sm hover:text-brand-yellow transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">{t.links}</h4>
            <ul className="space-y-2 text-sm">
              {[t.about, t.contact, t.privacy, t.terms].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-brand-yellow transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} BRASILESPANA — {t.rights}</span>
          <span className="flex items-center gap-1">
            {t.made} <Heart size={11} className="text-red-500 fill-red-500" /> {t.for}
          </span>
        </div>
      </div>
    </footer>
  )
}
