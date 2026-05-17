import { useNavigate } from 'react-router-dom'
import { UserPlus, Edit, MessageSquare, CreditCard, Search, Shield, MapPin, PlayCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'

const TEXT = {
  pt: {
    title: 'Como funciona',
    subtitle: 'Em 3 passos você está conectado à comunidade',
    steps: [
      { icon: UserPlus, title: 'Crie sua conta', desc: 'Cadastro rápido e gratuito. Apenas e-mail e WhatsApp.' },
      { icon: Edit, title: 'Publique seu anúncio', desc: 'Conta grátis para navegar. Para publicar, escolha o plano Anunciante: 12,99 €/mês via PayPal.' },
      { icon: MessageSquare, title: 'Conecte-se', desc: 'Receba contatos, converse pelo chat e construa sua reputação na comunidade.' },
    ],
    featuresTitle: 'O que você ganha',
    features: [
      { icon: Search, title: 'Marketplace bilíngue', desc: 'Anúncios em português e espanhol, com filtros por Comunidade Autônoma, Província, Município e Bairro' },
      { icon: CreditCard, title: 'Sem fidelidade', desc: 'Cancele a qualquer momento antes do vencimento. Cobrança transparente via PayPal.' },
      { icon: Shield, title: 'Proteção RGPD + LGPD', desc: 'Seus dados ficam seguros. Conformidade europeia (RGPD) e brasileira (LGPD).' },
      { icon: MapPin, title: 'Foco local', desc: 'Resultados perto de você. Encontre brasileiros na sua cidade ou bairro.' },
    ],
    ctaTitle: 'Pronto para anunciar?',
    ctaDesc: 'Junte-se aos brasileiros que já fazem parte da comunidade.',
    ctaBtn: 'Criar conta',
    ctaSecondary: 'Ver anúncios',
    tutorialTitle: 'Tutorial em vídeo',
    tutorialDesc: 'Aprenda a usar a plataforma em poucos minutos.',
    videos: [
      { title: 'Criando sua conta', soon: 'Em breve' },
      { title: 'Verificação de anunciante', soon: 'Em breve' },
      { title: 'Publicando seu anúncio', soon: 'Em breve' },
    ],
  },
  es: {
    title: 'Cómo funciona',
    subtitle: 'En 3 pasos estás conectado a la comunidad',
    steps: [
      { icon: UserPlus, title: 'Crea tu cuenta', desc: 'Registro rápido y gratis. Solo e-mail y WhatsApp.' },
      { icon: Edit, title: 'Publica tu anuncio', desc: 'Cuenta gratis para navegar. Para publicar, elige el plan Anunciante: 12,99 €/mes vía PayPal.' },
      { icon: MessageSquare, title: 'Conéctate', desc: 'Recibe contactos, conversa por el chat y construye tu reputación en la comunidad.' },
    ],
    featuresTitle: 'Lo que obtienes',
    features: [
      { icon: Search, title: 'Marketplace bilingüe', desc: 'Anuncios en portugués y español, con filtros por Comunidad Autónoma, Provincia, Municipio y Barrio' },
      { icon: CreditCard, title: 'Sin permanencia', desc: 'Cancela cuando quieras antes del vencimiento. Cobro transparente vía PayPal.' },
      { icon: Shield, title: 'Protección RGPD + LGPD', desc: 'Tus datos están seguros. Cumplimiento europeo (RGPD) y brasileño (LGPD).' },
      { icon: MapPin, title: 'Foco local', desc: 'Resultados cerca de ti. Encuentra brasileños en tu ciudad o barrio.' },
    ],
    ctaTitle: '¿Listo para anunciar?',
    ctaDesc: 'Únete a los brasileños que ya forman parte de la comunidad.',
    ctaBtn: 'Crear cuenta',
    ctaSecondary: 'Ver anuncios',
    tutorialTitle: 'Tutorial en vídeo',
    tutorialDesc: 'Aprende a usar la plataforma en pocos minutos.',
    videos: [
      { title: 'Crear tu cuenta', soon: 'Próximamente' },
      { title: 'Verificación de anunciante', soon: 'Próximamente' },
      { title: 'Publicar tu anuncio', soon: 'Próximamente' },
    ],
  },
}

export default function ComoFuncionaPage() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const t = TEXT[lang]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader lang={lang} backTo="/" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Steps */}
        <section className="grid sm:grid-cols-3 gap-4 mb-8">
          {t.steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black"
                     style={{ background: '#1A7A2E' }}>
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                     style={{ background: '#E8F5E9' }}>
                  <Icon size={20} style={{ color: '#1A7A2E' }} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            )
          })}
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-lg font-black text-gray-900 mb-4 px-1">{t.featuresTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {t.features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: '#FFFDE7' }}>
                    <Icon size={18} style={{ color: '#B8860B' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-0.5">{f.title}</h3>
                    <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Tutorial em vídeo */}
        <section className="mb-8">
          <h2 className="text-lg font-black text-gray-900 mb-1 px-1">{t.tutorialTitle}</h2>
          <p className="text-sm text-gray-500 mb-4 px-1">{t.tutorialDesc}</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {t.videos.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <PlayCircle size={40} className="text-white/70" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                    {v.soon}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-3xl shadow-lg p-6 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #1A7A2E 0%, #0d5e1f 100%)' }}>
          <h2 className="text-xl font-black mb-2">{t.ctaTitle}</h2>
          <p className="text-sm mb-5 opacity-90">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/cadastro')}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white"
              style={{ color: '#1A7A2E' }}>
              {t.ctaBtn}
            </button>
            <button onClick={() => navigate('/anuncios/todos')}
              className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-white text-white hover:bg-white/10 transition-colors">
              {t.ctaSecondary}
            </button>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
