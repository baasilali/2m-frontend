import Link from "next/link"
import Image from "next/image"
import { Activity, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  showNav?: boolean
}

export function Header({ showNav = true }: HeaderProps) {
  return (
    <nav className="w-full py-4 px-6 grid grid-cols-3 items-center z-10 bg-black">
      <div className="flex justify-start">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/2mlogocrosshair.png" alt="2m Logo" width={64} height={64} />
          <span className="font-bold text-xl">2m.trading</span>
        </Link>
      </div>
      
      {showNav && (
        <>
          <div className="flex justify-center space-x-4">
            <Link
              href="/page-two"
              className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center gap-2 ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
            >
              <Activity size={18} />
              AI
            </Link>
            <Link
              href="/page-three"
              className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center gap-2 ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
            >
              <ShoppingBag size={18} />
              Marketplace
            </Link>
          </div>
          <div className="flex justify-end">
            <button 
              className="bg-zinc-800 h-9 text-zinc-200 rounded-md flex items-center gap-2 px-3 hover:bg-zinc-700 hover:text-zinc-100 transition-colors ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
            >
              <span>Sign in</span>
              <Image 
                src="/icons8-steam.svg"
                alt="Steam icon"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </button>
          </div>
        </>
      )}
      
      {!showNav && <div />}
      {!showNav && <div />}
      
    </nav>
  )
} 