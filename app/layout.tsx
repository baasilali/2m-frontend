import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2m - Digital Asset Trading',
  description: 'AI-powered trading platform for digital assets',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="min-h-screen bg-black text-white relative">{children}</body>
    </html>
  )
}
