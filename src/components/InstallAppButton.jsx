import { useEffect, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { useLang } from '../lib/lang'

const TEXT = {
  pt: {
    title:    'Instalar app',
    desc:     'Baixe o BRASILESPAÑA no seu celular — funciona como um aplicativo nativo.',
    install:  'Instalar',
    later:    'Agora não',
    iosTitle: 'Como instalar no iPhone',
    iosStep1: '1. Toque no botão Compartilhar do Safari',
    iosStep2: '2. Escolha "Adicionar à Tela de Início"',
  },
  es: {
    title:    'Instalar app',
    desc:     'Descarga BRASILESPAÑA en tu móvil — funciona como una app nativa.',
    install:  'Instalar',
    later:    'Ahora no',
    iosTitle: 'Cómo instalar en iPhone',
    iosStep1: '1. Toca el botón Compartir de Safari',
    iosStep2: '2. Elige "Agregar a Pantalla de Inicio"',
  },
}

const DISMISS_KEY = 'be_install_dismissed'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream
}

export default function InstallAppButton() {
  const { lang }   = useLang()
  const t          = TEXT[lang]
  const [prompt, setPrompt]     = useState(null)
  const [visible, setVisible]   = useState(false)
  const [showIos, setShowIos]   = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (localStorage.getItem(DISMISS_KEY) === '1') return

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    if (isIos()) {
      setVisible(true)
      setShowIos(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (showIos) return
    if (!prompt) return
    prompt.prompt()
    const choice = await prompt.userChoice
    if (choice.outcome === 'accepted') {
      setVisible(false)
    }
    setPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl p-4 border-2" style={{ borderColor: '#1A7A2E' }}>
        <button
          onClick={handleDismiss}
          aria-label="Fechar"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: '#E8F5E9' }}>
            <Smartphone size={22} style={{ color: '#1A7A2E' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-900 text-sm mb-0.5">{t.title}</h3>
            <p className="text-xs text-gray-500 leading-snug mb-3">{t.desc}</p>

            {showIos ? (
              <div className="text-xs text-gray-700 space-y-0.5 mb-3 bg-gray-50 rounded-lg p-2">
                <div className="font-bold">{t.iosTitle}</div>
                <div>{t.iosStep1}</div>
                <div>{t.iosStep2}</div>
              </div>
            ) : null}

            <div className="flex gap-2">
              {!showIos && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white"
                  style={{ background: '#1A7A2E' }}
                >
                  <Download size={13} /> {t.install}
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                {t.later}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
