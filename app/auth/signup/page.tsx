'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
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
          {done ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✉</div>
              <h2 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: 400 }}>Check your email</h2>
              <p style={{ color: '#444', fontSize: '19px', margin: 0 }}>
                We sent a confirmation link to <strong>{email}</strong>.<br />
                Click it to finish setting up your account.
              </p>
            </div>
          ) : (
            <>
              <h1 className="iw-auth-title">Join IWish</h1>
              <p className="iw-auth-sub">Post what you have. Post what you wish for.</p>

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
                  <label className="iw-label">Username</label>
                  <input
                    className="iw-input"
                    type="text"
                    placeholder="yourcoolhandle"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="iw-field">
                  <label className="iw-label">Password</label>
                  <input
                    className="iw-input"
                    type="password"
                    placeholder="at least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button className="iw-btn primary" type="submit" disabled={loading} style={{ marginTop: '6px', justifyContent: 'center' }}>
                  {loading ? 'Creating account…' : 'Create account →'}
                </button>
              </form>

              <p className="iw-auth-foot">
                Already have an account?{' '}
                <Link href="/auth/login" className="iw-footer-link">Log in</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </>
  )
}
