import { Link } from 'react-router-dom'
import { Heart, Instagram, Facebook, MessageCircle, Music2, Youtube, Send } from 'lucide-react'
import { SOCIAL } from '../lib/social'
import { useLang } from '../lib/lang'

const SOCIAL_LINKS = [
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'facebook',  label: 'Facebook',  Icon: Facebook },
  { key: 'tiktok',    label: 'TikTok',    Icon: Music2 },
  { key: 'youtube',   label: 'YouTube',   Icon: Youtube },
  { key: 'whatsapp',  label: 'WhatsApp',  Icon: MessageCircle },
  { key: 'telegram',  label: 'Telegram',  Icon: Send },
]

const CATEGORIES = [
  { id: 'servicos',     pt: 'Serviços',     es: 'Servicios' },
  { id: 'produtos',     pt: 'Produtos',     es: 'Productos' },
  { id: 'desapego',     pt: 'Desapego',     es: 'Desapego' },
  { id: 'doacao',       pt: 'Doação',       es: 'Donación' },
  { id: 'adocao-pets',  pt: 'Adoção',       es: 'Adopción' },
  { id: 'vagas',        pt: 'Vagas',        es: 'Empleo' },
  { id: 'voluntariado', pt: 'Voluntariado', es: 'Voluntariado' },
  { id: 'promocoes',    pt: 'Promoções',    es: 'Promociones' },
]

const FOOTER_LINKS = [
  { to: '/sobre',         pt: 'Sobre nós',     es: 'Sobre nosotros' },
  { to: '/como-funciona', pt: 'Como funciona', es: 'Cómo funciona' },
  { to: '/contato',       pt: 'Contato',       es: 'Contacto' },
  { to: '/privacidade',   pt: 'Privacidade',   es: 'Privacidad' },
  { to: '/termos',        pt: 'Termos de uso', es: 'Términos de uso' },
]

export default function Footer() {
  const { lang } = useLang()
  const t = {
    pt: {
      tagline: 'Conectando brasileiros na Espanha',
      categories: 'Categorias',
      links: 'Links',
      rights: 'Todos os direitos reservados',
      made: 'Feito com',
      for: 'para brasileiros na Espanha',
      disclaimer: 'O BRASILESPAÑA não garante a qualidade dos serviços prestados por terceiros. Qualquer informação que não corresponda à verdade é de total responsabilidade do usuário cadastrado, que responderá pelas ações jurídicas, penais e civis cabíveis.',
    },
    es: {
      tagline: 'Conectando brasileños en España',
      categories: 'Categorías',
      links: 'Enlaces',
      rights: 'Todos los derechos reservados',
      made: 'Hecho con',
      for: 'para brasileños en España',
      disclaimer: 'BRASILESPAÑA no garantiza la calidad de los servicios prestados por terceros. Cualquier información que no corresponda a la verdad es de total responsabilidad del usuario registrado, que responderá por las acciones jurídicas, penales y civiles correspondientes.',
    },
  }[lang]

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-2">
              <img src="/images/logomarca.png" alt="BRASILESPANA" style={{ height: '36px', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.4))' }} />
            </div>
            <p className="text-sm text-gray-500 mb-4">{t.tagline}</p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.filter(s => SOCIAL[s.key]).map(({ key, label, Icon }) => (
                <a key={key} href={SOCIAL[key]} target="_blank" rel="noopener noreferrer"
                   aria-label={label}
                   className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-green transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">{t.categories}</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/anuncios/${cat.id}`} className="text-sm hover:text-brand-yellow transition-colors">
                    {cat[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">{t.links}</h4>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brand-yellow transition-colors">
                    {link[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Aviso legal */}
        <p className="border-t border-gray-800 pt-6 text-[11px] leading-relaxed text-gray-600 mb-4">
          {t.disclaimer}
        </p>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} BRASILESPANA — {t.rights}</span>
          <span className="flex items-center gap-1">
            {t.made} <Heart size={11} className="text-red-500 fill-red-500" /> {t.for}
          </span>
        </div>
      </div>
    </footer>
  )
}
