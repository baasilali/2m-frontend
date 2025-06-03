'use client';

import { useAuth } from "@/lib/authContext";
import { BookmarkIcon, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WatchlistPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white pt-20">
      <div className="w-full max-w-5xl px-4 py-8">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold flex items-center">
              <BookmarkIcon className="mr-3 h-7 w-7 text-color-3" />
              Watchlist
            </h1>
            
            {isAuthenticated && (
              <button className="bg-zinc-800 px-3 py-1.5 rounded-md text-zinc-200 flex items-center gap-1.5 hover:bg-zinc-700 transition-colors text-sm border border-zinc-700">
                <PlusCircle size={16} />
                <span>Add Item</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-800 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="flex justify-center mb-6">
                  <BookmarkIcon className="h-12 w-12 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
                <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                  Add items to your watchlist to keep track of their prices and receive notifications when they change.
                </p>
                <button className="bg-zinc-800 px-4 py-2 rounded-md text-zinc-200 flex items-center gap-2 hover:bg-zinc-700 transition-colors mx-auto">
                  <PlusCircle size={18} />
                  <span>Browse Marketplace</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2">Price Tracking</h3>
                  <p className="text-sm text-zinc-400">Track price changes of your favorite items over time.</p>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-zinc-400">Get alerts when prices drop below your target price.</p>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2">Market Analysis</h3>
                  <p className="text-sm text-zinc-400">View market trends and price history for watched items.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">Please sign in to access your watchlist.</p>
              <a 
                href="http://localhost:3001/auth/steam"
                className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center gap-2 inline-flex"
              >
                <span>Sign in with Steam</span>
                <Image 
                  src="/icons8-steam.svg"
                  alt="Steam icon"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 