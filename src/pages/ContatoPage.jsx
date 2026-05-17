import { useState } from 'react'
import { Mail, Globe, Instagram, Facebook, MessageCircle, Send, LifeBuoy, Users, Lightbulb, ClipboardCheck, Phone, ChevronDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { CONTACT, SOCIAL } from '../lib/social'
import { sanitize, validateEmail } from '../lib/security'
import { useLang } from '../lib/lang'
import { supabase } from '../lib/supabase'

const TEXT = {
  pt: {
    title: 'Fale com a gente',
    subtitle: 'Suporte, parcerias, imprensa ou só dizer oi',
    formTitle: 'Envie uma mensagem',
    name: 'Seu nome',
    email: 'Seu e-mail',
    subject: 'Assunto',
    message: 'Mensagem',
    submit: 'Enviar',
    sending: 'Enviando...',
    sent: 'Mensagem enviada — vamos responder em breve!',
    errors: {
      name: 'Informe seu nome',
      email: 'E-mail inválido',
      subject: 'Informe o assunto',
      message: 'Escreva sua mensagem',
    },
    channelsTitle: 'Outros canais',
    emailLabel: 'E-mail',
    siteLabel: 'Site',
    socialLabel: 'Redes sociais',
    phoneLabel: 'Telefone',
    faqTitle: 'Perguntas frequentes',
    faq: [
      { q: 'A conta é gratuita?', a: 'Sim. Criar conta e navegar é grátis. Para publicar anúncios é necessário o plano Anunciante por 12,99 €/mês.' },
      { q: 'Como viro Anunciante?', a: 'No seu painel, conclua a verificação de documentos. Após aprovação, você pode assinar o plano e publicar.' },
      { q: 'Posso cancelar quando quiser?', a: 'Sim, sem fidelidade. O acesso continua até o fim do período já pago.' },
      { q: 'Meus documentos ficam seguros?', a: 'Sim. Ficam em armazenamento privado, usados apenas para verificação, conforme o RGPD e a Lei Orgânica 3/2018.' },
    ],
    helpTitle: 'Como podemos ajudar?',
    cats: {
      support:    { t: 'Suporte', d: 'Problemas técnicos e dúvidas de uso' },
      community:  { t: 'Comunidade', d: 'Fórum e troca entre usuários' },
      suggestion: { t: 'Sugestões', d: 'Ideias para melhorar a plataforma' },
      resolution: { t: 'Resoluções', d: 'Resolver pendências e situações' },
    },
  },
  es: {
    title: 'Habla con nosotros',
    subtitle: 'Soporte, colaboraciones, prensa o solo decir hola',
    formTitle: 'Envía un mensaje',
    name: 'Tu nombre',
    email: 'Tu e-mail',
    subject: 'Asunto',
    message: 'Mensaje',
    submit: 'Enviar',
    sending: 'Enviando...',
    sent: '¡Mensaje enviado — te responderemos pronto!',
    errors: {
      name: 'Ingresa tu nombre',
      email: 'E-mail inválido',
      subject: 'Ingresa el asunto',
      message: 'Escribe tu mensaje',
    },
    channelsTitle: 'Otros canales',
    emailLabel: 'E-mail',
    siteLabel: 'Sitio',
    socialLabel: 'Redes sociales',
    phoneLabel: 'Teléfono',
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿La cuenta es gratuita?', a: 'Sí. Crear cuenta y navegar es gratis. Para publicar anuncios se necesita el plan Anunciante por 12,99 €/mes.' },
      { q: '¿Cómo me hago Anunciante?', a: 'En tu panel, completa la verificación de documentos. Tras la aprobación, puedes suscribirte y publicar.' },
      { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, sin permanencia. El acceso sigue hasta el fin del período ya pagado.' },
      { q: '¿Mis documentos están seguros?', a: 'Sí. Se guardan en almacenamiento privado, usados solo para la verificación, conforme al RGPD y la Ley Orgánica 3/2018.' },
    ],
    helpTitle: '¿Cómo podemos ayudar?',
    cats: {
      support:    { t: 'Soporte', d: 'Problemas técnicos y dudas de uso' },
      community:  { t: 'Comunidad', d: 'Foro e intercambio entre usuarios' },
      suggestion: { t: 'Sugerencias', d: 'Ideas para mejorar la plataforma' },
      resolution: { t: 'Resoluciones', d: 'Resolver pendencias y situaciones' },
    },
  },
}

export default function ContatoPage() {
  const { lang } = useLang()
  const t = TEXT[lang]
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: sanitize(v) }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())         e.name    = t.errors.name
    if (!validateEmail(form.email))e.email   = t.errors.email
    if (!form.subject.trim())      e.subject = t.errors.subject
    if (!form.message.trim())      e.message = t.errors.message
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      if (supabase) {
        const { error } = await supabase.from('messages').insert({
          name:    form.name,
          email:   form.email,
          subject: form.subject,
          body:    form.message,
          lang,
        })
        if (error) throw error
      } else {
        await new Promise(r => setTimeout(r, 900))
      }
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setErrors({ message: lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error al enviar. Inténtalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (k) => `w-full px-4 py-3 rounded-xl border text-sm transition-all
    focus:outline-none focus:ring-2
    ${errors[k] ? 'border-red-400 focus:ring-red-100 bg-red-50'
                : 'border-gray-200 focus:border-brand-green focus:ring-green-100'}`

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader lang={lang} backTo="/" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Canais */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-black uppercase tracking-wide text-gray-400 mb-4">{t.channelsTitle}</h2>
          <ul className="space-y-3">
            <li>
              <a href={`mailto:${CONTACT.email}`}
                 className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E8F5E9' }}>
                  <Mail size={16} style={{ color: '#1A7A2E' }} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">{t.emailLabel}</div>
                  <div className="font-bold text-gray-800 text-sm">{CONTACT.email}</div>
                </div>
              </a>
            </li>
            <li>
              <a href={CONTACT.website} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFF3E0' }}>
                  <Globe size={16} style={{ color: '#E65100' }} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">{t.siteLabel}</div>
                  <div className="font-bold text-gray-800 text-sm">{CONTACT.website.replace('https://', '')}</div>
                </div>
              </a>
            </li>
          </ul>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-xs font-semibold text-gray-400 uppercase mb-3">{t.socialLabel}</div>
            <div className="flex gap-3">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-pink-100 flex items-center justify-center transition-colors group">
                <Instagram size={16} className="text-gray-600 group-hover:text-pink-600" />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors group">
                <Facebook size={16} className="text-gray-600 group-hover:text-blue-600" />
              </a>
              <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors group">
                <MessageCircle size={16} className="text-gray-600 group-hover:text-green-600" />
              </a>
            </div>
          </div>
        </section>

        {/* Como podemos ajudar */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-black uppercase tracking-wide text-gray-400 mb-4">{t.helpTitle}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: 'support',    Icon: LifeBuoy,       bg: '#E8F5E9', c: '#1A7A2E' },
              { k: 'community',  Icon: Users,          bg: '#E3F2FD', c: '#1565C0' },
              { k: 'suggestion', Icon: Lightbulb,      bg: '#FFFDE7', c: '#B8860B' },
              { k: 'resolution', Icon: ClipboardCheck, bg: '#F3E5F5', c: '#6A1B9A' },
            ].map(({ k, Icon, bg, c }) => (
              <div key={k} className="flex items-start gap-2.5 p-3 rounded-2xl border border-gray-100">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon size={16} style={{ color: c }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{t.cats[k].t}</p>
                  <p className="text-xs text-gray-500 leading-tight mt-0.5">{t.cats[k].d}</p>
                </div>
              </div>
            ))}
          </div>
          {CONTACT.phone && (
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
               className="flex items-center gap-3 mt-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E8F5E9' }}>
                <Phone size={16} style={{ color: '#1A7A2E' }} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase">{t.phoneLabel}</div>
                <div className="font-bold text-gray-800 text-sm">{CONTACT.phone}</div>
              </div>
            </a>
          )}
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-black mb-4" style={{ color: '#1A7A2E' }}>{t.faqTitle}</h2>
          <ul className="divide-y divide-gray-100">
            {t.faq.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left">
                  <span className="text-sm font-semibold text-gray-800">{item.q}</span>
                  <ChevronDown size={16}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="text-sm text-gray-600 leading-relaxed pb-3 -mt-1">{item.a}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <section className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-black mb-4" style={{ color: '#1A7A2E' }}>{t.formTitle}</h2>

          {sent && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
              <Send size={14} />
              {t.sent}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.name}</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} className={inputCls('name')} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputCls('email')} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.subject}</label>
              <input value={form.subject} onChange={e => update('subject', e.target.value)} className={inputCls('subject')} />
              {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.message}</label>
              <textarea rows={5} value={form.message} onChange={e => update('message', e.target.value)} className={inputCls('message') + ' resize-y'} />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm
                         transition-all active:scale-95 disabled:opacity-50"
              style={{ background: '#1A7A2E' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Send size={15} />}
              {loading ? t.sending : t.submit}
            </button>
          </form>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
