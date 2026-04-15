import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastData {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
}

export interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
}

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-success' },
  error: { icon: XCircle, color: 'text-danger' },
  info: { icon: Info, color: 'text-info' },
  warning: { icon: AlertCircle, color: 'text-warning' },
}

export function Toast({ toast, onClose }: ToastProps) {
  const variant = toast.variant ?? 'info'
  const { icon: Icon, color } = variantStyles[variant]
  const duration = toast.duration ?? 4000

  useEffect(() => {
    const timer = window.setTimeout(() => onClose(toast.id), duration)
    return () => window.clearTimeout(timer)
  }, [toast.id, duration, onClose])

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-surface p-4 pr-3 shadow-elevated"
      style={{
        animation: 'slide-in-right 180ms ease-out',
        boxShadow: 'var(--shadow-elevated)',
        minWidth: '280px',
      }}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', color)} />
      <p className="flex-1 text-sm text-text">{toast.message}</p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label="Fermer"
        className="text-text-muted transition-colors hover:text-text"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: ToastData[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null
  return createPortal(
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>,
    document.body,
  )
}
