import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import WishCard from '@/components/WishCard'

export default async function WishPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wish } = await supabase
    .from('wishes')
    .select('*, profiles(username)')
    .eq('id', params.id)
    .single()

  if (!wish) notFound()

  let upvoted = false
  if (user) {
    const { data } = await supabase
      .from('upvotes')
      .select('wish_id')
      .eq('user_id', user.id)
      .eq('wish_id', wish.id)
      .maybeSingle()
    upvoted = !!data
  }

  return (
    <>
      <div className="iw-header-wrap"><header className="iw-header">
        <Link className="iw-logo" href="/">
          <span className="mark">★</span>IWish
        </Link>
        <nav className="iw-nav">
          <Link href="/feed">← back to wall</Link>
        </nav>
      </header></div>

      <main style={{ maxWidth: '600px', margin: '50px auto', padding: '0 20px' }}>
        <WishCard
          wish={wish as Parameters<typeof WishCard>[0]['wish']}
          initialUpvoted={upvoted}
          userId={user?.id ?? null}
        />
      </main>
    </>
  )
}
