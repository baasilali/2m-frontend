import Link from "next/link"
import { Activity, ShoppingBag } from "lucide-react"

export default function PageThree() {
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
        <h1 className="text-4xl font-bold">Marketplace</h1>
      </div>

      {/* No background component here - blank background */}
    </main>
  )
}
