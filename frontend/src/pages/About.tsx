import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, Shield, Headphones, Award, Truck, Package, ChevronRight } from 'lucide-react'

const STATS = [
  { value: '10 000+', label: 'Produits disponibles', icon: Package },
  { value: '48h', label: 'Livraison à domicile', icon: Truck },
  { value: '50+', label: 'Marques partenaires', icon: Award },
]

const VALUES = [
  {
    icon: Target,
    title: 'Expertise',
    desc: "Notre équipe de passionnés vous conseille pour chaque achat. Nous sélectionnons rigoureusement chaque produit pour garantir qualité et performance.",
  },
  {
    icon: Shield,
    title: 'Confiance',
    desc: "Paiements sécurisés, garantie officielle sur tous nos produits et politique de retours sous 14 jours sans condition.",
  },
  {
    icon: Headphones,
    title: 'Service',
    desc: "Support client 7j/7 via WhatsApp, email ou téléphone. Notre équipe est là pour vous accompagner avant et après votre achat.",
  },
]

const TEAM = [
  { name: 'Youssef Alami', role: 'Fondateur & CEO', initials: 'YA' },
  { name: 'Salma Benhaddou', role: 'Directrice Marketing', initials: 'SB' },
  { name: 'Karim Tahiri', role: 'Responsable Technique', initials: 'KT' },
  { name: 'Nadia Ouazzani', role: 'Service Client', initials: 'NO' },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-24 sm:py-32">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm"
          >
            Notre histoire
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-7xl"
          >
            À propos
            <br />
            <span className="text-primary">de Loot</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          >
            Loot est la destination e-commerce de référence pour le matériel informatique et gaming
            au Maroc. Fondé à Casablanca, nous livrons partout au royaume.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-elevated"
              >
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-display text-5xl font-black text-navy">{value}</div>
                <div className="mt-2 text-sm text-text-muted">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
          >
            <motion.div variants={fadeUp}>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Notre mission
              </span>
              <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-navy sm:text-5xl">
                Rendre la tech
                <br />
                accessible à tous
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-muted">
                Depuis notre création, nous nous battons pour que chaque Marocain puisse accéder au
                meilleur matériel informatique au meilleur prix. Nous négocions directement avec les
                distributeurs et les marques pour vous offrir des tarifs compétitifs.
              </p>
              <p className="mt-4 text-base leading-relaxed text-text-muted">
                Notre catalogue couvre tout l'univers de l'informatique : PC gaming, composants,
                périphériques, laptops, consoles et accessoires. Plus de 10 000 références, livrées
                sous 48h partout au Maroc.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="relative">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-navy shadow-lg">
                <div className="p-8 text-center">
                  <div className="font-display text-8xl font-black text-primary opacity-30">2021</div>
                  <div className="mt-2 font-display text-xl font-bold uppercase tracking-widest text-white">
                    Fondé à Casablanca
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-xl border border-border bg-background p-4 shadow-elevated">
                <div className="font-display text-3xl font-black text-navy">+40%</div>
                <div className="text-xs text-text-muted">croissance annuelle</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Nos valeurs
            </span>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-navy sm:text-5xl">
              Ce qui nous guide
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-elevated"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white transition-colors duration-300 group-hover:bg-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              L'équipe
            </span>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-navy sm:text-5xl">
              Derrière Loot
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {TEAM.map(({ name, role, initials }) => (
              <motion.div key={name} variants={fadeUp} className="group text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-navy font-display text-2xl font-black text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-primary">
                  {initials}
                </div>
                <div className="font-semibold text-text">{name}</div>
                <div className="mt-1 text-xs text-text-muted">{role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl px-4 text-center sm:px-6"
        >
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Prêt à équiper
            <br />
            <span className="text-primary">votre setup ?</span>
          </h2>
          <p className="mt-4 text-white/70">
            Découvrez notre catalogue de plus de 10 000 produits tech au meilleur prix.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Explorer les produits
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
