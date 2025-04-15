// Removed "use client"

import type { Metadata } from 'next'
import { Unbounded } from 'next/font/google'
// Removed usePathname import
import './globals.css'
import { Header } from '@/components/header' // Import Header directly
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider
// Removed import for ConditionalHeader

// Initialize Unbounded font
const unbounded = Unbounded({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-unbounded',
})

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
  // Removed pathname logic
  return (
    <html lang="en" className="bg-black" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      </head>
      <body 
        className={`${unbounded.variable} font-sans min-h-screen bg-black text-white relative`} 
        suppressHydrationWarning={true} 
      >
        {/* Wrap content with ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false} // Disable system theme detection for simplicity
        >
          <Header /> 
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
