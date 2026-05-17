import { useState } from 'react'
import { Menu, Globe } from 'lucide-react'
import { useLang } from '../lib/lang'
import SideMenu from './SideMenu'

export default function PageHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, toggleLang } = useLang()

  return (
    <header
      className="w-full relative flex flex-col"
      style={{
        backgroundImage:    "url('/images/logomarca.png')",
        backgroundSize:     'contain',
        backgroundPosition: 'center center',
        backgroundRepeat:   'no-repeat',
        backgroundColor:    '#87CEEB',
        minHeight:          '120px',
      }}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        {/* Menu — esquerda */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menu"
          className="w-10 h-10 flex items-center justify-center rounded-xl
                     bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
        >
          <Menu size={20} />
        </button>

        {/* Direita: idioma */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            title="Trocar idioma / Cambiar idioma"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm
                       bg-black/20 text-white hover:bg-black/35 transition-all backdrop-blur-sm"
          >
            <Globe size={14} />
            {lang === 'pt' ? '🇧🇷 PT' : '🇪🇸 ES'}
          </button>
        </div>
      </div>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
