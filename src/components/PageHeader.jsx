import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ArrowLeft } from 'lucide-react'

const NAV = {
  pt: { nav: ['Início', 'Sobre', 'Como funciona', 'Contato'], publish: 'Publicar Anúncio' },
  es: { nav: ['Inicio', 'Sobre nosotros', 'Cómo funciona', 'Contacto'], publish: 'Publicar Anuncio' },
}

export default function PageHeader({ lang = 'pt', backTo = '/', backLabel }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const t = NAV[lang]
  const back = backLabel || (lang === 'pt' ? 'Voltar' : 'Volver')

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <header
      className="w-full relative flex flex-col"
      style={{
        backgroundImage:    "url('/images/logomarca.png')",
        backgroundSize:     'contain',
        backgroundPosition: 'center center',
        backgroundRepeat:   'no-repeat',
        backgroundColor:    '#111827',
        minHeight:          '120px',
      }}
    >
      <div className="flex items-center justify-between px-4 pt-4" ref={menuRef}>

        {/* Hamburger — esquerda */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="w-10 h-10 flex items-center justify-center rounded-xl
                     bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Botão Voltar — direita */}
        <button
          onClick={() => navigate(backTo)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                     bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
        >
          <ArrowLeft size={14} />
          {back}
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-4 w-52 bg-white rounded-2xl shadow-xl z-50 border border-gray-100 overflow-hidden animate-fade-in">
            {t.nav.map(item => (
              <button
                key={item}
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {item}
              </button>
            ))}
            <div className="border-t border-gray-100 mx-4" />
            <button
              onClick={() => { navigate('/novo-anuncio'); setMenuOpen(false) }}
              className="w-full text-left px-5 py-3 text-sm font-bold text-brand-green hover:bg-green-50 transition-colors"
            >
              + {t.publish}
            </button>
          </div>
        )}
      </div>

      {/* Logo centralizado na área do céu */}
      <div className="flex-1 flex items-center justify-center py-4">
        <button onClick={() => navigate('/')} className="select-none">
          <img src="/images/logomarca.png" alt="BRASILESPANA" style={{ height: '56px', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.4))' }} />
        </button>
      </div>
    </header>
  )
}
