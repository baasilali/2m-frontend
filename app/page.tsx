import Link from "next/link"
import { BackgroundPaths } from "@/components/background-paths"
import { Twitter, Mail } from "lucide-react"
import Image from "next/image"
import { CardSpotlight } from "@/components/card-spotlight"
import { Step } from "@/components/step"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white overflow-hidden">
      <div className="flex-1 flex items-center justify-center z-10 w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to 2m</h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-md">
              The premiere platform for AI-powered digital asset trading. 
              Join our community and discover new ways to invest, buy/sell, and view digital assets.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="https://twitter.com/" 
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={18} />
                Twitter
              </Link>
              
              <Link 
                href="https://discord.gg/" 
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/svgviewer-output.svg" alt="Discord" width={18} height={18} />
                Discord
              </Link>
              
              <Link 
                href="mailto:baasil.ali@gmail.com" 
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Mail size={18} />
                Email
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <CardSpotlight className="h-96 w-full max-w-md">
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
        </div>
      </div>

      <BackgroundPaths />
    </main>
  )
}
