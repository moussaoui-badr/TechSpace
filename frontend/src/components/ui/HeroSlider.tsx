import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Banner } from '@/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export interface HeroSliderProps {
  banners: Banner[]
  autoPlayMs?: number
  className?: string
}

export function HeroSlider({ banners, autoPlayMs = 6000, className }: HeroSliderProps) {
  const [index, setIndex] = useState(0)
  const count = banners.length

  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs)
    return () => clearInterval(timer)
  }, [count, autoPlayMs])

  if (count === 0) return null

  function prev() {
    setIndex((i) => (i - 1 + count) % count)
  }
  function next() {
    setIndex((i) => (i + 1) % count)
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-md bg-surface',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="relative aspect-[2.4/1] min-h-[260px] sm:aspect-[2.8/1] lg:aspect-[3.2/1]">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            aria-hidden={i !== index}
            className={cn(
              'absolute inset-0 transition-opacity duration-700 ease-out',
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%)',
              }}
            />

            <div className="relative flex h-full max-w-7xl flex-col justify-center gap-4 px-6 sm:px-10 lg:gap-5 lg:px-14">
              <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-text">
                TechSpace
              </span>
              <h2 className="max-w-2xl text-3xl font-black leading-[0.95] text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="max-w-xl text-sm text-white/95 drop-shadow sm:text-base">{banner.subtitle}</p>
              )}
              {banner.linkUrl && (
                <Link to={banner.linkUrl} className="w-fit">
                  <Button size="lg" variant="success">
                    {banner.ctaLabel ?? 'Decouvrir'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Slide precedent"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text transition-colors hover:bg-white hover:text-primary sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Slide suivant"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text transition-colors hover:bg-white hover:text-primary sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Aller au slide ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-8 bg-primary' : 'w-4 bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
