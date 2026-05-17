import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'

const TEXT = {
  pt: {
    code: '404',
    title: 'Página não encontrada',
    desc: 'A página que você procura não existe ou foi movida.',
    backHome: 'Voltar para o início',
  },
  es: {
    code: '404',
    title: 'Página no encontrada',
    desc: 'La página que buscas no existe o fue movida.',
    backHome: 'Volver al inicio',
  },
}

export default function NotFoundPage() {
  const { lang } = useLang()
  const t = TEXT[lang]
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader />
      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-7xl font-black mb-4" style={{ color: '#1A7A2E' }}>{t.code}</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm mb-8">{t.desc}</p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: '#1A7A2E' }}>
            <Home size={15} /> {t.backHome}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
