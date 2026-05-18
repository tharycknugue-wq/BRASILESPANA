import { useEffect, useRef, useState } from 'react'
import { Users, X, Send, Star } from 'lucide-react'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder, founderInfo, FOUNDERS } from '../lib/founders'
import {
  touchPresence, onlineKeys, loadPair, sendPair, pairPartnersFor,
  loadFounderChat, founderChatSend,
} from '../lib/support'

const PEERS = Object.values(FOUNDERS).filter(f => f.key !== 'geral')
const GROUP = '__group__'

export default function FounderDock() {
  const { lang } = useLang()
  const { user } = useAuth()
  const founder = isFounder(user)
  const me = founder ? founderInfo(user) : null
  const myKey = me?.key

  const [online, setOnline] = useState([])
  const [partners, setPartners] = useState([])
  const [listOpen, setListOpen] = useState(false)
  const [windows, setWindows] = useState([])
  const [drafts, setDrafts] = useState({})
  const [, force] = useState(0)
  const endRefs = useRef({})

  useEffect(() => {
    if (!founder) return
    const beat = () => {
      touchPresence(myKey)
      setOnline(onlineKeys())
      setPartners(pairPartnersFor(myKey))
    }
    beat()
    const id = setInterval(beat, 6000)
    return () => clearInterval(id)
  }, [founder, myKey])

  useEffect(() => {
    if (!windows.length) return
    const id = setInterval(() => force(x => x + 1), 2500)
    return () => clearInterval(id)
  }, [windows])

  useEffect(() => {
    windows.forEach(p => endRefs.current[p]?.scrollIntoView({ behavior: 'smooth' }))
  })

  if (!founder) return null

  const L = (pt, es) => (lang === 'es' ? es : pt)
  const isOnline = (k) => k === myKey || online.includes(k)
  const isPartner = (k) => String(k).includes('@')
  const nameOf = (k) => k === GROUP
    ? L('Grupo dos Fundadores', 'Grupo de Fundadores')
    : (FOUNDERS[k]?.name || k)

  const openWin = (k) => {
    setListOpen(false)
    setWindows(w => (w.includes(k) ? w : [...w.slice(-2), k]))
  }
  const closeWin = (k) => setWindows(w => w.filter(x => x !== k))
  const send = (k) => {
    const text = (drafts[k] || '').trim()
    if (!text) return
    if (k === GROUP) founderChatSend({ founderKey: myKey, name: me?.name || 'Fundador', text })
    else sendPair(myKey, k, myKey, me?.name || 'Fundador', text)
    setDrafts(d => ({ ...d, [k]: '' }))
    force(x => x + 1)
  }

  const Row = ({ k, name, sub, accent }) => {
    const on = isOnline(k)
    return (
      <button onClick={() => openWin(k)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50">
        <span className="relative w-9 h-9 rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
              style={{ background: accent }}>
          {String(name).charAt(0).toUpperCase()}
          <span className="absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 border-white"
                style={{ background: on ? '#22C55E' : '#9CA3AF' }} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-gray-800 truncate">{name}</span>
          <span className="block text-[11px] text-gray-500 truncate">
            {on ? L('online', 'en línea') : L('offline', 'desconectado')} · {sub}
          </span>
        </span>
      </button>
    )
  }

  return (
    <>
      {!listOpen && (
        <button
          onClick={() => setListOpen(true)}
          className="fixed right-0 top-24 z-[93] flex items-center gap-1.5 px-2 py-3 rounded-l-xl text-white text-xs font-black shadow-lg"
          style={{ background: '#1A7A2E', writingMode: 'vertical-rl' }}
          aria-label="Fundadores"
        >
          <Users size={15} style={{ transform: 'rotate(90deg)' }} />
          {L('FUNDADORES', 'FUNDADORES')}
        </button>
      )}

      {listOpen && (
        <div className="fixed right-3 top-24 z-[94] w-64 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: '#1A7A2E' }}>
            <span className="font-black text-sm flex items-center gap-2"><Users size={16} /> {L('Fundadores', 'Fundadores')}</span>
            <button onClick={() => setListOpen(false)} aria-label="X" className="text-white/90 hover:text-white"><X size={18} /></button>
          </div>

          <ul className="py-1">
            {/* Grupo geral dos fundadores (conversas gerais) */}
            <li>
              <button onClick={() => openWin(GROUP)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50">
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: '#1A7A2E' }}>
                  <Users size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-gray-800 truncate">
                    {L('Grupo dos Fundadores', 'Grupo de Fundadores')}
                  </span>
                  <span className="block text-[11px] text-gray-500 truncate">
                    {L('Conversas gerais · todos os fundadores', 'Conversaciones generales · todos los fundadores')}
                  </span>
                </span>
              </button>
            </li>
            {/* Conversas privadas 1:1 com cada fundador */}
            {PEERS.filter(f => f.key !== myKey).map(f => (
              <li key={f.key}><Row k={f.key} name={f.name} sub={f.area} accent="#1A7A2E" /></li>
            ))}
          </ul>

          {/* Parceiros — prioridade máxima (amarelo) */}
          <div className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wide flex items-center gap-1"
               style={{ background: '#FFF7DB', color: '#7B5E00' }}>
            <Star size={11} fill="#F5C800" /> {L('Parceiros · prioridade', 'Socios · prioridad')}
          </div>
          {partners.length === 0 ? (
            <p className="px-4 py-3 text-[11px] text-gray-400">
              {L('Nenhum parceiro conversando.', 'Ningún socio conversando.')}
            </p>
          ) : (
            <ul className="py-1">
              {partners.map(em => (
                <li key={em}><Row k={em} name={em} sub={L('Parceiro', 'Socio')} accent="#F5C800" /></li>
              ))}
            </ul>
          )}

          <p className="px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100">
            {L('Demo: online vale neste navegador. Com servidor, presença real.',
               'Demo: en línea vale en este navegador. Con servidor, presencia real.')}
          </p>
        </div>
      )}

      {windows.map((k, i) => {
        const group = k === GROUP
        const partner = !group && isPartner(k)
        const headBg = partner ? '#F5C800' : '#1A7A2E'
        const headFg = partner ? '#3a2a00' : '#FFFFFF'
        const msgs = group ? loadFounderChat() : loadPair(myKey, k)
        const on = group ? true : isOnline(k)
        return (
          <div key={k}
            className="fixed z-[92] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ bottom: 0, right: 16 + i * 272, width: 256, height: 360 }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ background: headBg, color: headFg }}>
              <span className="flex items-center gap-1.5 font-bold text-sm truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: on ? '#22C55E' : '#9CA3AF' }} />
                {group ? <Users size={12} /> : partner ? <Star size={12} /> : null} {nameOf(k)}
              </span>
              <button onClick={() => closeWin(k)} aria-label="X" className="opacity-80 hover:opacity-100"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: '#F4F8FB' }}>
              {msgs.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4">{L('Comece a conversa.', 'Empieza la conversación.')}</p>
              )}
              {msgs.map((m, idx) => {
                const mine = group ? m.founderKey === myKey : m.from === myKey
                return (
                  <div key={idx} className={mine ? 'text-right' : ''}>
                    {group && !mine && (
                      <span className="block text-[10px] font-bold text-gray-400">{m.name}</span>
                    )}
                    <span className="inline-block px-2.5 py-1.5 rounded-2xl text-sm max-w-[85%]"
                      style={{ background: mine ? '#1A7A2E' : '#FFFFFF', color: mine ? '#FFF' : '#374151', border: '1px solid #E5E7EB' }}>
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
                className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <button onClick={() => send(k)} className="px-2.5 rounded-lg" style={{ background: headBg, color: headFg }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}
