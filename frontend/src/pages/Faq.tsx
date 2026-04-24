import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FaqItem {
  q: string
  a: string
}

const CATEGORIES: { label: string; items: FaqItem[] }[] = [
  {
    label: 'Commandes & Paiement',
    items: [
      {
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Nous acceptons le paiement à la livraison (cash), le virement bancaire et le paiement par carte bancaire (Visa, Mastercard) via notre plateforme sécurisée.',
      },
      {
        q: 'Puis-je modifier ou annuler ma commande ?',
        a: 'Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation, à condition qu\'elle n\'ait pas encore été expédiée. Contactez notre service client par WhatsApp au +212 6 00 00 00 00.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Après expédition, vous recevrez un email et un SMS avec un numéro de suivi. Vous pouvez également suivre votre commande depuis votre espace client dans l\'onglet "Mes commandes".',
      },
      {
        q: 'Les prix incluent-ils la TVA ?',
        a: 'Oui, tous les prix affichés sur Loot incluent la TVA à 20 % conformément à la législation marocaine.',
      },
    ],
  },
  {
    label: 'Livraison',
    items: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Casablanca, Rabat, Marrakech et Fès : 24h à 48h ouvrées. Autres villes du Maroc : 48h à 72h ouvrées. Zones rurales et montagneuses : 3 à 5 jours ouvrés.',
      },
      {
        q: 'La livraison est-elle gratuite ?',
        a: 'La livraison est gratuite pour toute commande supérieure à 500 DH. En dessous de ce montant, des frais de 30 à 50 DH s\'appliquent selon la zone géographique.',
      },
      {
        q: 'Livrez-vous en dehors du Maroc ?',
        a: 'Actuellement, nous livrons uniquement sur le territoire marocain. Nous prévoyons d\'étendre notre couverture à d\'autres pays dans les prochains mois.',
      },
    ],
  },
  {
    label: 'Retours & Garantie',
    items: [
      {
        q: 'Quelle est votre politique de retour ?',
        a: 'Vous disposez de 14 jours après réception pour retourner un produit en parfait état, dans son emballage d\'origine. Le remboursement est effectué sous 5 à 7 jours ouvrés.',
      },
      {
        q: 'Que faire si mon produit est défectueux ?',
        a: 'Contactez notre service SAV immédiatement avec des photos du produit défectueux. Nous organiserons un échange ou un remboursement selon votre préférence, sans frais supplémentaires.',
      },
      {
        q: 'Quelle est la durée de garantie ?',
        a: 'Tous nos produits bénéficient de la garantie légale de conformité (2 ans). Certaines marques proposent en plus une garantie commerciale allant jusqu\'à 3 ans. La durée exacte est indiquée sur chaque fiche produit.',
      },
    ],
  },
  {
    label: 'Compte & Sécurité',
    items: [
      {
        q: 'Comment créer un compte ?',
        a: 'Cliquez sur "Créer un compte" en haut à droite de la page. Renseignez votre email et un mot de passe sécurisé. La création est gratuite et instantanée.',
      },
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'Sur la page de connexion, cliquez sur "Mot de passe oublié". Vous recevrez un email avec un lien de réinitialisation valable 24 heures.',
      },
      {
        q: 'Mes données personnelles sont-elles sécurisées ?',
        a: 'Oui. Nous utilisons le protocole HTTPS pour toutes les transactions. Vos données de paiement ne sont jamais stockées sur nos serveurs. Pour plus d\'informations, consultez notre politique de confidentialité.',
      },
    ],
  },
]

export function FaqPage() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setOpenMap((p) => ({ ...p, [key]: !p[key] }))
  }

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
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <HelpCircle className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">
            Questions fréquentes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Trouvez rapidement une réponse à vos questions les plus courantes.
          </p>
        </motion.div>
      </section>

      {/* FAQ accordéons */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-10">
            {CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <h2 className="mb-4 font-display text-2xl font-bold uppercase text-navy">
                  {cat.label}
                </h2>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.label}-${idx}`
                    const isOpen = !!openMap[key]
                    return (
                      <div
                        key={key}
                        className="overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary"
                      >
                        <button
                          onClick={() => toggle(key)}
                          className="flex w-full items-center justify-between px-5 py-4 text-left"
                        >
                          <span className="pr-4 font-medium text-text">{item.q}</span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <div className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-text-muted">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl border border-border bg-surface p-8 text-center">
            <h3 className="font-display text-2xl font-bold uppercase text-navy">
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              Notre équipe est disponible 7j/7 pour vous aider.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Contacter le support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
