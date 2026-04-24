import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  withTagline?: boolean
  className?: string
}

// Échelle d'affichage selon la taille (viewport SVG de référence : 500×185)
// md est calibré pour un header ~70px (logo ~42px de haut)
const SCALE: Record<string, number> = { sm: 0.18, md: 0.23, lg: 0.32 }

// Positions calculées pour l'animation du dot :
// Pill : x=103, w=270, rx=87 → dot ON (droite) cx=286, dot OFF (gauche) cx=190
// Slide distance : 286-190 = 96px → translateX(-96px)

export function Logo({
  variant = 'light',
  size = 'md',
  withTagline = false,
  className,
}: LogoProps) {
  const scale = SCALE[size]
  const vbH = withTagline ? 225 : 185
  const toggleBg = variant === 'dark' ? '#0D1B2A' : '#FFFFFF'

  return (
    <Link
      to="/"
      aria-label="Loot — Retour à l'accueil"
      className={cn('group shrink-0 inline-block', className)}
    >
      <svg
        width={500 * scale}
        height={vbH * scale}
        viewBox={`0 0 500 ${vbH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          {/* Dégradé diagonal pour la lettre L (navy → cyan) */}
          <linearGradient id="lg-L" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#162844" />
            <stop offset="100%" stopColor="#33B8F0" />
          </linearGradient>

          {/* Dégradé horizontal pour le contour du toggle (gris → cyan → gris) */}
          <linearGradient id="lg-pill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#606060" />
            <stop offset="50%" stopColor="#009FE3" />
            <stop offset="100%" stopColor="#606060" />
          </linearGradient>

          {/* Dégradé radial sphérique pour le dot cyan */}
          <radialGradient id="lg-dot" cx="33%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#A8E0F7" />
            <stop offset="45%" stopColor="#009FE3" />
            <stop offset="100%" stopColor="#0077B3" />
          </radialGradient>

          {/* Dégradé vertical pour le contour du T (gris → cyan) */}
          <linearGradient id="lg-T" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#606060" />
            <stop offset="100%" stopColor="#009FE3" />
          </linearGradient>

          {/* Lueur douce autour du dot cyan */}
          <filter id="lg-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════════
            LETTRE  L  — remplie, dégradé bleu marine
            ═══════════════════════════════════════════ */}
        {/* Barre verticale */}
        <rect x="5" y="5" width="42" height="175" rx="3" fill="url(#lg-L)" />
        {/* Pied horizontal */}
        <rect x="5" y="140" width="88" height="40" rx="3" fill="url(#lg-L)" />

        {/* ═══════════════════════════════════════════
            TOGGLE PILL — contour dégradé, dot animé
            ═══════════════════════════════════════════ */}
        <rect
          x="103" y="5" width="270" height="175"
          rx="87"
          fill={toggleBg}
          stroke="url(#lg-pill)"
          strokeWidth="6"
        />
        {/* Dot orange — position ON (droite) cx=286, animation SMIL en unités SVG */}
        <circle cx="286" cy="92" r="69" fill="url(#lg-dot)" filter="url(#lg-glow)">
          {/* Glisse de cx=286 (ON/droite) à cx=190 (OFF/gauche) et retour — 96 unités SVG */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,0; -60,0; -60,0; 0,0; 0,0"
            keyTimes="0; 0.15; 0.42; 0.58; 0.85; 1"
            calcMode="spline"
            keySplines="0 0 1 1; 0.65 0 0.35 1; 0 0 1 1; 0.65 0 0.35 1; 0 0 1 1"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ═══════════════════════════════════════════
            LETTRE  T  — contour dégradé + icônes gaming
            ═══════════════════════════════════════════ */}
        {/* Barre horizontale */}
        <rect
          x="388" y="5" width="108" height="42"
          rx="3"
          stroke="url(#lg-T)"
          strokeWidth="6"
        />
        {/* Tige verticale */}
        <rect
          x="425" y="47" width="34" height="133"
          rx="3"
          stroke="url(#lg-T)"
          strokeWidth="6"
        />

        {/* Icônes PlayStation dans la tige (de haut en bas : □ × ○ △) */}
        {/* □ carré */}
        <rect x="432" y="57" width="20" height="20" stroke="#009FE3" strokeWidth="2" />
        {/* × croix */}
        <line x1="432" y1="89" x2="452" y2="109" stroke="#009FE3" strokeWidth="2" strokeLinecap="round" />
        <line x1="452" y1="89" x2="432" y2="109" stroke="#009FE3" strokeWidth="2" strokeLinecap="round" />
        {/* ○ cercle */}
        <circle cx="442" cy="129" r="10" stroke="#009FE3" strokeWidth="2" />
        {/* △ triangle */}
        <polygon
          points="442,150 431,169 453,169"
          stroke="#009FE3"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* ═══════════════════════════════════════════
            TAGLINE  (optionnel)
            ═══════════════════════════════════════════ */}
        {withTagline && (
          <text
            x="250"
            y="212"
            textAnchor="middle"
            fontFamily="'Inter', Arial, sans-serif"
            fontWeight="700"
            fontSize="20"
            letterSpacing="0.5"
            fill="#555555"
          >
            {'Gear up game '}
            <tspan fill="#009FE3">on</tspan>
          </text>
        )}
      </svg>
    </Link>
  )
}
