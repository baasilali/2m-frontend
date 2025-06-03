'use client';

import Link from "next/link"
import Image from "next/image"
import { 
  Activity, 
  ShoppingBag, 
  LogOut, 
  User, 
  ChevronDown, 
  Wallet, 
  CircleDollarSign, 
  Package, 
  BookmarkIcon,
  HelpCircle
} from "lucide-react"
import { useAuth } from "@/lib/authContext"
import { useState, useRef, useEffect } from "react"

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="bg-zinc-800 h-8 text-zinc-200 rounded-md flex items-center gap-1.5 px-2.5 hover:bg-zinc-700 hover:text-zinc-100 transition-colors ring-1 ring-inset ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/20"
                  >
                    {user?.photos && user.photos[0] && (
                      <Image 
                        src={user.photos[0].value}
                        alt="User avatar"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-zinc-200 mx-1 max-w-[100px] truncate">{user?.displayName}</span>
                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg z-50 py-1">
                      <div className="px-4 py-2">
                        <div className="font-medium text-sm text-white">Account</div>
                      </div>
                      
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      
                      <div className="border-t border-zinc-800 my-1"></div>
                      
                      <Link href="/deposit" className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <Wallet size={16} className="mr-2" />
                        Deposit
                      </Link>
                      
                      <Link href="/withdraw" className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <CircleDollarSign size={16} className="mr-2" />
                        Withdraw
                      </Link>
                      
                      <div className="border-t border-zinc-800 my-1"></div>
                      
                      <Link href="/inventory" className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <Package size={16} className="mr-2" />
                        Inventory
                      </Link>
                      
                      <Link href="/watchlist" className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <BookmarkIcon size={16} className="mr-2" />
                        Watchlist
                      </Link>
                      
                      <Link href="/help" className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <HelpCircle size={16} className="mr-2" />
                        Help
                      </Link>
                      
                      <div className="border-t border-zinc-800 my-1"></div>
                      
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors text-left"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
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