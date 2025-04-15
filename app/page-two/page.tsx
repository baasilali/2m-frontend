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
    <main className="relative min-h-screen max-h-screen flex flex-col items-center bg-black text-white overflow-hidden">
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
