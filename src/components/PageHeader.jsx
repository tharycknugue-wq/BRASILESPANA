import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ArrowLeft } from 'lucide-react'
import { useLang } from '../lib/lang'
import SideMenu from './SideMenu'
import LangToggle from './LangToggle'

export default function PageHeader({ showMenu = true, back }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang } = useLang()

  return (
    <>
      <header
        className="w-full relative flex flex-col"
        style={{
          backgroundImage:    "url('/images/logomarca.png')",
          backgroundSize:     'contain',
          backgroundPosition: 'center 78%',
          backgroundRepeat:   'no-repeat',
          backgroundColor:    '#87CEEB',
          minHeight:          '165px',
        }}
      >
        <div className="flex items-center px-4 pt-4">
          {/* Menu — esquerda */}
          {showMenu && (
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
              className="w-10 h-10 flex items-center justify-center rounded-xl
                         bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="flex-1" />

          {/* Voltar — direita */}
          {back && (
            <Link
              to={back}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm
                         bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
            >
              <ArrowLeft size={15} />
              {lang === 'es' ? 'Volver' : 'Voltar'}
            </Link>
          )}
        </div>

        {showMenu && <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />}
      </header>

      {/* Faixa tricolor */}
      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>

      {/* Seletor de idioma — componente padrão */}
      <div className="flex justify-center px-4 pt-4 pb-1">
        <LangToggle />
      </div>
    </>
  )
}
