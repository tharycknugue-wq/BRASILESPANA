import { Heart } from 'lucide-react'
import { useLang } from '../lib/lang'

export default function Footer() {
  const { lang } = useLang()
  const t = {
    pt: {
      rights: 'Todos os direitos reservados',
      made: 'Feito com',
      for: 'para brasileiros na Espanha',
      disclaimer: 'O BRASILESPAÑA não garante a qualidade dos serviços prestados por terceiros. Qualquer informação que não corresponda à verdade é de total responsabilidade do usuário cadastrado, que responderá pelas ações jurídicas, penais e civis cabíveis.',
    },
    es: {
      rights: 'Todos los derechos reservados',
      made: 'Hecho con',
      for: 'para brasileños en España',
      disclaimer: 'BRASILESPAÑA no garantiza la calidad de los servicios prestados por terceros. Cualquier información que no corresponda a la verdad es de total responsabilidad del usuario registrado, que responderá por las acciones jurídicas, penales y civiles correspondientes.',
    },
  }[lang]

  return (
    <footer className="mt-12" style={{ background: '#111827' }}>
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">

        {/* Logomarca centralizada */}
        <img
          src="/images/logomarca.png"
          alt="BRASILESPANA"
          className="mx-auto mb-6"
          style={{ height: '40px', objectFit: 'contain', filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.4))' }}
        />

        {/* Aviso legal */}
        <p className="text-[11px] leading-relaxed text-gray-400 mb-5">
          {t.disclaimer}
        </p>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} BRASILESPANA — {t.rights}</span>
          <span className="flex items-center gap-1">
            {t.made} <Heart size={11} className="text-red-500 fill-red-500" /> {t.for}
          </span>
        </div>
      </div>
    </footer>
  )
}
