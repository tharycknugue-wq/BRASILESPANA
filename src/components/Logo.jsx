/* ===== NAO MODIFICAR - LOGO OFICIAL APROVADO ===== */
/*
  Cores oficiais:
  B=#1A7A2E  R=#F5C800  A=#F5C800  S=#1A7A2E  I=#F5C800
  L=#1A7A2E  E=#F5C800  S=#CC1714  P=#F5C800  A=#CC1714
  N=#F5C800  (til = SVG curva+aviao branco)  A=#F5C800
*/
/* ===== FIM NAO MODIFICAR ===== */

export default function Logo({ size = 'lg' }) {
  const fontSize   = size === 'header' ? '80px'   : size === 'lg' ? '2.8rem' : size === 'md' ? '1.5rem' : '1.1rem'
  const svgW       = size === 'header' ? 96       : size === 'lg' ? 34       : size === 'md' ? 19       : 14
  const svgH       = size === 'header' ? 44       : size === 'lg' ? 16       : size === 'md' ? 9        : 7
  const svgTop     = size === 'header' ? '-42px'  : size === 'lg' ? '-15px'  : size === 'md' ? '-8px'   : '-6px'
  const svgLeft    = size === 'header' ? '-6px'   : size === 'lg' ? '-2px'   : size === 'md' ? '-1px'   : '-1px'
  const strokeW    = size === 'header' ? 2.8      : size === 'lg' ? 2        : size === 'md' ? 1.5      : 1.2
  const planeFSize = size === 'header' ? '18px'   : size === 'lg' ? '7px'    : size === 'md' ? '4px'    : '3px'

  return (
    <span
      style={{
        fontWeight:    900,
        fontSize,
        letterSpacing: '-0.02em',
        lineHeight:    1,
        display:       'inline-flex',
        alignItems:    'baseline',
        whiteSpace:    'nowrap',
      }}
    >
      {/* ===== NAO MODIFICAR - CORES OFICIAIS ===== */}
      <span style={{ color: '#1A7A2E' }}>B</span>
      <span style={{ color: '#F5C800' }}>R</span>
      <span style={{ color: '#F5C800' }}>A</span>
      <span style={{ color: '#1A7A2E' }}>S</span>
      <span style={{ color: '#F5C800' }}>I</span>
      <span style={{ color: '#1A7A2E' }}>L</span>
      <span style={{ color: '#F5C800' }}>E</span>
      <span style={{ color: '#CC1714' }}>S</span>
      <span style={{ color: '#F5C800' }}>P</span>
      <span style={{ color: '#CC1714' }}>A</span>

      {/* N simples + SVG curva(til)+aviao acima */}
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span style={{ color: '#F5C800' }}>N</span>
        <svg
          viewBox="0 0 96 44"
          width={svgW}
          height={svgH}
          style={{
            position:   'absolute',
            top:        svgTop,
            left:       svgLeft,
            overflow:   'visible',
            pointerEvents: 'none',
          }}
        >
          {/* Curva continua: inicia como til (~) e vira rastro de aviao subindo */}
          <path
            d="M 2 36 C 14 18, 26 46, 40 30 C 56 14, 72 6, 88 4"
            stroke="white"
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Aviao no final do rastro */}
          <text
            x="84"
            y="8"
            fontSize={planeFSize}
            fill="white"
            transform="rotate(-35 84 8)"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.4))' }}
          >✈</text>
        </svg>
      </span>

      <span style={{ color: '#F5C800' }}>A</span>
      {/* ===== FIM NAO MODIFICAR ===== */}
    </span>
  )
}
