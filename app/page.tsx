import Link from "next/link"
import { BackgroundPaths } from "@/components/background-paths"
import { Twitter, Mail, Activity, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { CardSpotlight } from "@/components/card-spotlight"
import { Step } from "@/components/step"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white">
      <BackgroundPaths />
      
      <div className="flex flex-col items-center flex-1 z-10 w-full max-w-6xl px-4 py-16 md:py-24 gap-16 md:gap-24">
        
        <div className="flex flex-col justify-start items-center text-center min-h-100 pt-24">
          <h2 className="text-6xl font-bold mb-16">
            a cs <span className="bg-gradient-to-r from-color-3 via-brand to-color-1 bg-clip-text text-transparent bg-200% animate-gradient-text">2m</span>arketplace.
          </h2>
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-400 leading-relaxed max-w-md mb-5">
              The premiere platform for AI-powered digital asset trading. 
            </p>
            <div className="flex items-center space-x-4"> 
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
          </div>
        </div>
        
        <div className="flex justify-center items-center w-full max-w-md">
          <CardSpotlight className="h-96 w-full">
            <p className="text-xl font-bold relative z-20 mt-2 text-white">
              Our Mission
            </p>
            <div className="text-neutral-200 mt-4 relative z-20">
              Revolutionize the way you invest.
              <ul className="list-none mt-2">
                <Step title="Skin Price Information" />
                <Step title="Price Estimations - Pattern + Float + Stickers" />
                <Step title="Themed Inventory Builder" />
                <Step title="Trade Up Calculator" />
                <Step title="Market Trends and Predictions" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-sm">
              Our AI agent is trained to provide you with the best possible information
              to make educated decisions when trading digital assets.
            </p>
          </CardSpotlight>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pb-16 md:pb-24">
          <Link 
            href="https://twitter.com/" 
            className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center gap-2 ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={18} />
            Twitter
          </Link>
          
          <Link 
            href="https://discord.gg/" 
            className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center gap-2 ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/svgviewer-output.svg" alt="Discord" width={18} height={18} />
            Discord
          </Link>
          
          <Link 
            href="mailto:baasil.ali@gmail.com" 
            className="px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center gap-2 ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
          >
            <Mail size={18} />
            Email
          </Link>
        </div>

      </div>
    </main>
  )
}
