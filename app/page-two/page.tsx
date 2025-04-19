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
      const sessionActive = e.detail.inSession
      setInSession(sessionActive)
      setBackgroundVisible(e.detail.backgroundVisible)

      // Add/remove class on body
      if (sessionActive) {
        document.body.classList.add("chat-active")
      } else {
        document.body.classList.remove("chat-active")
      }
    }

    window.addEventListener("sessionStateChange", handleSessionChange as EventListener)
    
    // Cleanup function to remove class when component unmounts
    return () => {
      window.removeEventListener("sessionStateChange", handleSessionChange as EventListener)
      document.body.classList.remove("chat-active") // Ensure class is removed on unmount
    }
  }, [])

  return (
    <main className="relative min-h-screen max-h-screen flex flex-col items-center bg-black text-white overflow-hidden">
      <div className={`flex-1 flex z-10 w-full h-full`}>
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
