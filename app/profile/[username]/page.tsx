import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import WishCard from '@/components/WishCard'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const { data: wishes } = await supabase
    .from('wishes')
    .select('*, profiles(username)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  let userUpvotes: string[] = []
  if (user) {
    const { data } = await supabase
      .from('upvotes')
      .select('wish_id')
      .eq('user_id', user.id)
    userUpvotes = data?.map(u => u.wish_id) ?? []
  }

  const haves = wishes?.filter(w => w.status === 'have') ?? []
  const wants = wishes?.filter(w => w.status === 'want') ?? []
  const isOwn = user?.user_metadata?.username === params.username

  return (
    <>
      <header className="iw-header">
        <Link className="iw-logo" href="/">
          <span className="mark">★</span>IWish
        </Link>
        <nav className="iw-nav">
          <Link href="/feed">← wall</Link>
          {isOwn && <Link className="iw-nav-cta" href="/wishes/new">+ post</Link>}
        </nav>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '50px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p className="iw-kicker">PROFILE</p>
          <h1 style={{ fontSize: '52px', fontWeight: 400, margin: '0 0 4px' }}>@{profile.username}</h1>
          <p style={{ fontSize: '17px', color: '#777', margin: 0 }}>
            {haves.length} {haves.length === 1 ? 'have' : 'haves'} · {wants.length} {wants.length === 1 ? 'wish' : 'wishes'}
          </p>
        </div>

        {haves.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <p className="iw-kicker" style={{ marginBottom: '14px' }}>● I HAVE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {haves.map(wish => (
                <WishCard
                  key={wish.id}
                  wish={wish as Parameters<typeof WishCard>[0]['wish']}
                  initialUpvoted={userUpvotes.includes(wish.id)}
                  userId={user?.id ?? null}
                />
              ))}
            </div>
          </div>
        )}

        {wants.length > 0 && (
          <div>
            <p className="iw-kicker" style={{ marginBottom: '14px' }}>○ I WISH</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {wants.map(wish => (
                <WishCard
                  key={wish.id}
                  wish={wish as Parameters<typeof WishCard>[0]['wish']}
                  initialUpvoted={userUpvotes.includes(wish.id)}
                  userId={user?.id ?? null}
                />
              ))}
            </div>
          </div>
        )}

        {wishes?.length === 0 && (
          <div className="iw-card" style={{ textAlign: 'center', padding: '50px 30px' }}>
            <p style={{ fontSize: '20px', margin: '0 0 16px' }}>Nothing posted yet.</p>
            {isOwn && <Link className="iw-btn primary" href="/wishes/new">Post your first wish →</Link>}
          </div>
        )}
      </main>
    </>
  )
}
