import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import {
  ShieldCheck, Inbox, Users, CreditCard, BarChart3, MessagesSquare,
  Check, X, Send, AlertTriangle, Plus, Trash2, ListChecks, Instagram,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { SOCIAL, CONTACT } from '../lib/social'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { isFounder, founderInfo, FOUNDERS } from '../lib/founders'
import {
  moderationQueue, listAll, moderate, effectiveStatus, statusLabel,
} from '../lib/moderation'
import {
  inboxFor, founderReply, loadThreads, loadFounderChat, founderChatSend,
  toPTBR, forwardToUser,
} from '../lib/support'

const flagOf = (lng) => (lng === 'es' ? '🇪🇸' : '🇧🇷')
const BUILD = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'dev'

const ALLOW_KEY = 'be_invite_allow'
const loadAllow = () => { try { const a = JSON.parse(localStorage.getItem(ALLOW_KEY) || '[]'); return Array.isArray(a) ? a : [] } catch { return [] } }
const saveAllow = (l) => { try { localStorage.setItem(ALLOW_KEY, JSON.stringify(l)) } catch { /* ignore */ } }

const TABS = [
  { id: 'tasks',   icon: ListChecks,      pt: 'Tarefas',    es: 'Tareas' },
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
  const [tab, setTab] = useState(location.state?.tab || 'tasks')
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

        <p className="text-xs font-black uppercase tracking-wide mb-5" style={{ color: '#1A7A2E' }}>
          {L(TABS.find(x => x.id === tab)?.pt || '', TABS.find(x => x.id === tab)?.es || '')}
          <span className="text-gray-400 font-medium normal-case"> · {L('use o menu ☰ para navegar', 'usa el menú ☰ para navegar')}</span>
        </p>

        {tab === 'tasks'   && <Tarefas lang={lang} me={me} onGo={setTab} key={'t' + tick} />}
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
      <footer className="mt-auto" style={{ background: '#111827' }}>
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <a href={CONTACT.website} target="_blank" rel="noopener noreferrer"
             className="block text-sm font-bold text-white hover:underline mb-3">
            www.plataformaconexaobr.com
          </a>
          {SOCIAL.instagram && (
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold"
               style={{ background: 'linear-gradient(90deg, #F58529, #DD2A7B, #8134AF)' }}>
              <Instagram size={16} /> @app.brasilespana
            </a>
          )}
          <p className="text-[10px] text-gray-500 mt-3">build: {BUILD}</p>
        </div>
      </footer>
    </div>
  )
}

/* ---------- TELA INICIAL: TAREFAS DO FUNDADOR ---------- */
function Tarefas({ lang, me, onGo }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  const key = me?.key || 'geral'

  const threads = inboxFor(key)
  const pendingT = threads.filter(t => t.status === 'open')
  const doneT = threads.filter(t => t.status === 'answered').length

  const showMod = key === 'michele' || key === 'geral'
  const queue = showMod ? moderationQueue() : []
  const doneMod = showMod
    ? listAll().filter(a => a.status === 'approved' || a.status === 'rejected').length
    : 0

  const tasks = [
    {
      id: 'sup', go: 'inbox',
      title: L(`Atender suporte — ${me?.area}`, `Atender soporte — ${me?.area}`),
      desc:  L('Mensagens de usuários direcionadas a você (não respondidas)',
               'Mensajes de usuarios dirigidos a ti (sin responder)'),
      count: pendingT.length,
    },
    ...(showMod ? [{
      id: 'mod', go: 'mod',
      title: L('Moderar anúncios na fila', 'Moderar anuncios en cola'),
      desc:  L('Anúncios com alerta da pré-checagem aguardando decisão',
               'Anuncios con alerta esperando decisión'),
      count: queue.length,
    }] : []),
  ]

  const totalPending = tasks.reduce((n, t) => n + t.count, 0)
  const totalDone = doneT + doneMod

  return (
    <div className="space-y-4">
      <Card title={L(`Suas tarefas — ${me?.name}`, `Tus tareas — ${me?.name}`)}>
        <p className="text-xs text-gray-500 -mt-3 mb-4">{me?.area}</p>

        {totalPending === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-black text-gray-800">
              {L('Tudo em dia! Nenhuma tarefa pendente.', '¡Todo al día! Sin tareas pendientes.')}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map(tk => {
              const done = tk.count === 0
              return (
                <li key={tk.id}>
                  <button onClick={() => onGo(tk.go)}
                    className="w-full text-left flex items-center gap-3 rounded-2xl p-4 border transition-colors"
                    style={{ borderColor: done ? '#E5E7EB' : '#1A7A2E', background: done ? '#FFFFFF' : '#F0FAF1' }}>
                    <span className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 text-lg"
                          style={{ background: done ? '#9CA3AF' : '#1A7A2E' }}>
                      {tk.count}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-gray-800 text-sm">{tk.title}</span>
                      <span className="block text-xs text-gray-500">{tk.desc}</span>
                    </span>
                    {done
                      ? <span className="flex items-center gap-1 text-xs font-bold flex-shrink-0" style={{ color: '#1A7A2E' }}><Check size={14} /> {L('Concluído', 'Hecho')}</span>
                      : <span className="text-xs font-bold text-gray-500 flex-shrink-0">{L('Resolver →', 'Resolver →')}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Card title={L('Progresso', 'Progreso')}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 text-center" style={{ background: '#FFF7DB' }}>
            <div className="text-2xl font-black" style={{ color: '#7B5E00' }}>{totalPending}</div>
            <div className="text-[11px] text-gray-600">{L('Pendentes', 'Pendientes')}</div>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: '#E8F5E9' }}>
            <div className="text-2xl font-black" style={{ color: '#1A7A2E' }}>{totalDone}</div>
            <div className="text-[11px] text-gray-600">{L('Concluídas', 'Completadas')}</div>
          </div>
        </div>
      </Card>
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
  const forward = () => {
    if (!draft.trim() || !current) return
    forwardToUser({ threadId: current.id, text: draft.trim() })
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
                className="w-full text-left rounded-xl p-3 hover:bg-gray-50 border-2"
                style={{ borderColor: th.priority ? '#F5C800' : '#F3F4F6' }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-gray-800 truncate">{flagOf(th.lang)} {th.userName}</span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    {th.priority && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                            style={{ background: '#F5C800', color: '#3a2a00' }}>
                        ★ {lang === 'es' ? 'PRIORIDAD' : 'PRIORIDADE'}
                      </span>
                    )}
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#1A7A2E' }}>{th.category}</span>
                  </span>
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
          <p className="text-xs text-gray-500 mb-1">
            {flagOf(current.lang)} {current.userName} · {current.userEmail} · <b>{current.category}</b>
          </p>
          {current.lang === 'es' && (
            <p className="text-[10px] text-gray-400 mb-2">
              {L('Usuário escreve em espanhol — exibido traduzido para PT-BR (tradução básica no demo).',
                 'El usuario escribe en español — mostrado traducido a PT-BR.')}
            </p>
          )}
          <div className="space-y-2 max-h-64 overflow-y-auto mb-3 p-3 rounded-xl" style={{ background: '#F4F8FB' }}>
            {current.messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.from === 'founder' ? 'text-right' : ''}`}>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  {m.from === 'user' ? current.userName : m.from === 'ai' ? 'IA' : (me?.name || 'Fundador')}
                </span>
                <span className="inline-block px-3 py-1.5 rounded-2xl mt-0.5"
                  style={{ background: m.from === 'founder' ? '#1A7A2E' : '#FFFFFF', color: m.from === 'founder' ? '#FFF' : '#374151', border: '1px solid #E5E7EB' }}>
                  {m.from !== 'founder' && current.lang === 'es' ? toPTBR(m.text, current.lang) : m.text}
                </span>
                {m.from !== 'founder' && current.lang === 'es' && (
                  <span className="block text-[10px] text-gray-400 mt-0.5">orig (ES): {m.text}</span>
                )}
              </div>
            ))}
          </div>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            placeholder={L('Escreva em português...', 'Escribe en portugués...')}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 mb-2" />
          <div className="flex gap-2">
            <button onClick={reply}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold border"
              style={{ borderColor: '#1A7A2E', color: '#1A7A2E' }}>
              {L('Nota interna', 'Nota interna')}
            </button>
            <button onClick={forward}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5"
              style={{ background: '#1A7A2E' }}>
              <Send size={15} /> {L('Encaminhar ao usuário', 'Enviar al usuario')}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {L('"Encaminhar" chega ao usuário como a IA, sem sua identificação' + (current.lang === 'es' ? ', traduzido para espanhol.' : '.'),
               '"Enviar" llega al usuario como la IA, sin tu identificación.')}
          </p>
        </div>
      )}
    </Card>
  )
}

/* ---------- USUÁRIOS (3 sub-abas) ---------- */
function Usuarios({ lang }) {
  const L = (pt, es) => (lang === 'es' ? es : pt)
  const [sub, setSub] = useState('parceiros')
  const [q, setQ] = useState('')
  const [showSug, setShowSug] = useState(false)

  let demo = null
  try { demo = JSON.parse(localStorage.getItem('be_demo_user') || 'null') } catch { /* ignore */ }
  let allow = []
  try { allow = JSON.parse(localStorage.getItem('be_invite_allow') || '[]') } catch { /* ignore */ }
  allow = (Array.isArray(allow) ? allow : []).map(e => String(e).toLowerCase())
  const threads = loadThreads()

  const regNo = (email) => {
    let h = 0
    for (const c of String(email)) h = (h * 31 + c.charCodeAt(0)) >>> 0
    return 'BR-' + String(h % 1000000).padStart(6, '0')
  }
  const map = {}
  const add = (email, name) => {
    if (!email) return
    const k = String(email).toLowerCase()
    if (!map[k]) map[k] = { email: k, name: name || k.split('@')[0], date: '—' }
    else if (name) map[k].name = name
  }
  threads.forEach(t => add(t.userEmail, t.userName))
  if (demo?.email) add(demo.email, demo.user_metadata?.full_name)
  allow.forEach(e => add(e))

  const demoEmail = (demo?.email || '').toLowerCase()
  const demoAdv = (demo?.user_metadata?.account_type) === 'advertiser'
  const classify = (email) =>
    allow.includes(email) ? 'parceiro'
      : (email === demoEmail && demoAdv) ? 'pro'
      : 'free'

  const all = Object.values(map).map(u => ({ ...u, cat: classify(u.email), num: regNo(u.email) }))
  const parceiros = all.filter(u => u.cat === 'parceiro')
  const pro = all.filter(u => u.cat === 'pro')
  const free = all.filter(u => u.cat === 'free')

  const SUBS = [
    { id: 'parceiros', label: `${L('Parceiros', 'Socios')} (${parceiros.length})` },
    { id: 'pro',       label: `${L('Pagantes Pro', 'Pagos Pro')} (${pro.length})` },
    { id: 'free',      label: `Free (${free.length})` },
  ]
  const rows0 = sub === 'parceiros' ? parceiros : sub === 'pro' ? pro : free
  const ql = q.trim().toLowerCase()
  const rows = ql
    ? rows0.filter(u => `${u.name} ${u.email} ${u.num}`.toLowerCase().includes(ql))
    : rows0

  const rankOf = (u) => {
    const n = u.name.toLowerCase(), e = u.email.toLowerCase(), nu = u.num.toLowerCase()
    if (n.startsWith(ql)) return 0
    if (n.includes(ql)) return 1
    if (e.includes(ql)) return 2
    if (nu.includes(ql)) return 3
    return 9
  }
  const suggestions = ql
    ? rows0.filter(u => rankOf(u) < 9).sort((a, b) => rankOf(a) - rankOf(b)).slice(0, 6)
    : []

  return (
    <Card title={L('Usuários', 'Usuarios')}>
      <div className="flex gap-2 mb-4 flex-wrap">
        {SUBS.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)}
            className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: sub === s.id ? '#1A7A2E' : '#FFFFFF', color: sub === s.id ? '#FFF' : '#374151', border: '1px solid #E5E7EB' }}>
            {s.label}
          </button>
        ))}
      </div>

      {sub === 'parceiros' && (
        <div className="mb-4 p-3 rounded-xl text-xs leading-relaxed"
             style={{ background: '#FFF7DB', color: '#7B5E00', border: '1px solid #F5C800' }}>
          <b>{L('Parceiros', 'Socios')}:</b>{' '}
          {L('recebem o link de divulgação e ganham 2,99 € por usuário indicado — creditado SÓ após a confirmação do pagamento do usuário que entrou pelo link. O valor a receber é avisado por notificação no smartphone do parceiro.',
             'reciben el enlace y ganan 2,99 € por usuario referido — acreditado SOLO tras la confirmación del pago del usuario que entró por el enlace. El importe se avisa por notificación en el smartphone del socio.')}
        </div>
      )}

      <div className="relative mb-4">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setShowSug(true) }}
          onFocus={() => setShowSug(true)}
          onBlur={() => setTimeout(() => setShowSug(false), 150)}
          placeholder={L('Buscar por nome, e-mail ou nº...', 'Buscar por nombre, e-mail o nº...')}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
        />
        {showSug && suggestions.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
            {suggestions.map(u => (
              <li key={u.email}>
                <button
                  onMouseDown={() => { setQ(u.email); setShowSug(false) }}
                  className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-gray-800 truncate">{u.name}</span>
                    <span className="block text-[11px] text-gray-500 truncate">{u.email} · {u.num}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={u.cat === 'parceiro'
                      ? { background: '#F5C800', color: '#3a2a00' }
                      : u.cat === 'pro'
                        ? { background: '#FFFDE7', color: '#7B5E00' }
                        : { background: '#E8F5E9', color: '#1A7A2E' }}>
                    {u.cat === 'parceiro' ? L('Parceiro', 'Socio') : u.cat === 'pro' ? 'Pro' : 'Free'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {rows.length === 0 ? (
        <Empty text={ql
          ? L('Nenhum resultado para a busca.', 'Sin resultados para la búsqueda.')
          : L('Ninguém nesta categoria ainda.', 'Nadie en esta categoría aún.')} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase text-gray-400">
                <th className="py-2 pr-3">{L('Nome', 'Nombre')}</th>
                <th className="py-2 pr-3">{L('Inscrição', 'Registro')}</th>
                <th className="py-2 pr-3">Nº</th>
                <th className="py-2 pr-3">E-mail</th>
                <th className="py-2">{L('Plano/Categoria', 'Plan/Categoría')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(u => (
                <tr key={u.email} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-semibold text-gray-800">{u.name}</td>
                  <td className="py-2 pr-3 text-gray-500">{u.date}</td>
                  <td className="py-2 pr-3 text-gray-500">{u.num}</td>
                  <td className="py-2 pr-3 text-gray-600 break-all">{u.email}</td>
                  <td className="py-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={u.cat === 'parceiro'
                        ? { background: '#F5C800', color: '#3a2a00' }
                        : u.cat === 'pro'
                          ? { background: '#FFFDE7', color: '#7B5E00', border: '1px solid #F5C800' }
                          : { background: '#E8F5E9', color: '#1A7A2E' }}>
                      {u.cat === 'parceiro' ? L('Parceiro', 'Socio') : u.cat === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        {L('Demo: lista montada a partir de contas/suporte deste navegador. A base completa (com data e número de inscrição reais) aparece com o Supabase conectado.',
           'Demo: lista de cuentas/soporte de este navegador. La base completa aparece con Supabase conectado.')}
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
