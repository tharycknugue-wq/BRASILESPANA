import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import {
  ShieldCheck, Inbox, Users, CreditCard, BarChart3, MessagesSquare,
  Check, X, Send, AlertTriangle, Plus, Trash2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder, founderInfo, FOUNDERS } from '../lib/founders'
import {
  moderationQueue, listAll, moderate, effectiveStatus, statusLabel,
} from '../lib/moderation'
import { inboxFor, founderReply, loadThreads, loadFounderChat, founderChatSend } from '../lib/support'

const ALLOW_KEY = 'be_invite_allow'
const loadAllow = () => { try { const a = JSON.parse(localStorage.getItem(ALLOW_KEY) || '[]'); return Array.isArray(a) ? a : [] } catch { return [] } }
const saveAllow = (l) => { try { localStorage.setItem(ALLOW_KEY, JSON.stringify(l)) } catch { /* ignore */ } }

const TABS = [
  { id: 'mod',     icon: ShieldCheck,     pt: 'Moderação',  es: 'Moderación' },
  { id: 'inbox',   icon: Inbox,           pt: 'Caixa',      es: 'Bandeja' },
  { id: 'users',   icon: Users,           pt: 'Usuários',   es: 'Usuarios' },
  { id: 'fin',     icon: CreditCard,      pt: 'Financeiro', es: 'Finanzas' },
  { id: 'metrics', icon: BarChart3,       pt: 'Métricas',   es: 'Métricas' },
  { id: 'fchat',   icon: MessagesSquare,  pt: 'Chat fundadores', es: 'Chat fundadores' },
]

export default function FundadorConsolePage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState(location.state?.tab || 'mod')
  const [tick, setTick] = useState(0)            // força refresh dos stores
  const refresh = () => setTick(x => x + 1)

  useEffect(() => {
    if (location.state?.tab) setTab(location.state.tab)
  }, [location.state])

  if (authLoading) {
    return <Frame><div className="flex-1 flex items-center justify-center text-gray-500 text-sm">…</div></Frame>
  }
  if (!user) return <Navigate to="/entrar" replace />
  if (!isFounder(user)) return <Navigate to="/" replace />

  const me = founderInfo(user)
  const L = (pt, es) => (lang === 'es' ? es : pt)

  return (
    <Frame>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-5">
          <h1 className="text-3xl font-black text-gray-900">{L('Console de Fundador', 'Consola de Fundador')}</h1>
          <p className="text-gray-500 text-sm">
            {me?.name} · <span className="font-semibold">{me?.area}</span>
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map(tb => {
            const Icon = tb.icon
            const active = tab === tb.id
            return (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors"
                style={{ background: active ? '#1A7A2E' : '#FFFFFF', color: active ? '#FFFFFF' : '#374151', border: '1px solid #E5E7EB' }}>
                <Icon size={15} /> {L(tb.pt, tb.es)}
              </button>
            )
          })}
        </div>

        {tab === 'mod'     && <Moderacao lang={lang} me={me} onChange={refresh} key={'m' + tick} />}
        {tab === 'inbox'   && <CaixaEntrada lang={lang} me={me} key={'i' + tick} />}
        {tab === 'users'   && <Usuarios lang={lang} />}
        {tab === 'fin'     && <Financeiro lang={lang} />}
        {tab === 'metrics' && <Metricas lang={lang} />}
        {tab === 'fchat'   && <ChatFundadores lang={lang} me={me} />}
      </main>
    </Frame>
  )
}

function Frame({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader />
      {children}
      <Footer />
    </div>
  )
}

/* ---------- MODERAÇÃO ---------- */
function Moderacao({ lang, me, onChange }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  const [queue, setQueue] = useState(() => moderationQueue())
  const all = listAll()

  const act = (id, decision) => {
    moderate(id, decision, me?.name || 'Fundador')
    setQueue(moderationQueue())
    onChange?.()
  }

  return (
    <div className="space-y-4">
      <Card title={L('Fila de aprovação (alertas da pré-checagem)', 'Cola de aprobación (alertas del pre-chequeo)')}>
        {queue.length === 0 ? (
          <Empty text={L('Nada na fila. Anúncios limpos auto-aprovam em 24h.', 'Nada en cola. Los anuncios limpios se auto-aprueban en 24h.')} />
        ) : queue.map(ad => (
          <div key={ad.id} className="border border-gray-100 rounded-2xl p-4 mb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm">{ad.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ad.category} · {ad.municipio} · {ad.ownerEmail}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ad.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ad.flags.map(f => (
                    <span key={f} className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#FEF2F2', color: '#B91C1C' }}>
                      <AlertTriangle size={10} /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => act(ad.id, 'approve')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#1A7A2E' }}>
                  <Check size={13} /> {L('Aprovar', 'Aprobar')}
                </button>
                <button onClick={() => act(ad.id, 'reject')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600">
                  <X size={13} /> {L('Recusar', 'Rechazar')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Card title={L('Todos os anúncios', 'Todos los anuncios')}>
        {all.length === 0 ? <Empty text={L('Nenhum anúncio publicado ainda.', 'Ningún anuncio publicado aún.')} /> : (
          <ul className="space-y-2">
            {all.map(ad => {
              const st = effectiveStatus(ad)
              return (
                <li key={ad.id} className="flex items-center justify-between gap-3 text-sm border-b border-gray-100 pb-2">
                  <span className="truncate text-gray-700">{ad.title}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: st === 'approved' ? '#E8F5E9' : st === 'rejected' ? '#FEF2F2' : '#FFF7DB',
                      color: st === 'approved' ? '#1A7A2E' : st === 'rejected' ? '#B91C1C' : '#7B5E00',
                    }}>
                    {statusLabel(st, lang)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}

/* ---------- CAIXA DE ENTRADA (suporte triado) ---------- */
function CaixaEntrada({ lang, me }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  const [threads, setThreads] = useState(() => inboxFor(me?.key))
  const [openId, setOpenId] = useState(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const id = setInterval(() => setThreads(inboxFor(me?.key)), 3000)
    return () => clearInterval(id)
  }, [me])

  const current = threads.find(t => t.id === openId)
  const reply = () => {
    if (!draft.trim() || !current) return
    founderReply({ threadId: current.id, founderKey: me?.key, text: draft.trim() })
    setDraft('')
    setThreads(inboxFor(me?.key))
  }

  return (
    <Card title={L(`Mensagens direcionadas a ${me?.name} (${me?.area})`, `Mensajes dirigidos a ${me?.name}`)}>
      {threads.length === 0 ? (
        <Empty text={L('Sem mensagens. A IA direciona automaticamente por palavra-chave.', 'Sin mensajes. La IA dirige automáticamente por palabra clave.')} />
      ) : !current ? (
        <ul className="space-y-2">
          {threads.map(th => (
            <li key={th.id}>
              <button onClick={() => setOpenId(th.id)}
                className="w-full text-left border border-gray-100 rounded-xl p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-800 truncate">{th.userName}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#1A7A2E' }}>{th.category}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {th.messages[th.messages.length - 1]?.text}
                </p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button onClick={() => setOpenId(null)} className="text-xs font-bold mb-3" style={{ color: '#1A7A2E' }}>
            ← {L('Voltar à lista', 'Volver a la lista')}
          </button>
          <p className="text-xs text-gray-500 mb-2">{current.userName} · {current.userEmail} · <b>{current.category}</b></p>
          <div className="space-y-2 max-h-64 overflow-y-auto mb-3 p-3 rounded-xl" style={{ background: '#F4F8FB' }}>
            {current.messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.from === 'founder' ? 'text-right' : ''}`}>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  {m.from === 'user' ? current.userName : m.from === 'ai' ? 'IA' : (me?.name || 'Fundador')}
                </span>
                <span className="inline-block px-3 py-1.5 rounded-2xl mt-0.5"
                  style={{ background: m.from === 'founder' ? '#1A7A2E' : '#FFFFFF', color: m.from === 'founder' ? '#FFF' : '#374151', border: '1px solid #E5E7EB' }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); reply() } }}
              placeholder={L('Responder...', 'Responder...')}
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100" />
            <button onClick={reply} className="px-4 rounded-xl text-white" style={{ background: '#1A7A2E' }}><Send size={16} /></button>
          </div>
        </div>
      )}
    </Card>
  )
}

/* ---------- USUÁRIOS ---------- */
function Usuarios({ lang }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  let demo = null
  try { demo = JSON.parse(localStorage.getItem('be_demo_user') || 'null') } catch { /* ignore */ }
  const threads = loadThreads()
  return (
    <Card title={L('Usuários', 'Usuarios')}>
      {demo ? (
        <div className="text-sm border border-gray-100 rounded-xl p-3 mb-3">
          <p className="font-bold text-gray-800">{demo.user_metadata?.full_name || demo.email}</p>
          <p className="text-xs text-gray-500">{demo.email} · {demo.user_metadata?.account_type || 'free'}</p>
        </div>
      ) : <Empty text={L('Nenhuma conta neste navegador.', 'Ninguna cuenta en este navegador.')} />}
      <p className="text-xs text-gray-400 mt-2">
        {L('Demo: mostra a conta deste navegador + quem abriu suporte ('+threads.length+'). A lista completa de usuários exige o Supabase conectado.',
           'Demo: muestra la cuenta de este navegador + quien abrió soporte. La lista completa requiere Supabase conectado.')}
      </p>
    </Card>
  )
}

/* ---------- FINANCEIRO ---------- */
function Financeiro({ lang }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  return (
    <Card title={L('Financeiro & Assinaturas', 'Finanzas & Suscripciones')}>
      <div className="grid grid-cols-2 gap-3">
        {[
          [L('Assinantes ativos', 'Suscriptores activos'), '—'],
          [L('Receita mensal', 'Ingresos mensuales'), '—'],
          [L('A pagar (indicações)', 'A pagar (invitaciones)'), '—'],
          [L('Inadimplência', 'Morosidad'), '—'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl p-4 text-center" style={{ background: '#F4F8FB' }}>
            <div className="text-2xl font-black text-gray-800">{v}</div>
            <div className="text-[11px] text-gray-500">{k}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {L('Scaffold: números reais aparecem quando Supabase + gateway de pagamento (PayPal) estiverem conectados.',
           'Scaffold: los números reales aparecen con Supabase + pasarela de pago conectados.')}
      </p>
    </Card>
  )
}

/* ---------- MÉTRICAS + INDICAÇÃO ---------- */
function Metricas({ lang }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  const ads = listAll()
  const threads = loadThreads()
  const [allow, setAllow] = useState(loadAllow())
  const [em, setEm] = useState('')

  const add = () => {
    const e = em.trim().toLowerCase()
    if (!e || allow.includes(e)) { setEm(''); return }
    const next = [...allow, e]; setAllow(next); saveAllow(next); setEm('')
  }
  const del = (e) => { const next = allow.filter(x => x !== e); setAllow(next); saveAllow(next) }

  const stat = [
    [L('Anúncios', 'Anuncios'), ads.length],
    [L('Na fila', 'En cola'), ads.filter(a => effectiveStatus(a) === 'review').length],
    [L('Aprovados', 'Aprobados'), ads.filter(a => effectiveStatus(a) === 'approved').length],
    [L('Tickets suporte', 'Tickets soporte'), threads.length],
  ]

  return (
    <div className="space-y-4">
      <Card title={L('Métricas', 'Métricas')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stat.map(([k, v]) => (
            <div key={k} className="rounded-2xl p-4 text-center" style={{ background: '#F4F8FB' }}>
              <div className="text-2xl font-black" style={{ color: '#1A7A2E' }}>{v}</div>
              <div className="text-[11px] text-gray-500">{k}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={L('Quem pode convidar com link', 'Quién puede invitar con enlace')}>
        <div className="flex gap-2">
          <input value={em} onChange={e => setEm(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
            placeholder="email@exemplo.com"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100" />
          <button onClick={add} className="px-4 rounded-xl text-white flex items-center gap-1.5" style={{ background: '#1A7A2E' }}>
            <Plus size={15} />
          </button>
        </div>
        {allow.length ? (
          <ul className="mt-3 space-y-2">
            {allow.map(e => (
              <li key={e} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-gray-50 text-sm">
                <span className="break-all text-gray-700">{e}</span>
                <button onClick={() => del(e)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        ) : <Empty text={L('Nenhum e-mail liberado.', 'Ningún e-mail habilitado.')} />}
      </Card>
    </div>
  )
}

/* ---------- CHAT EXCLUSIVO DOS FUNDADORES ---------- */
function ChatFundadores({ lang, me }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  const [msgs, setMsgs] = useState(loadFounderChat())
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setMsgs(loadFounderChat()), 3000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = () => {
    if (!draft.trim()) return
    setMsgs(founderChatSend({ founderKey: me?.key, name: me?.name || 'Fundador', text: draft.trim() }))
    setDraft('')
  }

  return (
    <Card title={L('Chat exclusivo dos fundadores', 'Chat exclusivo de los fundadores')}>
      <p className="text-xs text-gray-400 mb-3">
        {L('Visível só para contas @fundador.com.', 'Visible solo para cuentas @fundador.com.')}
        {' '}{Object.values(FOUNDERS).filter(f => f.key !== 'geral').map(f => f.name).join(' · ')}
      </p>
      <div className="space-y-2 max-h-72 overflow-y-auto p-3 rounded-xl mb-3" style={{ background: '#F4F8FB' }}>
        {msgs.length === 0 && <Empty text={L('Sem mensagens ainda.', 'Sin mensajes aún.')} />}
        {msgs.map((m, i) => {
          const mine = m.founderKey === me?.key
          return (
            <div key={i} className={mine ? 'text-right' : ''}>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">{m.name}</span>
              <span className="inline-block px-3 py-1.5 rounded-2xl mt-0.5 text-sm"
                style={{ background: mine ? '#1A7A2E' : '#FFFFFF', color: mine ? '#FFF' : '#374151', border: '1px solid #E5E7EB' }}>
                {m.text}
              </span>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
          placeholder={L('Mensagem para os fundadores...', 'Mensaje para los fundadores...')}
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100" />
        <button onClick={send} className="px-4 rounded-xl text-white" style={{ background: '#1A7A2E' }}><Send size={16} /></button>
      </div>
    </Card>
  )
}

/* ---------- UI helpers ---------- */
function Card({ title, children }) {
  return (
    <section className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="font-black text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}
function Empty({ text }) {
  return <p className="text-sm text-gray-400 py-6 text-center">{text}</p>
}
