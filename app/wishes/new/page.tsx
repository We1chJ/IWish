import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import WishForm from '@/components/WishForm'

export default async function NewWishPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/wishes/new')

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

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '50px 20px' }}>
        <p className="iw-kicker">NEW POST</p>
        <h1 style={{ fontSize: '44px', fontWeight: 400, margin: '0 0 32px' }}>
          Add to the wall
        </h1>
        <WishForm userId={user.id} />
      </main>
    </>
  )
}
