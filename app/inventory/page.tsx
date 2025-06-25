'use client';

import { useAuth } from "@/lib/authContext";
import { Package, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Types for Steam inventory items
type InventoryItem = {
  id: string;
  name: string;
  marketName: string;
  image: string;
  rarity: string;
  exterior?: string;
  type: string;
  price?: string;
};

export default function InventoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  // Fetch inventory when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      fetchSteamInventory(user.id);
    }
  }, [isAuthenticated, user]);

  // Function to fetch user's Steam inventory
  const fetchSteamInventory = async (steamId: string) => {
    if (!steamId) {
      console.error("Steam ID is undefined");
      setInventoryError("Invalid user ID. Please try signing in again.");
      return;
    }

    setInventoryLoading(true);
    setInventoryError(null);
    
    try {
      console.log(`Fetching inventory for Steam ID: ${steamId}`);
      
      // Call our backend API endpoint that interacts with the Steam API
      const response = await fetch(`http://localhost:3001/api/steam/inventory/${steamId}`, {
        credentials: 'include', // Important for passing the session cookie
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error("Error fetching inventory:", errorData);
        throw new Error(errorData.message || 'Failed to fetch inventory');
      }
      
      const data = await response.json().catch(() => ({ success: false }));
      console.log("Inventory data received:", data);
      
      if (data.success && Array.isArray(data.items)) {
        // Transform the items to match our InventoryItem type
        const items: InventoryItem[] = data.items
          .filter((item: any) => item && item.name) // Ensure item has required properties
          .map((item: any) => ({
            id: item.id || `unknown-${Math.random()}`,
            name: item.name || 'Unknown Item',
            marketName: item.marketName || item.name || 'Unknown Item',
            image: item.image || '/placeholder-item.png',
            rarity: item.rarity || 'Common',
            exterior: item.exterior || undefined,
            type: item.type || 'Other',
            price: "Market Price" // Placeholder
          }));
        
        console.log(`Processed ${items.length} inventory items`);
        setInventoryItems(items);
      } else {
        console.log("No items in response or invalid response format");
        setInventoryItems([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryError(
        error instanceof Error 
          ? error.message 
          : "Failed to load inventory. Please try again later."
      );
    } finally {
      setInventoryLoading(false);
    }
  };

  // Filter items based on selected category
  const filteredItems = inventoryItems.filter(item => {
    if (filter === "all") return true;
    if (!item.type) return false;
    return item.type.toLowerCase() === filter.toLowerCase();
  });

  // Sort items based on selected sort method
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sort) {
      case "newest":
        return -1; // In a real app, you'd use creation date
      case "oldest":
        return 1; // In a real app, you'd use creation date
      case "price-high":
        const bPrice = b.price?.replace("$", "").replace(",", "") || "0";
        const aPrice = a.price?.replace("$", "").replace(",", "") || "0";
        return (parseFloat(bPrice) - parseFloat(aPrice));
      case "price-low":
        const aPrice2 = a.price?.replace("$", "").replace(",", "") || "0";
        const bPrice2 = b.price?.replace("$", "").replace(",", "") || "0";
        return (parseFloat(aPrice2) - parseFloat(bPrice2));
      default:
        return 0;
    }
  });

  // Get rarity color class
  const getRarityColor = (rarity: string): string => {
    if (!rarity) return "text-gray-400";
    
    switch (rarity.toLowerCase()) {
      case "covert": return "text-red-500";
      case "classified": return "text-pink-500";
      case "restricted": return "text-purple-500";
      case "mil-spec": return "text-blue-500";
      case "industrial": return "text-light-blue-500";
      case "consumer": return "text-gray-500";
      default: return "text-gray-400";
    }
  };

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
                <div className="flex flex-wrap gap-3">
                  <select 
                    className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-sm border border-zinc-700"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Items</option>
                    <option value="knife">Knives</option>
                    <option value="glove">Gloves</option>
                    <option value="rifle">Rifles</option>
                    <option value="pistol">Pistols</option>
                  </select>
                  <select 
                    className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-sm border border-zinc-700"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>

              {inventoryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-48 bg-zinc-800 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : inventoryError ? (
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 text-center">
                  <p className="text-red-400 mb-4">{inventoryError}</p>
                  <button 
                    onClick={() => user && fetchSteamInventory(user.id)}
                    className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-md hover:bg-zinc-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : sortedItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sortedItems.map((item) => (
                    <div key={item.id} className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden flex flex-col">
                      <div className="relative bg-gradient-to-b from-zinc-700 to-zinc-800 p-4 flex items-center justify-center h-40">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={160}
                          height={120}
                          className="max-h-32 w-auto object-contain"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate" title={item.marketName}>
                          {item.name}
                        </h3>
                        <p className={`text-xs ${getRarityColor(item.rarity)} mt-1`}>
                          {item.rarity} {item.exterior && `| ${item.exterior}`}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-zinc-300 font-medium">{item.price}</p>
                          <a 
                            href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.marketName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-200"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 text-center">
                  <div className="flex justify-center mb-6">
                    <Package className="h-12 w-12 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your inventory is empty</h3>
                  <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                    No CS2 items were found in your inventory. Make sure your Steam inventory is set to public.
                  </p>
                  <a
                    href="https://steamcommunity.com/my/edit/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-md hover:bg-zinc-600 inline-flex items-center gap-2"
                  >
                    <span>Check Steam Privacy Settings</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

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