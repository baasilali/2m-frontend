"use client"

import Link from "next/link"
import { ParticleBackground } from "@/components/particle-background"
import { Activity, ShoppingBag } from "lucide-react"
import { CounterStrikeChat } from "@/components/counter-strike-chat"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

export default function PageTwo() {
  const [backgroundVisible, setBackgroundVisible] = useState(true)
  const [inSession, setInSession] = useState(false)

  // Listen for session state changes from the chat component
  useEffect(() => {
    const handleSessionChange = (e: CustomEvent) => {
      setInSession(e.detail.inSession)
      setBackgroundVisible(e.detail.backgroundVisible)
    }

    window.addEventListener("sessionStateChange", handleSessionChange as EventListener)
    return () => window.removeEventListener("sessionStateChange", handleSessionChange as EventListener)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white">
      <AnimatePresence>
        {!inSession && (
          <motion.nav
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full py-4 px-6 grid grid-cols-3 items-center z-10"
          >
            <div className="flex justify-start">
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="2m Logo" width={150} height={24} />
              </Link>
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                href="/page-two"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Activity size={18} />
                AI
              </Link>
              <Link
                href="/page-three"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Marketplace
              </Link>
            </div>
            <div></div>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex items-center justify-center z-10 w-full ${inSession ? "h-screen" : ""}`}>
        <CounterStrikeChat />
      </div>

      <AnimatePresence>
        {backgroundVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            <ParticleBackground className="absolute inset-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
