/* ──────────────────────────────────────────────────────────
   SUPORTE — "IA" de triagem por reconhecimento de palavras.

   O usuário fala com o assistente; classificamos a mensagem
   por palavras-chave e direcionamos ao fundador responsável:
     tharyck → Sistema & Bugs
     michele → Reclamações & Avaliações
     thayza  → Pagamentos & Cobranças
     geral   → não classificado (vai para todos os fundadores)

   Demo: tudo em localStorage. Em produção isso vira tabela no
   Supabase + (opcional) um modelo de IA real no backend.
────────────────────────────────────────────────────────── */
const SUPPORT_KEY = 'be_support'        // threads usuário↔fundadores
const FCHAT_KEY    = 'be_founder_chat'  // chat exclusivo dos fundadores

const norm = (s) => (s || '')
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')

const RULES = [
  {
    key: 'thayza', category: 'Pagamentos & Cobranças',
    words: ['pagamento','pagar','paguei','cobranca','cobrado','cobraram','fatura','boleto',
            'cartao','paypal','assinatura','reembolso','estorno','valor','preco','plano',
            'mensalidade','indicacao','ganho','ganhei','2,99','12,99','recebimento','saque',
            'dinheiro','recibo','nota fiscal','cobrar'],
  },
  {
    key: 'michele', category: 'Reclamações & Avaliações',
    words: ['reclamacao','reclamar','reclamando','denuncia','denunciar','avaliacao','avaliar',
            'nota','estrela','golpe','fraude','enganaram','enganou','comportamento','abuso',
            'ofensa','ofensivo','recusado','reprovado','negado','moderacao','sugestao',
            'feedback','elogio','melhoria','pessimo','atendimento ruim','spam','assedio'],
  },
  {
    key: 'tharyck', category: 'Sistema & Bugs',
    words: ['bug','erro','falha','nao funciona','nao abre','travou','travando','lento','login',
            'senha','acesso','entrar','cadastro','app','site','tela','carregar','atualizar',
            'tecnico','verificacao','kyc','documento','documentos','foto de verificacao',
            'link quebrado','pagina','404','nao consigo','quebrado'],
  },
]

/** Classifica um texto → fundador responsável (mais palavras vence). */
export function classifySupport(text) {
  const t = norm(text)
  let best = null
  let bestHits = 0
  for (const r of RULES) {
    const hits = r.words.reduce((n, w) => n + (t.includes(norm(w)) ? 1 : 0), 0)
    if (hits > bestHits) { best = r; bestHits = hits }
  }
  if (best && bestHits > 0) return { key: best.key, category: best.category }
  return { key: 'geral', category: 'Geral / Não classificado' }
}

/* ---- Threads de suporte (usuário ↔ fundadores) ---- */
export function loadThreads() {
  try { const a = JSON.parse(localStorage.getItem(SUPPORT_KEY) || '[]'); return Array.isArray(a) ? a : [] }
  catch { return [] }
}
function saveThreads(list) {
  try { localStorage.setItem(SUPPORT_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

export function getUserThread(email) {
  return loadThreads().find(th => th.userEmail === email) || null
}

/** Usuário envia mensagem → classifica, roteia e persiste. Retorna a thread. */
export function userSend({ email, name, lang, text }) {
  const list = loadThreads()
  let th = list.find(t => t.userEmail === email)
  const { key, category } = classifySupport(text)
  const now = Date.now()
  if (!th) {
    th = { id: 'th_' + now, userEmail: email, userName: name || email, lang: lang || 'pt',
           assignedTo: key, category, status: 'open', createdAt: now, messages: [] }
    list.push(th)
  }
  th.assignedTo = key
  th.category = category
  th.status = 'open'
  th.messages.push({ from: 'user', text, ts: now })
  th.messages.push({
    from: 'ai',
    text: lang === 'es'
      ? `Recibido. Te dirigí a ${labelOf(key)} (${category}). Un fundador responderá aquí.`
      : `Recebido. Direcionei para ${labelOf(key)} (${category}). Um fundador responderá aqui.`,
    ts: now + 1,
  })
  saveThreads(list)
  return th
}

/** Fundador responde uma thread. */
export function founderReply({ threadId, founderKey, text }) {
  const list = loadThreads()
  const th = list.find(t => t.id === threadId)
  if (!th) return null
  th.messages.push({ from: 'founder', founderKey, text, ts: Date.now() })
  th.status = 'answered'
  saveThreads(list)
  return th
}

/** Caixa de entrada de um fundador: threads atribuídas a ele + 'geral'. */
export function inboxFor(founderKey) {
  const list = loadThreads()
  if (founderKey === 'geral') return list
  return list.filter(th => th.assignedTo === founderKey || th.assignedTo === 'geral')
}

function labelOf(key) {
  return ({ tharyck: 'Tharyck', michele: 'Michele', thayza: 'Thayza', geral: 'Direção' })[key] || 'Direção'
}

/* ---- Chat EXCLUSIVO dos fundadores ---- */
export function loadFounderChat() {
  try { const a = JSON.parse(localStorage.getItem(FCHAT_KEY) || '[]'); return Array.isArray(a) ? a : [] }
  catch { return [] }
}
export function founderChatSend({ founderKey, name, text }) {
  const list = loadFounderChat()
  list.push({ founderKey, name, text, ts: Date.now() })
  try { localStorage.setItem(FCHAT_KEY, JSON.stringify(list)) } catch { /* ignore */ }
  return list
}
