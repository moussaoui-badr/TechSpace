import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Package, ShoppingBag, Truck } from 'lucide-react'

const STEPS = [
  { label: 'En attente',   icon: Package },
  { label: 'Confirmée',    icon: Check },
  { label: 'Préparation',  icon: Package },
  { label: 'En livraison', icon: Truck },
  { label: 'Livrée',       icon: ShoppingBag },
]

export function OrderConfirmationPage() {
  const [orderNumber] = useState(() => `LT-${Date.now().toString().slice(-8)}`)

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-surface to-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">

        {/* Checkmark animé */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Cercle pulsant externe */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Cercle pulsant moyen */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
            {/* Cercle principal */}
            <motion.div
              className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-cyan"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Check className="h-10 w-10 stroke-[3] text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Titre */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-black uppercase tracking-wide text-text sm:text-5xl">
            Commande confirmée !
          </h1>
          <p className="mt-3 text-base text-text-muted">
            Merci pour votre confiance. Nous vous contacterons sous peu pour confirmer la livraison.
          </p>
        </motion.div>

        {/* Numéro de commande monumental */}
        <motion.div
          className="mt-8 overflow-hidden rounded-2xl bg-navy shadow-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <div className="px-6 pb-6 pt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Numéro de commande
            </p>
            <p className="font-display text-4xl font-black tracking-widest text-primary sm:text-5xl">
              {orderNumber}
            </p>
            <p className="mt-2 text-sm text-white/50">
              Conservez ce numéro pour le suivi de votre commande
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
            <div className="px-5 py-3">
              <p className="text-xs text-white/40">Délai estimé</p>
              <p className="mt-0.5 text-sm font-semibold text-white">2 – 4 jours ouvrés</p>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs text-white/40">Paiement</p>
              <p className="mt-0.5 text-sm font-semibold text-white">À la livraison</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline statuts */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Suivi de commande
          </p>
          <div className="relative flex items-start justify-between">
            {/* Barre de progression */}
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-border">
              <div className="h-full w-[12%] bg-primary" />
            </div>

            {STEPS.map((step, i) => {
              const active = i === 0
              const done = false
              return (
                <div key={step.label} className="relative flex flex-col items-center gap-2" style={{ width: '20%' }}>
                  <div className={[
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                    active
                      ? 'border-primary bg-primary text-white shadow-cyan'
                      : done
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-background text-text-subtle',
                  ].join(' ')}>
                    <step.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className={[
                    'text-center text-[10px] font-medium leading-tight',
                    active ? 'text-primary' : 'text-text-subtle',
                  ].join(' ')}>
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.4 }}
        >
          <Link
            to="/account"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white transition-all hover:bg-navy-mid"
          >
            Voir mes commandes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/products"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary-soft"
          >
            <ShoppingBag className="h-4 w-4" />
            Continuer mes achats
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
