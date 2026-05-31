'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function WishForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<'want' | 'have'>('want')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('wishes')
      .insert({ user_id: userId, body: body.trim(), status })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/feed')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Status toggle */}
      <div>
        <p className="iw-label" style={{ marginBottom: '10px' }}>WHAT KIND OF POST?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className={`iw-toggle${status === 'want' ? ' selected' : ''}`}
            onClick={() => setStatus('want')}
          >
            <span>○</span> I WISH
          </button>
          <button
            type="button"
            className={`iw-toggle${status === 'have' ? ' selected' : ''}`}
            onClick={() => setStatus('have')}
          >
            <span>●</span> I HAVE
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="iw-field">
        <label className="iw-label" htmlFor="body">
          {status === 'want' ? 'WHAT DO YOU WISH FOR?' : 'WHAT DO YOU HAVE?'}
        </label>
        <textarea
          id="body"
          className="iw-input"
          style={{ resize: 'vertical', minHeight: '110px' }}
          placeholder={
            status === 'want'
              ? 'e.g. a quiet cabin in the woods, someone to teach me guitar…'
              : 'e.g. a spare road bike, homemade sourdough starter…'
          }
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={280}
          required
        />
        <span style={{ fontSize: '14px', color: '#999', textAlign: 'right' }}>{body.length}/280</span>
      </div>

      {error && <p className="iw-auth-error">{error}</p>}

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <button
          className="iw-btn primary"
          type="submit"
          disabled={loading || !body.trim()}
          style={{ fontSize: '20px' }}
        >
          {loading ? 'Posting…' : 'Post to the wall →'}
        </button>
        <a href="/feed" className="iw-hint">cancel</a>
      </div>
    </form>
  )
}
