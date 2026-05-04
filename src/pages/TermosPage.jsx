import { FileText, Mail } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { CONTACT } from '../lib/social'
import { useLang } from '../lib/lang'

const TEXT = {
  pt: {
    title: 'Termos de Uso',
    updatedAt: 'Atualizados em 2026',
    intro: 'Ao usar o BRASILESPAÑA, você concorda com estes termos. Leia com atenção.',
    sections: [
      {
        title: '1. O serviço',
        body: 'BRASILESPAÑA é um marketplace digital que conecta brasileiros residentes na Espanha. Não somos responsáveis por transações realizadas entre usuários — atuamos como intermediário tecnológico.',
      },
      {
        title: '2. Cadastro',
        body: 'Você precisa ter pelo menos 18 anos. As informações fornecidas devem ser verdadeiras. Você é responsável pela segurança da sua conta e senha.',
      },
      {
        title: '3. Anúncios e conteúdo',
        body: 'Você é o único responsável pelos anúncios que publica. É proibido conteúdo ilegal, ofensivo, falso, discriminatório ou que viole direitos de terceiros. Reservamos o direito de remover anúncios que violem estas regras.',
      },
      {
        title: '4. Assinatura e pagamento',
        body: 'A assinatura mensal de R$ 30 (ou equivalente em moeda local) dá direito a publicar anúncios. O processamento é feito via PayPal. Você pode cancelar a qualquer momento antes do próximo vencimento, sem multa.',
      },
      {
        title: '5. Cancelamento',
        body: 'Cancelamento sem fidelidade. O acesso permanece ativo até o fim do período já pago. Não há reembolso proporcional, exceto nos casos previstos pela legislação aplicável (RGPD/LGPD/Defesa do Consumidor).',
      },
      {
        title: '6. Proibições',
        body: 'É vedado: vender produtos ilegais, falsos ou sem direito de propriedade; fraudar identidade; assediar outros usuários; tentar burlar sistemas de segurança ou pagamento; usar a plataforma para finalidades não previstas.',
      },
      {
        title: '7. Limitação de responsabilidade',
        body: 'Não nos responsabilizamos por interrupções, perdas, danos ou prejuízos decorrentes do uso da plataforma, na máxima extensão permitida por lei. Recomendamos cautela em transações financeiras e encontros pessoais.',
      },
      {
        title: '8. Alterações',
        body: 'Podemos atualizar estes termos. Mudanças relevantes serão comunicadas por e-mail e exibidas na plataforma com pelo menos 15 dias de antecedência.',
      },
      {
        title: '9. Foro',
        body: 'Para usuários residentes na Espanha, fica eleito o foro espanhol competente. Para usuários no Brasil, foro brasileiro. Aplica-se a legislação local.',
      },
    ],
    contactTitle: 'Dúvidas sobre os termos?',
  },
  es: {
    title: 'Términos de Uso',
    updatedAt: 'Actualizados en 2026',
    intro: 'Al usar BRASILESPAÑA, aceptas estos términos. Léelos con atención.',
    sections: [
      {
        title: '1. El servicio',
        body: 'BRASILESPAÑA es un marketplace digital que conecta a brasileños residentes en España. No somos responsables por transacciones entre usuarios — actuamos como intermediario tecnológico.',
      },
      {
        title: '2. Registro',
        body: 'Debes tener al menos 18 años. La información proporcionada debe ser verdadera. Eres responsable de la seguridad de tu cuenta y contraseña.',
      },
      {
        title: '3. Anuncios y contenido',
        body: 'Eres el único responsable por los anuncios que publicas. Está prohibido contenido ilegal, ofensivo, falso, discriminatorio o que viole derechos de terceros. Nos reservamos el derecho de eliminar anuncios que violen estas reglas.',
      },
      {
        title: '4. Suscripción y pago',
        body: 'La suscripción mensual de R$ 30 (o equivalente en moneda local) da derecho a publicar anuncios. El procesamiento se realiza vía PayPal. Puedes cancelar en cualquier momento antes del próximo vencimiento, sin penalización.',
      },
      {
        title: '5. Cancelación',
        body: 'Cancelación sin permanencia. El acceso permanece activo hasta el fin del período pagado. No hay reembolso proporcional, salvo en los casos previstos por la legislación aplicable (RGPD/LGPD/Defensa del Consumidor).',
      },
      {
        title: '6. Prohibiciones',
        body: 'Está prohibido: vender productos ilegales, falsos o sin derecho de propiedad; falsificar identidad; acosar a otros usuarios; intentar evadir sistemas de seguridad o pago; usar la plataforma con fines no previstos.',
      },
      {
        title: '7. Limitación de responsabilidad',
        body: 'No nos responsabilizamos por interrupciones, pérdidas, daños o perjuicios derivados del uso de la plataforma, en la máxima medida permitida por ley. Recomendamos precaución en transacciones financieras y encuentros personales.',
      },
      {
        title: '8. Modificaciones',
        body: 'Podemos actualizar estos términos. Cambios relevantes serán comunicados por e-mail y mostrados en la plataforma con al menos 15 días de antelación.',
      },
      {
        title: '9. Jurisdicción',
        body: 'Para usuarios residentes en España, jurisdicción española competente. Para usuarios en Brasil, jurisdicción brasileña. Se aplica la legislación local.',
      },
    ],
    contactTitle: '¿Dudas sobre los términos?',
  },
}

export default function TermosPage() {
  const { lang } = useLang()
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
               style={{ background: '#FFFDE7' }}>
            <FileText size={28} style={{ color: '#B8860B' }} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-400 text-xs">{t.updatedAt}</p>
        </div>

        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed font-medium">{t.intro}</p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <ol className="space-y-5">
            {t.sections.map((sec, i) => (
              <li key={i}>
                <h2 className="text-sm font-black text-gray-900 mb-1.5" style={{ color: '#1A7A2E' }}>
                  {sec.title}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">{sec.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-gradient-to-br rounded-3xl shadow-sm p-6"
                 style={{ background: 'linear-gradient(135deg, #FFFDE7 0%, #E8F5E9 100%)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Mail size={20} style={{ color: '#1A7A2E' }} />
            <h2 className="text-base font-black text-gray-900">{t.contactTitle}</h2>
          </div>
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
