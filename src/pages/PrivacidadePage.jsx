import { useState } from 'react'
import { Shield, Database, UserCheck, Trash2, Mail } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { CONTACT } from '../lib/social'

const TEXT = {
  pt: {
    title: 'Política de Privacidade',
    updatedAt: 'Atualizada em 2026',
    intro: 'O BRASILESPAÑA respeita sua privacidade e cumpre o Regulamento Geral de Proteção de Dados (RGPD) da União Europeia e a Lei Geral de Proteção de Dados (LGPD) do Brasil.',
    sections: [
      {
        icon: Database,
        title: 'Dados que coletamos',
        items: [
          'Dados de cadastro: nome, e-mail e WhatsApp',
          'Dados dos anúncios: título, descrição, categoria, localização',
          'Dados de pagamento: processados via PayPal — não armazenamos cartão',
          'Dados técnicos: IP, navegador e cookies essenciais',
        ],
      },
      {
        icon: UserCheck,
        title: 'Como usamos',
        items: [
          'Permitir que você publique anúncios e seja contatado',
          'Processar sua assinatura mensal',
          'Comunicar atualizações importantes (não enviamos spam)',
          'Cumprir obrigações legais',
        ],
      },
      {
        icon: Shield,
        title: 'Seus direitos (RGPD/LGPD)',
        items: [
          'Acesso aos seus dados',
          'Retificação de informações incorretas',
          'Exclusão da conta e dos dados',
          'Portabilidade para outro serviço',
          'Oposição a tratamentos específicos',
        ],
      },
      {
        icon: Trash2,
        title: 'Retenção e exclusão',
        items: [
          'Mantemos seus dados enquanto sua conta estiver ativa',
          'Após exclusão, dados são removidos em até 30 dias',
          'Backups são automaticamente expirados em 90 dias',
          'Dados fiscais retidos pelo período exigido por lei',
        ],
      },
    ],
    contactTitle: 'Encarregado de Proteção de Dados',
    contactDesc: 'Para qualquer solicitação envolvendo seus dados pessoais, entre em contato:',
  },
  es: {
    title: 'Política de Privacidad',
    updatedAt: 'Actualizada en 2026',
    intro: 'BRASILESPAÑA respeta tu privacidad y cumple el Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley General de Protección de Datos (LGPD) de Brasil.',
    sections: [
      {
        icon: Database,
        title: 'Datos que recopilamos',
        items: [
          'Datos de registro: nombre, e-mail y WhatsApp',
          'Datos de anuncios: título, descripción, categoría, ubicación',
          'Datos de pago: procesados vía PayPal — no almacenamos tarjeta',
          'Datos técnicos: IP, navegador y cookies esenciales',
        ],
      },
      {
        icon: UserCheck,
        title: 'Cómo los usamos',
        items: [
          'Permitir que publiques anuncios y seas contactado',
          'Procesar tu suscripción mensual',
          'Comunicar actualizaciones importantes (no enviamos spam)',
          'Cumplir obligaciones legales',
        ],
      },
      {
        icon: Shield,
        title: 'Tus derechos (RGPD/LGPD)',
        items: [
          'Acceso a tus datos',
          'Rectificación de información incorrecta',
          'Eliminación de la cuenta y datos',
          'Portabilidad a otro servicio',
          'Oposición a tratamientos específicos',
        ],
      },
      {
        icon: Trash2,
        title: 'Retención y eliminación',
        items: [
          'Mantenemos tus datos mientras tu cuenta esté activa',
          'Tras la eliminación, los datos se borran en hasta 30 días',
          'Las copias de seguridad caducan automáticamente en 90 días',
          'Datos fiscales retenidos por el período exigido por ley',
        ],
      },
    ],
    contactTitle: 'Delegado de Protección de Datos',
    contactDesc: 'Para cualquier solicitud sobre tus datos personales, contacta:',
  },
}

export default function PrivacidadePage() {
  const [lang] = useState('pt')
  const t = TEXT[lang]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader lang={lang} backTo="/" />

      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4"
               style={{ background: '#E8F5E9' }}>
            <Shield size={28} style={{ color: '#1A7A2E' }} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-400 text-xs">{t.updatedAt}</p>
        </div>

        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">{t.intro}</p>
        </section>

        {t.sections.map((sec, i) => {
          const Icon = sec.icon
          return (
            <section key={i} className="bg-white rounded-3xl shadow-sm p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: '#E8F5E9' }}>
                  <Icon size={18} style={{ color: '#1A7A2E' }} />
                </div>
                <h2 className="text-base font-black text-gray-900">{sec.title}</h2>
              </div>
              <ul className="space-y-2">
                {sec.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: '#1A7A2E' }} />
                    <span className="leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <section className="bg-gradient-to-br rounded-3xl shadow-sm p-6 mt-6"
                 style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #FFFDE7 100%)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Mail size={20} style={{ color: '#1A7A2E' }} />
            <h2 className="text-base font-black text-gray-900">{t.contactTitle}</h2>
          </div>
          <p className="text-sm text-gray-700 mb-3">{t.contactDesc}</p>
          <a href={`mailto:${CONTACT.email}`}
             className="inline-block px-5 py-2.5 rounded-xl font-bold text-white text-sm"
             style={{ background: '#1A7A2E' }}>
            {CONTACT.email}
          </a>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
