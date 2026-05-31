'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import AuthModal from '@/components/AuthModal'
import type { Wish } from '@/lib/types'

interface Props {
  wish: Wish & { profiles: { username: string } | null }
  initialUpvoted: boolean
  userId: string | null
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function WishCard({ wish, initialUpvoted, userId }: Props) {
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [count, setCount] = useState(wish.upvote_count)
  const [showModal, setShowModal] = useState(false)

  async function toggleUpvote() {
    if (!userId) { setShowModal(true); return }

    const supabase = createClient()
    if (upvoted) {
      setUpvoted(false); setCount(c => c - 1)
      const { error } = await supabase.from('upvotes').delete()
        .eq('user_id', userId).eq('wish_id', wish.id)
      if (error) { setUpvoted(true); setCount(c => c + 1) }
    } else {
      setUpvoted(true); setCount(c => c + 1)
      const { error } = await supabase.from('upvotes').insert({ user_id: userId, wish_id: wish.id })
      if (error) { setUpvoted(false); setCount(c => c - 1) }
    }
  }

  const isWish = wish.status === 'want'

  return (
    <>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      <div className={`iw-card${isWish ? ' iw-card-wish' : ''}`}>
        <span className="type-flag">
          <span className="ic">{isWish ? '○' : '●'}</span>
          {isWish ? 'I WISH' : 'I HAVE'}
        </span>
        <p className="iw-card-body">{wish.body}</p>
        <div className="iw-card-foot">
          <span className="iw-card-handle">@{wish.profiles?.username ?? 'anon'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="iw-card-time">{timeAgo(wish.created_at)}</span>
            <button
              className={`iw-upvote${upvoted ? ' active' : ''}`}
              onClick={toggleUpvote}
              aria-label="upvote"
            >
              ♡ {count}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
