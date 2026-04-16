import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/stores/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; global?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const e: typeof errors = {}
    if (!email.trim()) e.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide'
    if (!password) e.password = 'Mot de passe requis'
    else if (password.length < 6) e.password = 'Minimum 6 caractères'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setTimeout(() => {
      const namePart = email.split('@')[0]
      login({
        id: 1,
        email,
        firstName: namePart,
        lastName: '',
        role: 'customer',
      })
      navigate('/account')
    }, 700)
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-xl border border-border bg-background p-8 shadow-elevated">
          <h1 className="text-xl font-bold text-text">Connexion</h1>
          <p className="mt-1 text-sm text-text-muted">
            Pas de compte ?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Créer un compte
            </Link>
          </p>

          {errors.global && (
            <div className="mt-4 rounded-md bg-danger/10 p-3 text-sm text-danger">
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
                placeholder="vous@email.com"
                autoComplete="email"
                className={inputCls(!!errors.email)}
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-text">Mot de passe</label>
                <Link to="/faq" className="text-xs text-text-muted hover:text-primary">
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputCls(!!errors.password)}
              />
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return [
    'h-10 w-full rounded-md border bg-background px-3 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary',
    hasError ? 'border-danger' : 'border-border',
  ].join(' ')
}
