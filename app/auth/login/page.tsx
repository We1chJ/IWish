'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      const next = searchParams.get('next') ?? '/feed'
      router.push(next)
      router.refresh()
    }
  }

  return (
    <>
      <div className="iw-header-wrap"><header className="iw-header">
        <Link className="iw-logo" href="/">
          <span className="mark">★</span>IWish
        </Link>
      </header></div>

      <main style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="iw-auth-card">
          <h1 className="iw-auth-title">Welcome back</h1>
          <p className="iw-auth-sub">Log in to post wishes and upvote others.</p>

          {searchParams.get('error') === 'auth' && (
            <p className="iw-auth-error">That link expired — try signing in again.</p>
          )}
          {error && <p className="iw-auth-error">{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="iw-field">
              <label className="iw-label">Email</label>
              <input
                className="iw-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="iw-field">
              <label className="iw-label">Password</label>
              <input
                className="iw-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="iw-btn primary" type="submit" disabled={loading} style={{ marginTop: '6px', justifyContent: 'center' }}>
              {loading ? 'Logging in…' : 'Log in →'}
            </button>
          </form>

          <p className="iw-auth-foot">
            No account yet?{' '}
            <Link href="/auth/signup" className="iw-footer-link">Sign up</Link>
          </p>
        </div>
      </main>
    </>
  )
}
