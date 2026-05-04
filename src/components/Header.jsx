import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Globe, User } from 'lucide-react'
import { useLang } from '../lib/lang'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { lang, toggleLang } = useLang()

  const t = {
    pt: { login: 'Entrar', publish: 'Publicar Anúncio', home: 'Início', about: 'Sobre', contact: 'Contato' },
    es: { login: 'Entrar', publish: 'Publicar Anuncio', home: 'Inicio', about: 'Sobre nosotros', contact: 'Contacto' },
  }[lang]

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-gray-100" style={{ backgroundColor: '#111827' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#1A7A2E"/>
              <polygon points="50,12 88,72 12,72" fill="#F5C800"/>
              <circle cx="50" cy="54" r="17" fill="#CC1714"/>
              <text x="50" y="60" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="white">BR</text>
            </svg>
          </div>
          <span className="hidden sm:block">
            <img src="/images/logomarca.png" alt="BRASILESPANA" style={{ height: '28px', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.4))' }} />
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-brand-green transition-colors">{t.home}</Link>
          <Link to="/sobre" className="hover:text-brand-green transition-colors">{t.about}</Link>
          <Link to="/contato" className="hover:text-brand-green transition-colors">{t.contact}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            title="Trocar idioma / Cambiar idioma"
          >
            <Globe size={14} />
            {lang === 'pt' ? '🇧🇷 PT' : '🇪🇸 ES'}
          </button>

          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
            <User size={15} />
            {t.login}
          </button>

          <button
            onClick={() => navigate('/novo-anuncio')}
            className="btn-primary text-sm py-2 px-4 hidden sm:block"
          >
            {t.publish}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 animate-fade-in">
          <Link to="/" className="text-gray-700 font-medium py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>{t.home}</Link>
          <Link to="/sobre" className="text-gray-700 font-medium py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>{t.about}</Link>
          <Link to="/contato" className="text-gray-700 font-medium py-2 hover:text-brand-green" onClick={() => setMenuOpen(false)}>{t.contact}</Link>
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <button className="flex items-center gap-2 text-gray-700 font-medium py-2 hover:text-brand-green">
              <User size={16} /> {t.login}
            </button>
            <button
              onClick={() => { navigate('/novo-anuncio'); setMenuOpen(false) }}
              className="btn-primary text-sm text-center"
            >
              {t.publish}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
