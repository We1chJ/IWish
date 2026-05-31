import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IWish',
  description: 'A little wall where people post the things they want in life — and the things they already have that someone else is dreaming of.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Patrick+Hand+SC&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
