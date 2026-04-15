import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'right' | 'left'
  widthClass?: string
  className?: string
  footer?: ReactNode
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  widthClass = 'w-full sm:w-[420px]',
  className,
  footer,
}: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-background/75 backdrop-blur-sm"
        style={{ animation: 'fade-in 150ms ease-out' }}
      />

      <aside
        className={cn(
          'absolute top-0 bottom-0 flex flex-col border-border bg-surface',
          widthClass,
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className,
        )}
        style={{
          animation: `slide-in-${side === 'right' ? 'right' : 'right'} 220ms ease-out`,
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text">{title ?? ''}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="border-t border-border px-5 py-4">{footer}</div>}
      </aside>
    </div>,
    document.body,
  )
}
