/* ──────────────────────────────────────────────────────────
   MODERAÇÃO DE ANÚNCIOS

   Pré-checagem automática (regras de conformidade UE/ES) +
   regra das 24h:
     - anúncio limpo  → auto-aprova 24h após publicado
     - anúncio com alerta → fica na FILA do fundador decidir
     - fundador pode aprovar/recusar a qualquer momento

   Demo: anúncios em localStorage (be_ads). Em produção isto
   vira a tabela `ads` no Supabase + (opcional) IA de
   conformidade no backend.
────────────────────────────────────────────────────────── */
const ADS_KEY = 'be_ads'
const DAY_MS  = 24 * 60 * 60 * 1000

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Itens/serviços vedados por lei (UE/Espanha) — lista base, ampliável.
const BANNED = [
  'droga','drogas','cocaina','maconha','haxixe','lsd','ecstasy','metanfetamina',
  'arma','armas','pistola','revolver','municao','municoes','explosivo',
  'documento falso','passaporte falso','carteira falsa','rg falso','diploma falso',
  'dinheiro falso','nota falsa',
  'prostituicao','servico sexual','acompanhante sexual','conteudo sexual',
  'orgao humano','venda de orgao','bebe para adocao','venda de bebe',
  'animal silvestre','especie protegida','marfim',
  'pirata','crackeado','falsificado','replica original',
]

const REQUIRED = ['title', 'description', 'contact', 'category', 'comunidade', 'municipio']

/** Retorna lista de alertas (vazia = limpo). */
export function precheck(ad) {
  const flags = []
  for (const f of REQUIRED) {
    if (!String(ad[f] || '').trim()) flags.push(`obrigatorio:${f}`)
  }
  const hay = norm(`${ad.title} ${ad.description}`)
  for (const term of BANNED) {
    if (hay.includes(norm(term))) flags.push(`proibido:${term}`)
  }
  if (String(ad.description || '').trim().length < 15) flags.push('descricao_curta')
  return flags
}

function load() {
  try { const a = JSON.parse(localStorage.getItem(ADS_KEY) || '[]'); return Array.isArray(a) ? a : [] }
  catch { return [] }
}
function save(list) {
  try { localStorage.setItem(ADS_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

/** Publica um anúncio (demo). Aplica pré-checagem e define status. */
export function addAd(input) {
  const list = load()
  const now = Date.now()
  const flags = precheck(input)
  const ad = {
    id: 'ad_' + now,
    ...input,
    flags,
    createdAt: now,
    status: 'pending',           // pending | approved | rejected
    moderatedBy: null,
    moderatedAt: null,
    reason: '',
  }
  list.unshift(ad)
  save(list)
  return ad
}

/** Status efetivo considerando a regra das 24h e os alertas. */
export function effectiveStatus(ad) {
  if (ad.status === 'approved') return 'approved'
  if (ad.status === 'rejected') return 'rejected'
  if ((ad.flags || []).length > 0) return 'review'           // fila do fundador
  return (Date.now() - ad.createdAt >= DAY_MS) ? 'approved' : 'pending'
}

export function statusLabel(code, lang) {
  const pt = { pending: 'Em análise (até 24h)', review: 'Em revisão pelo fundador', approved: 'Aprovado', rejected: 'Recusado' }
  const es = { pending: 'En análisis (hasta 24h)', review: 'En revisión por el fundador', approved: 'Aprobado', rejected: 'Rechazado' }
  return (lang === 'es' ? es : pt)[code] || code
}

export function listMine(email) {
  return load().filter(a => a.ownerEmail === email)
}
export function listAll() {
  return load()
}
/** Fila de moderação: anúncios com alerta aguardando decisão. */
export function moderationQueue() {
  return load().filter(a => a.status === 'pending' && (a.flags || []).length > 0)
}

export function moderate(id, decision, founderName, reason = '') {
  const list = load()
  const ad = list.find(a => a.id === id)
  if (!ad) return null
  ad.status = decision === 'approve' ? 'approved' : 'rejected'
  ad.moderatedBy = founderName
  ad.moderatedAt = Date.now()
  ad.reason = reason
  save(list)
  return ad
}
