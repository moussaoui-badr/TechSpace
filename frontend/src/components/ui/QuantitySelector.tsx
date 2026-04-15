import { Minus, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  className?: string
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantitySelectorProps) {
  function handleDecrement() {
    if (value > min) onChange(value - 1)
  }
  function handleIncrement() {
    if (value < max) onChange(value + 1)
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = Number(e.target.value)
    if (Number.isNaN(raw)) return
    const clamped = Math.max(min, Math.min(max, raw))
    onChange(clamped)
  }

  return (
    <div
      className={cn(
        'inline-flex h-10 items-center rounded-md border border-border bg-surface',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Diminuer la quantite"
        className="flex h-full w-10 items-center justify-center text-text-muted transition-colors hover:text-primary disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInput}
        min={min}
        max={max}
        aria-label="Quantite"
        className="h-full w-12 border-x border-border bg-transparent text-center text-sm font-medium text-text focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Augmenter la quantite"
        className="flex h-full w-10 items-center justify-center text-text-muted transition-colors hover:text-primary disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
