import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { NavCategory } from '@/components/layout/navigationData'

export interface MegaMenuProps {
  category: NavCategory
}

export function MegaMenu({ category }: MegaMenuProps) {
  return (
    <div
      className="absolute left-0 right-0 top-full z-40 border-t border-border bg-surface shadow-2xl"
      role="menu"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Sous-categories */}
        <div>
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-text">{category.label}</h3>
            {category.description && (
              <p className="mt-1 text-sm text-text-muted">{category.description}</p>
            )}
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {category.children.map((child) => (
              <li key={child.slug}>
                <Link
                  to={`/category/${child.slug}`}
                  className="group inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-primary"
                  role="menuitem"
                >
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span>{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={`/category/${category.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Voir tout dans {category.label}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Image + CTA */}
        {category.imageUrl && (
          <Link
            to={`/category/${category.slug}`}
            className="group relative hidden overflow-hidden rounded-lg border border-border bg-surface-hover lg:block"
          >
            <img
              src={category.imageUrl}
              alt={category.label}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors group-hover:bg-primary-hover">
                Decouvrir
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
