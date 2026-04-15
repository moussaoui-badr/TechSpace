import { Link } from 'react-router-dom'
import { Construction } from 'lucide-react'
import type { ReactNode } from 'react'

export interface StubPageProps {
  title: string
  subtitle?: string
  phase?: string
  children?: ReactNode
}

export function StubPage({
  title,
  subtitle,
  phase = 'Phase 2',
  children,
}: StubPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl rounded-xl border border-dashed border-border bg-surface/50 p-12 text-center">
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Construction className="h-6 w-6" />
        </span>
        <h1 className="font-display text-3xl font-bold text-text">{title}</h1>
        {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
        <p className="mt-6 text-sm text-text-subtle">
          Cette page sera implementee en <span className="font-semibold text-primary">{phase}</span>.
        </p>
        {children}
        <Link
          to="/"
          className="mt-8 inline-flex h-10 items-center rounded-md border border-border px-5 text-sm text-text transition-colors hover:border-primary hover:text-primary"
        >
          Retour a l'accueil
        </Link>
      </div>
    </div>
  )
}
