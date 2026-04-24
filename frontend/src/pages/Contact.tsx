import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { isValidEmail } from '@/utils/validators'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof ContactFormData, string>>

const SUBJECTS = [
  { value: 'commande', label: 'Suivi de commande' },
  { value: 'sav', label: 'SAV / Garantie' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre demande' },
]

const INFO_ITEMS = [
  { icon: MapPin, label: 'Adresse', text: '123 Boulevard Anfa\nCasablanca 20000, Maroc' },
  { icon: Phone, label: 'Téléphone', text: '+212 5 22 00 00 00' },
  { icon: Mail, label: 'Email', text: 'contact@loot.ma' },
  { icon: Clock, label: 'Horaires', text: 'Lun – Sam : 9h00 – 20h00\nDim : 10h00 – 18h00' },
]

const CHANNELS = [
  { icon: MessageCircle, label: 'WhatsApp', value: '+212 6 00 00 00 00', href: 'https://wa.me/212600000000' },
  { icon: Mail, label: 'Email', value: 'contact@loot.ma', href: 'mailto:contact@loot.ma' },
  { icon: Phone, label: 'Téléphone', value: '+212 5 22 00 00 00', href: 'tel:+212522000000' },
]

const RESPONSE_TIMES = [
  { label: 'WhatsApp', time: '< 1 heure' },
  { label: 'Téléphone', time: 'Immédiat' },
  { label: 'Email', time: '< 24 heures' },
]

const EMPTY: ContactFormData = { firstName: '', lastName: '', email: '', subject: '', message: '' }

function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.firstName.trim()) errors.firstName = 'Prénom requis'
  if (!data.lastName.trim()) errors.lastName = 'Nom requis'
  if (!data.email.trim()) errors.email = 'Email requis'
  else if (!isValidEmail(data.email)) errors.email = 'Email invalide'
  if (!data.subject) errors.subject = 'Veuillez choisir un objet'
  if (!data.message.trim()) errors.message = 'Message requis'
  else if (data.message.trim().length < 20) errors.message = 'Message trop court (min. 20 caractères)'
  return errors
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

function inputCls(hasError: boolean): string {
  return [
    'h-10 w-full rounded-lg border bg-background px-3 text-sm text-text placeholder:text-text-subtle',
    'focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
    hasError ? 'border-danger' : 'border-border',
  ].join(' ')
}

function textareaCls(hasError: boolean): string {
  return [
    'w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-text placeholder:text-text-subtle',
    'focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none',
    hasError ? 'border-danger' : 'border-border',
  ].join(' ')
}

export function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(key: keyof ContactFormData, value: string) {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsLoading(true)
    setTimeout(() => { setIsLoading(false); setSent(true) }, 1200)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-navy py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl px-4 text-center sm:px-6"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Support client
          </span>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">
            Contactez-nous
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.
          </p>
        </motion.div>
      </section>

      {/* Canaux rapides */}
      <div className="border-b border-border bg-surface py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CHANNELS.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary transition-transform duration-200 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</div>
                  <div className="mt-0.5 font-semibold text-text">{value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Formulaire — 3/5 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h2 className="font-display text-3xl font-bold uppercase text-navy">
                Envoyez-nous un message
              </h2>
              <p className="mt-1 text-sm text-text-muted">Réponse garantie sous 24h ouvrées.</p>

              {sent ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
                  <CheckCircle className="h-12 w-12 text-primary" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-navy">Message envoyé !</h3>
                  <p className="mt-2 text-sm text-text-muted">
                    Merci {form.firstName}, nous vous répondrons sous 24h.
                  </p>
                  <button
                    onClick={() => { setForm(EMPTY); setSent(false) }}
                    className="mt-6 text-sm font-medium text-primary hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text">Prénom</label>
                      <input
                        value={form.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="Youssef"
                        className={inputCls(!!errors.firstName)}
                      />
                      {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text">Nom</label>
                      <input
                        value={form.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Alami"
                        className={inputCls(!!errors.lastName)}
                      />
                      {errors.lastName && <p className="mt-1 text-xs text-danger">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="vous@email.com"
                      autoComplete="email"
                      className={inputCls(!!errors.email)}
                    />
                    {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">Objet</label>
                    <select
                      value={form.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className={inputCls(!!errors.subject)}
                    >
                      <option value="" disabled>Choisir un objet…</option>
                      {SUBJECTS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={5}
                      placeholder="Décrivez votre demande en détail…"
                      className={textareaCls(!!errors.message)}
                    />
                    {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
                  </div>

                  <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
                    Envoyer le message
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Infos — 2/5 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="font-display text-3xl font-bold uppercase text-navy">Nos coordonnées</h2>
              <div className="mt-6 space-y-5">
                {INFO_ITEMS.map(({ icon: Icon, label, text }) => (
                  <div key={label} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-semibold text-text">{label}</div>
                      <div className="mt-0.5 whitespace-pre-line text-sm text-text-muted">{text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-xl border border-border bg-surface p-6">
                <h3 className="font-display text-lg font-bold uppercase text-navy">
                  Délai de réponse estimé
                </h3>
                <ul className="mt-4 space-y-3">
                  {RESPONSE_TIMES.map(({ label, time }) => (
                    <li key={label} className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">{label}</span>
                      <span className="font-semibold text-primary">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
