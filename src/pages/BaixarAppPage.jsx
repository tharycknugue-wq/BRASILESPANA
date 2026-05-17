import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download, Smartphone, Apple, Chrome, Share2, PlusSquare, CheckCircle, Zap, WifiOff, BellRing,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'

const TEXT = {
  pt: {
    title: 'Baixe o app BRASILESPAÑA',
    subtitle: 'Instale no seu celular e tenha a comunidade sempre à mão — funciona em qualquer marca: Android, iPhone, tablet ou computador.',
    install: 'Instalar agora',
    installed: 'App instalado! 🎉',
    notReady: 'Use o botão do navegador para instalar (veja os passos abaixo).',
    open: 'Abrir o app',
    benefitsTitle: 'Por que instalar',
    benefits: [
      { icon: Zap,     t: 'Rápido', d: 'Abre direto da tela inicial, como um app nativo' },
      { icon: WifiOff, t: 'Funciona offline', d: 'As telas principais abrem mesmo sem internet' },
      { icon: BellRing,t: 'Sempre à mão', d: 'Ícone no celular, sem ocupar espaço como app de loja' },
      { icon: CheckCircle, t: 'Sem vírus', d: 'Instala pelo próprio navegador — nada de APK ou loja' },
    ],
    androidTitle: 'No Android (Chrome)',
    android: [
      'Toque no botão "Instalar agora" acima',
      'Ou: menu ⋮ do Chrome → "Instalar app" / "Adicionar à tela inicial"',
      'Confirme — o ícone aparece na sua tela inicial',
    ],
    iosTitle: 'No iPhone / iPad (Safari)',
    ios: [
      'Toque no botão Compartilhar do Safari',
      'Escolha "Adicionar à Tela de Início"',
      'Confirme — o ícone aparece como um app',
    ],
    desktopTitle: 'No computador (Chrome/Edge)',
    desktop: [
      'Clique no ícone de instalar na barra de endereço (⊕)',
      'Ou menu do navegador → "Instalar BRASILESPAÑA"',
    ],
    safe: 'Instalação 100% segura: é o próprio site, sem APK, sem loja, sem vírus. Atualiza sozinho.',
    cta: 'Entrar na plataforma',
  },
  es: {
    title: 'Descarga la app BRASILESPAÑA',
    subtitle: 'Instálala en tu móvil y ten la comunidad siempre a mano — funciona en cualquier marca: Android, iPhone, tablet u ordenador.',
    install: 'Instalar ahora',
    installed: '¡App instalada! 🎉',
    notReady: 'Usa el botón del navegador para instalar (mira los pasos abajo).',
    open: 'Abrir la app',
    benefitsTitle: 'Por qué instalar',
    benefits: [
      { icon: Zap,     t: 'Rápido', d: 'Abre directo desde la pantalla de inicio, como una app nativa' },
      { icon: WifiOff, t: 'Funciona sin conexión', d: 'Las pantallas principales abren sin internet' },
      { icon: BellRing,t: 'Siempre a mano', d: 'Icono en el móvil, sin ocupar espacio como app de tienda' },
      { icon: CheckCircle, t: 'Sin virus', d: 'Se instala desde el navegador — sin APK ni tienda' },
    ],
    androidTitle: 'En Android (Chrome)',
    android: [
      'Pulsa el botón "Instalar ahora" de arriba',
      'O: menú ⋮ de Chrome → "Instalar app" / "Añadir a pantalla de inicio"',
      'Confirma — el icono aparece en tu pantalla de inicio',
    ],
    iosTitle: 'En iPhone / iPad (Safari)',
    ios: [
      'Pulsa el botón Compartir de Safari',
      'Elige "Añadir a pantalla de inicio"',
      'Confirma — el icono aparece como una app',
    ],
    desktopTitle: 'En el ordenador (Chrome/Edge)',
    desktop: [
      'Pulsa el icono de instalar en la barra de direcciones (⊕)',
      'O menú del navegador → "Instalar BRASILESPAÑA"',
    ],
    safe: 'Instalación 100% segura: es el propio sitio, sin APK, sin tienda, sin virus. Se actualiza solo.',
    cta: 'Entrar en la plataforma',
  },
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export default function BaixarAppPage() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const t = TEXT[lang]
  const [prompt, setPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (isStandalone()) { setInstalled(true); return }
    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    const onInstalled = () => setInstalled(true)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const choice = await prompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }

  const Steps = ({ title, Icon, steps }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E8F5E9' }}>
          <Icon size={18} style={{ color: '#1A7A2E' }} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ background: '#1A7A2E' }}>{i + 1}</span>
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader backTo="/" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg"
               style={{ background: '#1A7A2E' }}>
            <Smartphone size={36} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">{t.subtitle}</p>

          {installed ? (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
                 style={{ background: '#E8F5E9', color: '#1A7A2E' }}>
              <CheckCircle size={18} /> {t.installed}
            </div>
          ) : (
            <button
              onClick={handleInstall}
              disabled={!prompt}
              title={!prompt ? t.notReady : ''}
              className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm shadow-lg
                         active:scale-95 transition-transform disabled:opacity-60"
              style={{ background: '#1A7A2E' }}
            >
              <Download size={18} /> {t.install}
            </button>
          )}
          {!installed && !prompt && (
            <p className="text-xs text-gray-400 mt-2">{t.notReady}</p>
          )}
        </div>

        {/* Benefícios */}
        <h2 className="text-lg font-black text-gray-900 mb-3 px-1">{t.benefitsTitle}</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {t.benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                     style={{ background: '#FFFDE7' }}>
                  <Icon size={18} style={{ color: '#B8860B' }} />
                </div>
                <p className="font-bold text-gray-800 text-sm">{b.t}</p>
                <p className="text-xs text-gray-500 leading-snug mt-0.5">{b.d}</p>
              </div>
            )
          })}
        </div>

        {/* Passo a passo */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <Steps title={t.androidTitle} Icon={Chrome}     steps={t.android} />
          <Steps title={t.iosTitle}     Icon={Apple}      steps={t.ios} />
          <Steps title={t.desktopTitle} Icon={PlusSquare} steps={t.desktop} />
          <div className="rounded-2xl p-5 flex items-center gap-3 text-sm"
               style={{ background: '#E8F5E9', color: '#1A7A2E' }}>
            <Share2 size={20} className="flex-shrink-0" />
            <span className="font-semibold leading-snug">{t.safe}</span>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2"
            style={{ borderColor: '#1A7A2E', color: '#1A7A2E' }}>
            {t.cta} →
          </button>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
