import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  withWordmark?: boolean
  className?: string
}

const SIZE_TOKENS = {
  sm: {
    capsule: 'h-6 w-[52px]',
    dot: 'h-[16px] w-[16px]',
    slide: '22px',
    text: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    capsule: 'h-7 w-[62px]',
    dot: 'h-[20px] w-[20px]',
    slide: '28px',
    text: 'text-lg',
    gap: 'gap-2.5',
  },
  lg: {
    capsule: 'h-9 w-[82px]',
    dot: 'h-[26px] w-[26px]',
    slide: '38px',
    text: 'text-2xl',
    gap: 'gap-3',
  },
}

// Degrade bleu nuit premium (evoque l'espace) — code couleur choisi :
// #0A1628 (bleu nuit profond) -> #1E3A5F (bleu Newegg) en diagonale 135deg
const CAPSULE_GRADIENT = 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)'

// Dot orange Newegg avec dégrade radial pour effet spherique lumineux
const DOT_GRADIENT =
  'radial-gradient(circle at 30% 30%, #FFB879 0%, #F26826 55%, #D9561C 100%)'

export function Logo({
  variant = 'light',
  size = 'md',
  withWordmark = true,
  className,
}: LogoProps) {
  const tokens = SIZE_TOKENS[size]
  const textMain = variant === 'dark' ? 'text-white' : 'text-text'

  return (
    <Link
      to="/"
      aria-label="TechSpace — Retour a l'accueil"
      className={cn('group flex shrink-0 items-center', tokens.gap, className)}
    >
      <span
        className={cn(
          'relative flex shrink-0 items-center rounded-full px-[3px]',
          tokens.capsule,
        )}
        style={{
          background: CAPSULE_GRADIENT,
          animation: 'var(--animate-logo-pulse)',
        }}
        aria-hidden
      >
        <span
          className={cn('rounded-full', tokens.dot)}
          style={{
            background: DOT_GRADIENT,
            animation:
              'var(--animate-logo-slide), var(--animate-logo-dot-glow)',
            ['--logo-slide-distance' as string]: tokens.slide,
          }}
        />
      </span>

      {withWordmark && (
        <span
          className={cn(
            'hidden font-black leading-none tracking-tight sm:inline',
            tokens.text,
          )}
        >
          <span className={textMain}>Tech</span>
          <span className="text-primary">Space</span>
        </span>
      )}
    </Link>
  )
}
