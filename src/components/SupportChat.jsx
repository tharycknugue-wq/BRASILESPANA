import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder } from '../lib/founders'
import { getUserThread, userSend } from '../lib/support'

const T = {
  pt: {
    title: 'Suporte', greet: 'Olá! Conte o que você precisa — vou direcionar para o fundador certo.',
    ph: 'Escreva sua mensagem...', send: 'Enviar', you: 'Você', ai: 'Assistente', founder: 'Fundador',
  },
  es: {
    title: 'Soporte', greet: '¡Hola! Cuéntame qué necesitas — te dirijo al fundador correcto.',
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

  // Atualiza a thread (pega respostas dos fundadores) enquanto aberto
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

  if (!user || isFounder(user)) return null

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
          className="fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          style={{ background: '#1A7A2E' }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[85] w-[92vw] max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
             style={{ height: '70vh', maxHeight: 560 }}>
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: '#1A7A2E' }}>
            <span className="flex items-center gap-2 font-black text-sm"><Bot size={18} /> {t.title}</span>
            <button onClick={() => setOpen(false)} aria-label="X" className="text-white/90 hover:text-white"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#F4F8FB' }}>
            <Bubble who={t.ai} side="left" text={t.greet} />
            {(thread?.messages || []).map((m, i) => (
              <Bubble
                key={i}
                who={m.from === 'user' ? t.you : m.from === 'ai' ? t.ai : t.founder}
                side={m.from === 'user' ? 'right' : 'left'}
                text={m.text}
                accent={m.from === 'founder'}
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
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-brand-green"
            />
            <button onClick={send} aria-label={t.send}
              className="px-4 rounded-xl text-white flex items-center" style={{ background: '#1A7A2E' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Bubble({ who, side, text, accent }) {
  const right = side === 'right'
  return (
    <div className={`flex flex-col ${right ? 'items-end' : 'items-start'}`}>
      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{who}</span>
      <div
        className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug"
        style={{
          background: right ? '#1A7A2E' : accent ? '#FFF7DB' : '#FFFFFF',
          color: right ? '#FFFFFF' : '#374151',
          border: right ? 'none' : '1px solid #E5E7EB',
        }}
      >
        {text}
      </div>
    </div>
  )
}
