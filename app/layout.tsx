import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2m',
  description: 'AI-powered trading platform for digital assets',
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: { url: '/favicon.png', sizes: '180x180' },
    shortcut: { url: '/favicon.png' }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      </head>
      <body className="min-h-screen bg-black text-white relative">{children}</body>
    </html>
  )
}
