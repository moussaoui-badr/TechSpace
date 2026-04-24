import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Section {
  heading: string
  content: string | string[]
}

interface LegalTemplateProps {
  title: string
  subtitle: string
  lastUpdated: string
  icon: ReactNode
  sections: Section[]
}

export function LegalTemplate({ title, subtitle, lastUpdated, icon, sections }: LegalTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-navy py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            {icon}
          </span>
          <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{subtitle}</p>
          <p className="mt-4 text-xs text-white/40">Dernière mise à jour : {lastUpdated}</p>
        </motion.div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="prose prose-sm max-w-none space-y-10">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h2 className="mb-3 font-display text-xl font-bold uppercase text-navy">
                  <span className="mr-2 text-primary">{String(idx + 1).padStart(2, '0')}.</span>
                  {section.heading}
                </h2>
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-text-muted">{section.content}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-center text-sm text-text-muted">
            Pour toute question, contactez-nous à{' '}
            <a href="mailto:legal@loot.ma" className="font-medium text-primary hover:underline">
              legal@loot.ma
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
