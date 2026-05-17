import { useState } from 'react'
import {
  X, Copy, Check, Share2, MessageCircle, Phone, Mail, Instagram, Facebook, Globe,
} from 'lucide-react'
import { useLang } from '../lib/lang'
import { CONTACT } from '../lib/social'

const CONEXAO_URL = 'https://plataformaconexaobr.com'
// Azul único dos ícones — um pouco mais escuro que o azul do topo (#87CEEB)
const ICON_BLUE = '#4F9CC9'

const TEXT = {
  pt: {
    title: 'Cartão de visitas',
    copy: 'Copiar link', copied: 'Copiado!', share: 'Compartilhar', close: 'Fechar',
    knowApp: 'Conheça o app',
  },
  es: {
    title: 'Tarjeta de visita',
    copy: 'Copiar enlace', copied: '¡Copiado!', share: 'Compartir', close: 'Cerrar',
    knowApp: 'Conoce la app',
  },
}

function waHref(v)  { const d = String(v || '').replace(/\D/g, ''); return d ? `https://wa.me/${d}` : null }
function telHref(v) { const d = String(v || '').replace(/[^\d+]/g, ''); return d ? `tel:${d}` : null }
function mailHref(v){ return v && v.includes('@') ? `mailto:${v}` : null }
function igHref(v)  { if (!v) return null; return /^https?:\/\//i.test(v) ? v : `https://instagram.com/${String(v).replace(/^@/, '')}` }
function fbHref(v)  { if (!v) return null; return /^https?:\/\//i.test(v) ? v : `https://facebook.com/${String(v).replace(/^@/, '')}` }

export default function DigitalCardModal({ open, onClose, advertiser }) {
  const { lang } = useLang()
  const t = TEXT[lang]
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const username = advertiser.username || ''
  const name = advertiser.card_name || advertiser.display_name || advertiser.full_name || (username ? `@${username}` : 'BRASILESPAÑA')
  const subtitle = advertiser.headline || (username ? `@${username}` : 'BRASILESPAÑA')
  const link = `${window.location.origin}${advertiser.linkPath || `/anunciante/${username}`}`

  // Contatos em lista — cores reais das plataformas
  const contacts = [
    { key: 'wa',  Icon: MessageCircle, label: 'WhatsApp',  value: advertiser.whatsapp,  href: waHref(advertiser.whatsapp),  bg: ICON_BLUE },
    { key: 'tel', Icon: Phone,         label: lang === 'pt' ? 'Telefone' : 'Teléfono', value: advertiser.phone, href: telHref(advertiser.phone), bg: ICON_BLUE },
    { key: 'mail',Icon: Mail,          label: 'E-mail',    value: advertiser.email,     href: mailHref(advertiser.email),   bg: ICON_BLUE },
    { key: 'ig',  Icon: Instagram,     label: 'Instagram', value: advertiser.instagram, href: igHref(advertiser.instagram), bg: ICON_BLUE },
    { key: 'fb',  Icon: Facebook,      label: 'Facebook',  value: advertiser.facebook,  href: fbHref(advertiser.facebook),  bg: ICON_BLUE },
  ]

  const ContactRow = ({ Icon, label, value, href, bg }) => {
    const inner = (
      <>
        <span
          className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ background: bg, boxShadow: '0 6px 14px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.18)' }}
        >
          <Icon size={20} />
        </span>
        <span className="flex flex-col text-left min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{label}</span>
          <span className="text-sm font-semibold text-gray-700 truncate">
            {value || (href ? '' : '—')}
          </span>
        </span>
      </>
    )
    const base = 'flex items-center gap-3 w-full bg-white rounded-2xl px-3 py-2.5 shadow-sm border border-gray-100'
    return href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}
         className={`${base} active:scale-[0.98] transition-transform`}>
        {inner}
      </a>
    ) : (
      <div className={base} aria-label={label}>{inner}</div>
    )
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ }
  }
  const handleShare = async () => {
    const data = { title: name, text: `${name} · BRASILESPAÑA`, url: link }
    try { if (navigator.share) { await navigator.share(data); return } } catch { return }
    handleCopy()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-xs my-auto" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-white font-bold text-sm">{t.title}</span>
          <button onClick={onClose} aria-label={t.close} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* ===== CARTÃO (9:16 — tela de celular) ===== */}
        <div className="rounded-[28px] overflow-y-auto shadow-2xl bg-white"
             style={{ aspectRatio: '9 / 16' }}>

          {/* TOPO AZUL — logomarca + faixa verde/amarela atrás da foto */}
          <div className="relative w-full" style={{ height: '180px', background: '#87CEEB' }}>
            <img
              src="/images/logomarca.png"
              alt="BRASILESPAÑA"
              className="absolute top-4 left-1/2 -translate-x-1/2 h-20 object-contain"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
            />
            {/* Faixa verde/amarela (espessura média) atrás da foto */}
            <div
              className="absolute left-0 right-0"
              style={{
                bottom: '0',
                height: '54px',
                background: 'linear-gradient(90deg, #1A7A2E 0%, #1A7A2E 50%, #F5C800 50%, #F5C800 100%)',
              }}
            />
            {/* Foto de perfil sobreposta */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {advertiser.logoUrl
                    ? <img src={advertiser.logoUrl} alt={name} className="w-full h-full object-cover" />
                    : <span className="text-3xl font-black" style={{ color: '#1A7A2E' }}>{name.charAt(0).toUpperCase()}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* CONTEÚDO (fundo branco) */}
          <div className="pt-16 pb-7 px-6 text-center">
            <h2 className="text-2xl font-black text-gray-900">{name}</h2>
            <p className="text-xs font-bold tracking-widest uppercase mt-0.5 text-gray-400">{subtitle}</p>
            <div className="w-12 h-0.5 mx-auto mt-2 mb-6 rounded-full" style={{ background: '#1A7A2E' }} />

            {/* Contatos em lista */}
            <div className="flex flex-col gap-2.5 mb-6">
              {contacts.map(c => <ContactRow key={c.key} {...c} />)}
            </div>

            {/* Botão obrigatório: link da plataforma */}
            <a
              href={CONTACT.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: '#173A6B' }}
            >
              <Globe size={15} /> #brasilespaña · {t.knowApp}
            </a>
          </div>

          {/* Rodapé — tom escuro padrão da plataforma */}
          <a
            href={CONEXAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conexão BR"
            className="block text-center px-6 py-6"
            style={{ background: '#D7E3EE' }}
          >
            <img
              src="/images/conexaobr.png"
              alt="Conexão BR"
              className="h-16 mx-auto object-contain"
              style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.35))' }}
            />
            <span className="block text-xs mt-2 font-semibold text-gray-700">
              plataformaconexaobr.com
            </span>
          </a>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: '#1A7A2E' }}>
            <Share2 size={16} /> {t.share}
          </button>
          <button onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-white text-gray-700 hover:bg-gray-100">
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </div>
  )
}
