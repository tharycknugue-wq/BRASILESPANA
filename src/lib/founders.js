/* ──────────────────────────────────────────────────────────
   CONTAS DE FUNDADOR

   Regra: qualquer e-mail terminando em "@fundador.com" é
   FUNDADOR e cai no Console de Fundador (plataforma idêntica,
   com as funcionalidades internas).

   Cada fundador tem uma área de responsabilidade usada pela
   triagem do chat de suporte (ver src/lib/support.js):
     - tharyck@fundador.com  → Sistema & Bugs
     - michele@fundador.com  → Reclamações & Avaliações
     - thayza@fundador.com   → Pagamentos & Cobranças
   Outro @fundador.com → fundador "geral" (vê tudo).
────────────────────────────────────────────────────────── */
export const FOUNDER_DOMAIN = '@fundador.com'

export const FOUNDERS = {
  tharyck: { key: 'tharyck', name: 'Tharyck', area: 'Sistema & Bugs' },
  michele: { key: 'michele', name: 'Michele', area: 'Reclamações & Avaliações' },
  thayza:  { key: 'thayza',  name: 'Thayza',  area: 'Pagamentos & Cobranças' },
  geral:   { key: 'geral',   name: 'Geral',   area: 'Geral / Direção' },
}

function emailOf(user) {
  return (user?.email || '').trim().toLowerCase()
}

/** É fundador? (sufixo @fundador.com, ou role='founder' como override manual) */
export function isFounder(user, role) {
  if (!user) return false
  const email = emailOf(user)
  if (email.endsWith(FOUNDER_DOMAIN)) return true
  if (user.user_metadata?.role === 'founder') return true
  return role === 'founder'
}

/** Qual fundador é o usuário logado: 'tharyck' | 'michele' | 'thayza' | 'geral' */
export function founderKey(user) {
  if (!isFounder(user)) return null
  const email = emailOf(user)
  const local = email.endsWith(FOUNDER_DOMAIN)
    ? email.slice(0, -FOUNDER_DOMAIN.length)
    : ''
  if (local.includes('tharyck')) return 'tharyck'
  if (local.includes('michele')) return 'michele'
  if (local.includes('thayza'))  return 'thayza'
  return 'geral'
}

export function founderInfo(user) {
  const k = founderKey(user)
  return k ? FOUNDERS[k] : null
}
