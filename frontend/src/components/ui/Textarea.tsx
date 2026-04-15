import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, rows = 4, ...rest },
  ref,
) {
  const reactId = useId()
  const textareaId = id ?? reactId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-md border border-border bg-surface px-3.5 py-3 text-text placeholder:text-text-muted',
          'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
          'disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[90px]',
          error && 'border-danger focus:border-danger focus:ring-danger',
          className,
        )}
        {...rest}
      />

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
})
