"use client"

import Link from "next/link"
import { BackgroundPaths } from "@/components/background-paths"
import { Activity, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Trigger the animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white">
      <nav className="w-full py-4 px-6 grid grid-cols-3 items-center z-10">
        <div className="flex justify-start">
          <Link href="/" className="text-2xl font-bold">
            2m
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
      </nav>

      <div className="flex-1 flex items-center justify-center z-10">
        <div className="relative">
          <AnimatePresence>
            {!isCollapsed ? (
              <motion.h1 
                className="text-8xl font-bold"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.5, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.5, x: "-50%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                A CS2 Marketplace
              </motion.h1>
            ) : (
              <motion.h1 
                className="text-8xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.5, x: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                2m
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BackgroundPaths />
    </main>
  )
}
