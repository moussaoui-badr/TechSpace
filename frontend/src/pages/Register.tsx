import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/stores/authStore'

interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

const EMPTY: FormState = { firstName: '', lastName: '', email: '', password: '', confirm: '' }

export function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [isLoading, setIsLoading] = useState(false)

  function set(field: keyof FormState, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.email.trim()) e.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
    if (!form.password) e.password = 'Mot de passe requis'
    else if (form.password.length < 6) e.password = 'Minimum 6 caractères'
    if (!form.confirm) e.confirm = 'Confirmation requise'
    else if (form.confirm !== form.password) e.confirm = 'Les mots de passe ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setTimeout(() => {
      login({
        id: Date.now(),
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: 'customer',
      })
      navigate('/account')
    }, 800)
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-xl border border-border bg-background p-8 shadow-elevated">
          <h1 className="text-xl font-bold text-text">Créer un compte</h1>
          <p className="mt-1 text-sm text-text-muted">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Prénom"
                value={form.firstName}
                error={errors.firstName}
                onChange={(v) => set('firstName', v)}
                placeholder="Mohammed"
              />
              <InputField
                label="Nom"
                value={form.lastName}
                error={errors.lastName}
                onChange={(v) => set('lastName', v)}
                placeholder="Alaoui"
              />
            </div>
            <InputField
              label="Email"
              value={form.email}
              error={errors.email}
              onChange={(v) => set('email', v)}
              placeholder="vous@email.com"
              type="email"
            />
            <InputField
              label="Mot de passe"
              value={form.password}
              error={errors.password}
              onChange={(v) => set('password', v)}
              placeholder="Minimum 6 caractères"
              type="password"
            />
            <InputField
              label="Confirmer le mot de passe"
              value={form.confirm}
              error={errors.confirm}
              onChange={(v) => set('confirm', v)}
              placeholder="••••••••"
              type="password"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Créer mon compte
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

interface InputFieldProps {
  label: string
  value: string
  error?: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}

function InputField({ label, value, error, onChange, placeholder, type = 'text' }: InputFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'h-10 w-full rounded-md border bg-background px-3 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary',
          error ? 'border-danger' : 'border-border',
        ].join(' ')}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
