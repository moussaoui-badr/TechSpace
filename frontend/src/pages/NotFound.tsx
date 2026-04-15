import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-bold text-primary md:text-8xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-text md:text-3xl">
        Page introuvable
      </h1>
      <p className="mt-3 text-text-muted">
        La page que vous cherchez n'existe pas ou a ete deplacee.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Retour a l'accueil
      </Link>
    </div>
  )
}
