import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, id, checked, ...rest },
  ref,
) {
  const reactId = useId()
  const checkboxId = id ?? reactId

  return (
    <label htmlFor={checkboxId} className="inline-flex cursor-pointer items-center gap-2.5">
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          className={cn('peer sr-only', className)}
          {...rest}
        />
        <span
          aria-hidden
          className={cn(
            'h-5 w-5 rounded border border-border bg-surface transition-colors',
            'peer-checked:border-primary peer-checked:bg-primary',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
          )}
        />
        {checked && (
          <Check
            aria-hidden
            className="pointer-events-none absolute h-3.5 w-3.5 text-white"
            strokeWidth={3}
          />
        )}
      </span>
      {label && <span className="text-sm text-text select-none">{label}</span>}
    </label>
  )
})
