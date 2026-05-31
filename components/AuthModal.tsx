'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="iw-overlay" onClick={onClose}>
      <div className="iw-modal" onClick={e => e.stopPropagation()}>
        <button className="iw-modal-close" onClick={onClose} aria-label="close">×</button>
        <p className="iw-kicker" style={{ margin: '0 0 8px' }}>JOIN FIRST</p>
        <h3 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: 400 }}>Upvote this wish?</h3>
        <p style={{ margin: '0 0 24px', fontSize: '18px', color: '#444' }}>
          Create a free account to upvote wishes and post your own.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link className="iw-btn primary" href="/auth/signup" style={{ fontSize: '19px' }}>Sign up free</Link>
          <Link className="iw-btn" href="/auth/login" style={{ fontSize: '19px' }}>Log in</Link>
        </div>
      </div>
    </div>
  )
}
