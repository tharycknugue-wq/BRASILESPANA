import DOMPurify from 'dompurify'

/* ═══════════════════════════════════════════════════════════
   SANITIZAÇÃO DE INPUT — previne XSS
   Nunca inserir dados do usuário no DOM sem sanitizar primeiro
═══════════════════════════════════════════════════════════ */
export function sanitize(value) {
  if (typeof value !== 'string') return ''
  return DOMPurify.sanitize(value.trim(), {
    ALLOWED_TAGS:  [],   // strip all HTML tags
    ALLOWED_ATTR:  [],
  })
}

/* ═══════════════════════════════════════════════════════════
   VALIDAÇÃO DE EMAIL
═══════════════════════════════════════════════════════════ */
export function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
  return re.test(String(email).toLowerCase())
}

/* ═══════════════════════════════════════════════════════════
   VALIDAÇÃO DE SENHA FORTE
   - Mínimo 8 caracteres
   - Pelo menos 1 letra maiúscula
   - Pelo menos 1 número
   - Pelo menos 1 símbolo especial
═══════════════════════════════════════════════════════════ */
export function validatePassword(password) {
  const rules = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number:    /[0-9]/.test(password),
    symbol:    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }
  const valid = Object.values(rules).every(Boolean)
  return { valid, rules }
}

/* ═══════════════════════════════════════════════════════════
   MASCARAMENTO DE DADOS SENSÍVEIS
   Dados como CPF, documentos NUNCA devem aparecer em plain text
═══════════════════════════════════════════════════════════ */
export function maskCPF(cpf) {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return '***.***.***-**'
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`
}

export function maskDocument(doc) {
  if (!doc || doc.length < 4) return '****'
  return '*'.repeat(doc.length - 4) + doc.slice(-4)
}

export function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '****'
  return digits.slice(0, 3) + ' ****-' + digits.slice(-4)
}

export function maskEmail(email) {
  const [user, domain] = email.split('@')
  if (!domain || user.length < 2) return '***@***'
  return user[0] + '*'.repeat(Math.min(user.length - 1, 5)) + '@' + domain
}

/* ═══════════════════════════════════════════════════════════
   RATE LIMITING — max 5 tentativas de login em 15 minutos
   Armazenado em localStorage (client-side gate)
═══════════════════════════════════════════════════════════ */
const RATE_KEY       = 'be_login_attempts'
const MAX_ATTEMPTS   = 5
const WINDOW_MS      = 15 * 60 * 1000  // 15 minutos

export const rateLimiter = {
  getAttempts() {
    try {
      const raw = localStorage.getItem(RATE_KEY)
      if (!raw) return []
      const attempts = JSON.parse(raw)
      const now = Date.now()
      // Descartar tentativas fora da janela de tempo
      return attempts.filter(ts => now - ts < WINDOW_MS)
    } catch {
      return []
    }
  },

  isBlocked() {
    const attempts = this.getAttempts()
    return attempts.length >= MAX_ATTEMPTS
  },

  getRemainingTime() {
    const attempts = this.getAttempts()
    if (attempts.length < MAX_ATTEMPTS) return 0
    const oldest = Math.min(...attempts)
    const unlockAt = oldest + WINDOW_MS
    return Math.max(0, Math.ceil((unlockAt - Date.now()) / 1000 / 60)) // minutos
  },

  getRemainingAttempts() {
    return Math.max(0, MAX_ATTEMPTS - this.getAttempts().length)
  },

  record() {
    const attempts = this.getAttempts()
    attempts.push(Date.now())
    try {
      localStorage.setItem(RATE_KEY, JSON.stringify(attempts))
    } catch {
      // localStorage indisponível — silent fail
    }
  },

  reset() {
    try {
      localStorage.removeItem(RATE_KEY)
    } catch {
      // silent fail
    }
  },
}

/* ═══════════════════════════════════════════════════════════
   TOKEN CSRF — gerado por sessão
═══════════════════════════════════════════════════════════ */
export function getCSRFToken() {
  const key = 'be_csrf_token'
  let token = sessionStorage.getItem(key)
  if (!token) {
    // Gerar token criptograficamente seguro
    const arr = new Uint8Array(32)
    crypto.getRandomValues(arr)
    token = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
    sessionStorage.setItem(key, token)
  }
  return token
}

/* ═══════════════════════════════════════════════════════════
   LOG SEGURO — dados sensíveis NUNCA aparecem no console
═══════════════════════════════════════════════════════════ */
const SENSITIVE_KEYS = ['password', 'senha', 'cpf', 'rg', 'document', 'token', 'secret', 'key']

export function safeLog(label, data) {
  if (import.meta.env.PROD) return   // zero logs em produção

  if (typeof data !== 'object' || data === null) {
    console.log(`[BE] ${label}:`, data)
    return
  }

  const sanitized = Object.fromEntries(
    Object.entries(data).map(([k, v]) => {
      const isSensitive = SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s))
      return [k, isSensitive ? '[REDACTED]' : v]
    })
  )
  console.log(`[BE] ${label}:`, sanitized)
}

/* ═══════════════════════════════════════════════════════════
   MENSAGENS DE ERRO GENÉRICAS — não revelam info do sistema
═══════════════════════════════════════════════════════════ */
export const AUTH_ERRORS = {
  pt: {
    invalidCredentials: 'E-mail ou senha incorretos.',
    accountLocked:      (min) => `Conta temporariamente bloqueada. Tente novamente em ${min} minuto${min > 1 ? 's' : ''}.`,
    generic:            'Ocorreu um erro. Tente novamente mais tarde.',
    emailInUse:         'Não foi possível criar a conta. Verifique os dados e tente novamente.',
    weakPassword:       'A senha não atende aos requisitos de segurança.',
    networkError:       'Erro de conexão. Verifique sua internet.',
    tooManyRequests:    'Muitas tentativas. Aguarde alguns minutos.',
  },
  es: {
    invalidCredentials: 'E-mail o contraseña incorrectos.',
    accountLocked:      (min) => `Cuenta bloqueada temporalmente. Intenta de nuevo en ${min} minuto${min > 1 ? 's' : ''}.`,
    generic:            'Ocurrió un error. Inténtalo de nuevo más tarde.',
    emailInUse:         'No se pudo crear la cuenta. Verifica los datos e inténtalo de nuevo.',
    weakPassword:       'La contraseña no cumple los requisitos de seguridad.',
    networkError:       'Error de conexión. Verifica tu internet.',
    tooManyRequests:    'Demasiados intentos. Espera unos minutos.',
  },
}

/* ═══════════════════════════════════════════════════════════
   FORÇA HTTPS em produção
   Chamar no ponto de entrada da aplicação
═══════════════════════════════════════════════════════════ */
export function enforceHttps() {
  if (
    import.meta.env.PROD &&
    window.location.protocol === 'http:' &&
    !window.location.hostname.includes('localhost')
  ) {
    window.location.replace(window.location.href.replace('http:', 'https:'))
  }
}
