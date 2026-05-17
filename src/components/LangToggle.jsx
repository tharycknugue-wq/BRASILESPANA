import { useLang } from '../lib/lang'

/* Seletor de idioma padrão da plataforma — segmented control com thumb
   deslizante. Fonte única: usado no PageHeader e na Home. */
const FLAGS = [
  { id: 'pt', code: 'BR',
    grad: 'linear-gradient(135deg,#1F8F37 0%,#13631F 100%)', glow: 'rgba(26,122,46,0.45)' }, // Brasil
  { id: 'es', code: 'ES',
    grad: 'linear-gradient(135deg,#E0201C 0%,#A11210 100%)', glow: 'rgba(204,23,20,0.45)' }, // Espanha
]

export default function LangToggle() {
  const { lang, setLang } = useLang()
  const langIndex  = Math.max(0, FLAGS.findIndex(f => f.id === lang))
  const activeFlag = FLAGS[langIndex]

  return (
    <div
      role="tablist"
      aria-label="Idioma"
      className="relative inline-flex p-1 rounded-full select-none"
      style={{
        background:     'rgba(17,24,39,0.06)',
        boxShadow:      'inset 0 0 0 1px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Thumb deslizante */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-full"
        style={{
          width:      'calc(50% - 4px)',
          transform:  `translateX(${langIndex * 100}%)`,
          background: activeFlag.grad,
          boxShadow:  `0 4px 14px ${activeFlag.glow}, 0 1px 2px rgba(0,0,0,0.2)`,
          transition: 'transform 360ms cubic-bezier(0.34,1.56,0.64,1), background 280ms ease, box-shadow 280ms ease',
        }}
      />
      {FLAGS.map(flag => {
        const active = lang === flag.id
        return (
          <button
            key={flag.id}
            onClick={() => setLang(flag.id)}
            role="tab"
            aria-selected={active}
            className="relative z-10 flex-1 flex items-center justify-center px-6 py-2
                       rounded-full text-sm font-extrabold tracking-widest cursor-pointer
                       transition-[color,transform] duration-200 active:scale-95"
            style={{ color: active ? '#FFFFFF' : '#64748b', minWidth: 72 }}
          >
            {flag.code}
          </button>
        )
      })}
    </div>
  )
}
