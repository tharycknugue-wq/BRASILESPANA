import { useEffect, useRef, useState } from 'react'
import { Users, X, Send, Star } from 'lucide-react'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder, FOUNDERS } from '../lib/founders'
import { touchPresence, onlineKeys, loadPair, sendPair, isPartnerEmail, markRead, convPair } from '../lib/support'

const PEERS = Object.values(FOUNDERS).filter(f => f.key !== 'geral')
const ACCENT = '#F5C800'      // amarelo padrão do app
const ON_ACCENT = '#3a2a00'

export default function PartnerDock() {
  const { lang } = useLang()
  const { user } = useAuth()
  const email = user?.email || ''
  const partner = !!user && !isFounder(user) && isPartnerEmail(email)
  const name = user?.user_metadata?.full_name || email

  const [online, setOnline] = useState([])
  const [listOpen, setListOpen] = useState(false)
  const [windows, setWindows] = useState([])
  const [drafts, setDrafts] = useState({})
  const [, force] = useState(0)
  const endRefs = useRef({})

  useEffect(() => {
    if (!partner) return
    const beat = () => { touchPresence(email); setOnline(onlineKeys()) }
    beat()
    const id = setInterval(beat, 6000)
    return () => clearInterval(id)
  }, [partner, email])

  useEffect(() => {
    if (!windows.length) return
    const id = setInterval(() => force(x => x + 1), 2500)
    return () => clearInterval(id)
  }, [windows])

  useEffect(() => {
    windows.forEach(p => endRefs.current[p]?.scrollIntoView({ behavior: 'smooth' }))
  })

  // Marca como lido p/ o fundador ver "parceiro visualizou"
  // (o parceiro NÃO vê confirmação de leitura — sem indicador aqui)
  useEffect(() => {
    windows.forEach(k => markRead(convPair(email, k), email))
  })

  if (!partner) return null

  const L = (pt, es) => (lang === 'es' ? es : pt)
  const isOnline = (k) => online.includes(k)

  const openWin = (k) => {
    setListOpen(false)
    setWindows(w => (w.includes(k) ? w : [...w.slice(-2), k]))
  }
  const closeWin = (k) => setWindows(w => w.filter(x => x !== k))
  const send = (k) => {
    const text = (drafts[k] || '').trim()
    if (!text) return
    sendPair(email, k, email, name, text)
    setDrafts(d => ({ ...d, [k]: '' }))
    force(x => x + 1)
  }

  return (
    <>
      {!listOpen && (
        <button
          onClick={() => setListOpen(true)}
          className="fixed right-0 top-24 z-[93] flex items-center gap-1.5 px-2 py-3 rounded-l-xl text-xs font-black shadow-lg"
          style={{ background: ACCENT, color: ON_ACCENT, writingMode: 'vertical-rl' }}
          aria-label="Fundadores"
        >
          <Star size={14} style={{ transform: 'rotate(90deg)' }} fill={ON_ACCENT} />
          {L('FALAR COM FUNDADORES', 'HABLAR CON FUNDADORES')}
        </button>
      )}

      {listOpen && (
        <div className="fixed right-3 top-24 z-[94] w-64 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3" style={{ background: ACCENT, color: ON_ACCENT }}>
            <span className="font-black text-sm flex items-center gap-2"><Star size={15} fill={ON_ACCENT} /> {L('Fundadores', 'Fundadores')}</span>
            <button onClick={() => setListOpen(false)} aria-label="X" className="opacity-80 hover:opacity-100"><X size={18} /></button>
          </div>

          <div className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wide"
               style={{ background: '#FFF7DB', color: '#7B5E00' }}>
            {L('Parceiro · prioridade máxima', 'Socio · prioridad máxima')}
          </div>

          <ul className="py-1">
            {PEERS.map(f => {
              const on = isOnline(f.key)
              return (
                <li key={f.key}>
                  <button onClick={() => openWin(f.key)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50">
                    <span className="relative w-9 h-9 rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
                          style={{ background: '#1A7A2E' }}>
                      {f.name.charAt(0)}
                      <span className="absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 border-white"
                            style={{ background: on ? '#22C55E' : '#9CA3AF' }} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-gray-800 truncate">{f.name}</span>
                      <span className="block text-[11px] text-gray-500 truncate">
                        {on ? L('online', 'en línea') : L('offline', 'desconectado')} · {f.area}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100">
            {L('Demo: online vale neste navegador. Com servidor, presença real.',
               'Demo: en línea vale en este navegador. Con servidor, presencia real.')}
          </p>
        </div>
      )}

      {windows.map((k, i) => {
        const f = FOUNDERS[k]
        const msgs = loadPair(email, k)
        const on = isOnline(k)
        return (
          <div key={k}
            className="fixed z-[92] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ bottom: 0, right: 16 + i * 272, width: 256, height: 360 }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ background: ACCENT, color: ON_ACCENT }}>
              <span className="flex items-center gap-1.5 font-bold text-sm truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: on ? '#22C55E' : '#9CA3AF' }} />
                <Star size={12} fill={ON_ACCENT} /> {f?.name}
              </span>
              <button onClick={() => closeWin(k)} aria-label="X" className="opacity-80 hover:opacity-100"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: '#F4F8FB' }}>
              {msgs.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4">{L('Comece a conversa.', 'Empieza la conversación.')}</p>
              )}
              {msgs.map((m, idx) => {
                const mine = m.from === email
                return (
                  <div key={idx} className={mine ? 'text-right' : ''}>
                    <span className="inline-block px-2.5 py-1.5 rounded-2xl text-sm max-w-[85%]"
                      style={{ background: mine ? ACCENT : '#FFFFFF', color: mine ? ON_ACCENT : '#374151', border: '1px solid #E5E7EB' }}>
                      {m.text}
                    </span>
                  </div>
                )
              })}
              <div ref={el => { endRefs.current[k] = el }} />
            </div>
            <div className="p-2 border-t border-gray-100 flex gap-1.5">
              <input
                value={drafts[k] || ''}
                onChange={e => setDrafts(d => ({ ...d, [k]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(k) } }}
                placeholder={L('Mensagem...', 'Mensaje...')}
                className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
              />
              <button onClick={() => send(k)} className="px-2.5 rounded-lg" style={{ background: ACCENT, color: ON_ACCENT }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}
