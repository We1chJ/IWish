import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import WishCard from '@/components/WishCard'
import LogoutButton from '@/components/LogoutButton'

export const revalidate = 0

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wishes } = await supabase
    .from('wishes')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false })
    .limit(60)

  let userUpvotes: string[] = []
  if (user) {
    const { data } = await supabase
      .from('upvotes')
      .select('wish_id')
      .eq('user_id', user.id)
    userUpvotes = data?.map(u => u.wish_id) ?? []
  }

  const username = user?.user_metadata?.username as string | undefined

  return (
    <>
      <header className="iw-header" style={{ position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 10, borderBottom: 'var(--line)' }}>
        <Link className="iw-logo" href="/">
          <span className="mark">★</span>IWish
        </Link>
        <nav className="iw-nav">
          {user ? (
            <>
              <Link href="/wishes/new">+ post a wish</Link>
              {username && <Link href={`/profile/${username}`}>@{username}</Link>}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/auth/login">Log in</Link>
              <Link className="iw-nav-cta" href="/auth/signup">Join →</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p className="iw-kicker">THE WALL</p>
          <h1 style={{ fontSize: '40px', fontWeight: 400, margin: '0 0 8px' }}>
            What people have &amp; wish for
          </h1>
          {!user && (
            <p style={{ fontSize: '18px', color: '#555', margin: 0 }}>
              <Link href="/auth/signup" className="iw-footer-link">Join</Link> to upvote or post your own.
            </p>
          )}
        </div>

        {wishes && wishes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {wishes.map(wish => (
              <WishCard
                key={wish.id}
                wish={wish as Parameters<typeof WishCard>[0]['wish']}
                initialUpvoted={userUpvotes.includes(wish.id)}
                userId={user?.id ?? null}
              />
            ))}
          </div>
        ) : (
          <div className="iw-card" style={{ textAlign: 'center', padding: '50px 30px' }}>
            <p style={{ fontSize: '22px', margin: '0 0 16px' }}>The wall is empty.</p>
            <Link className="iw-btn primary" href="/auth/signup">Be the first to post →</Link>
          </div>
        )}
      </main>

      <footer className="iw-footer">
        <Link className="iw-logo" href="/">
          <span className="mark" style={{ width: '24px', height: '24px', fontSize: '15px' }}>★</span>IWish
        </Link>
        <span>made for wishing &amp; sharing · 2026</span>
      </footer>
    </>
  )
}
