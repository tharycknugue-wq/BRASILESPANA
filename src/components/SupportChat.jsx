import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Bot, Star } from 'lucide-react'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder } from '../lib/founders'
import { getUserThread, userSend, isPartnerEmail } from '../lib/support'

const T = {
  pt: {
    title: 'Suporte',
    greet: 'Olá! Conte o que você precisa — vou direcionar para o fundador certo.',
    greetPartner: 'Olá, parceiro! Sua solicitação tem PRIORIDADE MÁXIMA — diga o que precisa que direciono na hora.',
    partnerTag: 'Parceiro · Prioridade máxima',
    ph: 'Escreva sua mensagem...', send: 'Enviar', you: 'Você', ai: 'Assistente', founder: 'Fundador',
  },
  es: {
    title: 'Soporte',
    greet: '¡Hola! Cuéntame qué necesitas — te dirijo al fundador correcto.',
    greetPartner: '¡Hola, socio! Tu solicitud tiene PRIORIDAD MÁXIMA — dime qué necesitas y te dirijo al instante.',
    partnerTag: 'Socio · Prioridad máxima',
    ph: 'Escribe tu mensaje...', send: 'Enviar', you: 'Tú', ai: 'Asistente', founder: 'Fundador',
  },
}

export default function SupportChat() {
  const { lang } = useLang()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [thread, setThread] = useState(null)
  const endRef = useRef(null)
  const t = T[lang] || T.pt

  const email = user?.email || ''
  const name = user?.user_metadata?.full_name || email
  const partner = isPartnerEmail(email)

  // Verde padrão; parceiro = amarelo padrão do app
  const accent   = partner ? '#F5C800' : '#1A7A2E'
  const onAccent = partner ? '#3a2a00' : '#FFFFFF'

  useEffect(() => {
    if (!open || !email) return
    const refresh = () => setThread(getUserThread(email))
    refresh()
    const id = setInterval(refresh, 3000)
    return () => clearInterval(id)
  }, [open, email])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread, open])

  // Parceiro usa o PartnerDock (amarelo, direto com os fundadores)
  if (!user || isFounder(user) || partner) return null

  const send = () => {
    const text = draft.trim()
    if (!text) return
    const th = userSend({ email, name, lang, text })
    setThread({ ...th })
    setDraft('')
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t.title}
          className="fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
          style={{ background: accent, color: onAccent }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[85] w-[92vw] max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
             style={{ height: '70vh', maxHeight: 560 }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: accent, color: onAccent }}>
            <span className="flex items-center gap-2 font-black text-sm"><Bot size={18} /> {t.title}</span>
            <button onClick={() => setOpen(false)} aria-label="X" className="opacity-80 hover:opacity-100"><X size={20} /></button>
          </div>

          {partner && (
            <div className="flex items-center gap-1.5 px-4 py-2 text-xs font-black"
                 style={{ background: '#FFF7DB', color: '#7B5E00' }}>
              <Star size={13} fill="#F5C800" /> {t.partnerTag}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#F4F8FB' }}>
            <Bubble who={t.ai} side="left" text={partner ? t.greetPartner : t.greet} />
            {(thread?.messages || [])
              .filter(m => m.from !== 'founder')   /* fundador é interno; usuário só vê a IA */
              .map((m, i) => (
                <Bubble
                  key={i}
                  who={m.from === 'user' ? t.you : t.ai}
                  side={m.from === 'user' ? 'right' : 'left'}
                  text={m.text}
                  selfBg={accent}
                  selfColor={onAccent}
                />
              ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
              placeholder={t.ph}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
            />
            <button onClick={send} aria-label={t.send}
              className="px-4 rounded-xl flex items-center" style={{ background: accent, color: onAccent }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Bubble({ who, side, text, accent, selfBg, selfColor }) {
  const right = side === 'right'
  return (
    <div className={`flex flex-col ${right ? 'items-end' : 'items-start'}`}>
      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{who}</span>
      <div
        className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug"
        style={{
          background: right ? (selfBg || '#1A7A2E') : accent ? '#FFF7DB' : '#FFFFFF',
          color: right ? (selfColor || '#FFFFFF') : '#374151',
          border: right ? 'none' : '1px solid #E5E7EB',
        }}
      >
        {text}
      </div>
    </div>
  )
}
