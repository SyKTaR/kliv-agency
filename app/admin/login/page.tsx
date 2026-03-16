'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Identifiants incorrects. Vérifiez votre email et mot de passe.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-input)] px-4">
      {/* Background subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,240,228,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,228,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">
            Kliv
          </span>
          <p className="text-[var(--text-faint)] text-sm mt-1 font-[family-name:var(--font-dm)]">
            Espace administration
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-input)] rounded-2xl p-8">
          <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[var(--text-primary)] mb-6">
            Connexion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-ghost)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@kliv.fr"
                  className="w-full pl-9 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg
                    text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
                    placeholder:text-[var(--text-ghost)] outline-none
                    focus:border-[#7BA7BC]/50 focus:ring-1 focus:ring-[#7BA7BC]/20
                    transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-[var(--text-primary)]/50 mb-2 font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-ghost)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg
                    text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)]
                    placeholder:text-[var(--text-ghost)] outline-none
                    focus:border-[#7BA7BC]/50 focus:ring-1 focus:ring-[#7BA7BC]/20
                    transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-ghost)] hover:text-[var(--text-muted)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm font-[family-name:var(--font-dm)] bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-[family-name:var(--font-dm)] font-medium text-sm
                bg-[#7BA7BC] hover:bg-[#7BA7BC]/90 text-[#080d14]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 mt-2"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
