import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/stores/authStore'
import { isUnauthorized } from '@/api/http'
import { isValidEmail } from '@/utils/validators'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; global?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const e: typeof errors = {}
    if (!email.trim()) e.email = 'Email requis'
    else if (!isValidEmail(email)) e.email = 'Email invalide'
    if (!password) e.password = 'Mot de passe requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await login({ email, password, rememberMe })
      navigate('/account')
    } catch (err) {
      setErrors({
        global: isUnauthorized(err)
          ? 'Email ou mot de passe incorrect.'
          : 'Une erreur est survenue. Réessayez.',
      })
    } finally {
      setIsLoading(false)
    }
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
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
              placeholder="vous@email.com"
              autoComplete="email"
              error={errors.email}
            />

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-text">Mot de passe</span>
                <Link to="/faq" className="text-xs text-text-muted hover:text-primary">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              Se souvenir de moi
            </label>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
