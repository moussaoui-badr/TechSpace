import { motion } from 'framer-motion'
import { Truck, Clock, MapPin, CheckCircle, Package, AlertCircle } from 'lucide-react'

const ZONES = [
  {
    zone: 'Zone 1 — Grandes villes',
    cities: 'Casablanca, Rabat, Salé, Marrakech, Fès, Meknès, Agadir',
    delay: '24h – 48h',
    price: 'Gratuit dès 500 DH',
    priceLow: '30 DH',
  },
  {
    zone: 'Zone 2 — Villes moyennes',
    cities: 'Tanger, Oujda, Kenitra, Tétouan, Safi, El Jadida, Beni Mellal',
    delay: '48h – 72h',
    price: 'Gratuit dès 500 DH',
    priceLow: '40 DH',
  },
  {
    zone: 'Zone 3 — Autres régions',
    cities: 'Laâyoune, Dakhla, Guelmim, Errachidia, Ouarzazate et zones rurales',
    delay: '3 – 5 jours',
    price: 'Gratuit dès 500 DH',
    priceLow: '50 DH',
  },
]

const STEPS = [
  { icon: CheckCircle, title: 'Commande validée', desc: 'Confirmation immédiate par email et SMS.' },
  { icon: Package, title: 'Préparation', desc: 'Votre commande est préparée dans nos entrepôts sous 12h.' },
  { icon: Truck, title: 'Expédition', desc: 'Remise au transporteur avec numéro de suivi.' },
  { icon: MapPin, title: 'Livraison', desc: 'Livraison à domicile avec signature.' },
]

const INFO_CARDS = [
  { icon: Truck, title: 'Livraison à domicile', desc: 'Directement chez vous, sans déplacement.' },
  { icon: Clock, title: 'Suivi en temps réel', desc: 'SMS et email à chaque étape de la livraison.' },
  { icon: CheckCircle, title: 'Signature requise', desc: 'Garantit la bonne réception de votre colis.' },
  { icon: AlertCircle, title: 'Produits volumineux', desc: 'PC tours et moniteurs : contactez-nous avant commande.' },
]

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-navy py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Truck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">
            Livraison
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Livraison rapide partout au Maroc. Gratuite à partir de 500 DH.
          </p>
        </motion.div>
      </section>

      {/* Info cards */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {INFO_CARDS.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-xl border border-border bg-surface p-5 text-center"
              >
                <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-semibold text-text">{title}</div>
                <div className="mt-1 text-xs text-text-muted">{desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tableau zones */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-2 font-display text-3xl font-black uppercase text-navy">
              Zones & délais de livraison
            </h2>
            <p className="mb-8 text-sm text-text-muted">
              Délais indicatifs en jours ouvrés (hors week-end et jours fériés).
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-background">
              {/* Header */}
              <div className="grid grid-cols-4 border-b border-border bg-navy px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white/70">
                <span className="col-span-2">Zone de livraison</span>
                <span>Délai estimé</span>
                <span>Frais</span>
              </div>
              {ZONES.map((row, i) => (
                <div
                  key={row.zone}
                  className={`grid grid-cols-4 items-start gap-4 px-5 py-4 text-sm ${i < ZONES.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="col-span-2">
                    <div className="font-semibold text-text">{row.zone}</div>
                    <div className="mt-0.5 text-xs text-text-muted">{row.cities}</div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                      <Clock className="h-3 w-3" />
                      {row.delay}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-text">{row.price}</div>
                    <div className="text-xs text-text-muted">Sinon {row.priceLow}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Étapes */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-3xl font-black uppercase text-navy">
              Comment fonctionne la livraison ?
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-4"
          >
            {STEPS.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div key={title} variants={fadeUp} className="relative text-center">
                {idx < STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-5 hidden h-px w-full translate-x-5 bg-border sm:block" />
                )}
                <div className="relative mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </div>
                <div className="font-semibold text-text">{title}</div>
                <div className="mt-1 text-xs text-text-muted">{desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
