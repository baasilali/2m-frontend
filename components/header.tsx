import Link from "next/link"
import Image from "next/image"
import { Activity, ShoppingBag } from "lucide-react"

export function Header() {
  return (
    <nav className="max-w-7xl mx-auto w-full py-4 px-6 flex justify-between items-center sticky top-0 mt-4 z-50 bg-black/60 backdrop-blur-lg rounded-2xl">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/2mlogocrosshair.png" alt="2m Logo" width={64} height={64} />
          <span className="font-bold text-lg">2m.trading</span>
        </Link>
        
        <div className="flex items-center space-x-6 text-lg font-medium">
          <Link
            href="/page-two"
            className="text-gray-400 hover:text-zinc-100 transition-colors"
          >
            AI
          </Link>
          <Link
            href="/page-three"
            className="text-gray-400 hover:text-zinc-100 transition-colors"
          >
            Marketplace
          </Link>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="bg-zinc-800 h-8 text-zinc-200 rounded-md flex items-center gap-1.5 px-2.5 hover:bg-zinc-700 hover:text-zinc-100 transition-colors ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
        >
          <span>Sign in</span>
          <Image 
            src="/icons8-steam.svg"
            alt="Steam icon"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </button>
      </div>
    </nav>
  )
} 