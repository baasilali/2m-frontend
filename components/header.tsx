'use client';

import Link from "next/link"
import Image from "next/image"
import { Activity, ShoppingBag, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/authContext"

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-lg rounded-2xl">
      <div className="w-full h-full">
        <div className="w-full py-2 px-6">
          <div className="flex justify-between items-center min-w-0">
            <div className="flex items-center gap-8 -ml-4 flex-shrink-0">
              <Link href="/" className="flex items-center gap-1 flex-shrink-0">
                <Image src="/2mlogocrosshair.png" alt="2m Logo" width={64} height={64} className="flex-shrink-0" />
                <span className="font-bold text-lg whitespace-nowrap">2m.trading</span>
              </Link>
              
              <div className="flex items-center space-x-6 text-lg font-medium flex-shrink-0">
                <Link
                  href="/page-two"
                  className="text-gray-400 hover:text-zinc-100 transition-colors whitespace-nowrap"
                >
                  AI
                </Link>
                <Link
                  href="/page-three"
                  className="text-gray-400 hover:text-zinc-100 transition-colors whitespace-nowrap"
                >
                  Marketplace
                </Link>
              </div>
            </div>
            
            <div className="flex justify-end flex-shrink-0 mr-[0.5%]">
              {isLoading ? (
                <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded-md"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {user?.photos && user.photos[0] && (
                    <Image 
                      src={user.photos[0].value}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-zinc-200 mr-2">{user?.displayName}</span>
                  <button 
                    onClick={logout}
                    className="bg-zinc-800 h-8 text-zinc-200 rounded-md flex items-center gap-1.5 px-2.5 hover:bg-zinc-700 hover:text-zinc-100 transition-colors ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20 whitespace-nowrap"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <a 
                  href="http://localhost:3001/auth/steam"
                  className="bg-zinc-800 h-8 text-zinc-200 rounded-md flex items-center gap-1.5 px-2.5 hover:bg-zinc-700 hover:text-zinc-100 transition-colors ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20 whitespace-nowrap"
                >
                  <span>Sign in</span>
                  <Image 
                    src="/icons8-steam.svg"
                    alt="Steam icon"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 