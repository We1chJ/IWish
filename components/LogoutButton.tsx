'use client'

export default function LogoutButton() {
  return (
    <form action="/auth/logout" method="post">
      <button type="submit" className="iw-nav-text-btn">log out</button>
    </form>
  )
}
