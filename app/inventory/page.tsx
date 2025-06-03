'use client';

import { useAuth } from "@/lib/authContext";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function InventoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white pt-20">
      <div className="w-full max-w-5xl px-4 py-8">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <Package className="mr-3 h-7 w-7 text-color-3" />
            Inventory
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-zinc-800 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Your Items</h2>
                  <p className="text-sm text-zinc-400">View and manage your CS2 items</p>
                </div>
                <div className="flex gap-3">
                  <select className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-sm border border-zinc-700">
                    <option value="all">All Items</option>
                    <option value="knives">Knives</option>
                    <option value="gloves">Gloves</option>
                    <option value="rifles">Rifles</option>
                    <option value="pistols">Pistols</option>
                  </select>
                  <select className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-sm border border-zinc-700">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="flex justify-center mb-6">
                  <Package className="h-12 w-12 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your inventory is empty</h3>
                <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                  Inventory integration is coming soon. You'll be able to view and manage your CS2 items here.
                </p>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  We're working on integrating with the Steam API to display your CS2 inventory items here. Check back soon!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                    View Items
                  </h3>
                  <p className="text-sm text-zinc-400">See all your CS2 items in one place, with detailed information and current market values.</p>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                    Manage Trades
                  </h3>
                  <p className="text-sm text-zinc-400">Easily list items for sale or send trade offers to other users.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">Please sign in to view your inventory.</p>
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