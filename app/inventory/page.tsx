'use client';

import { useAuth } from "@/lib/authContext";
import { Package, ArrowLeft, ExternalLink, Trash2, ShoppingCart, Search } from "lucide-react";
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
  tradable: boolean;
};

type SelectedItem = InventoryItem;

export default function InventoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("rarity");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  // Map of itemId -> price percentage
  const [selectedItemPrices, setSelectedItemPrices] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");

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
            price: "Market Price", // Placeholder
            tradable: item.tradable ?? true
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

  // Filter items based on search and only tradable
  const filteredItems = inventoryItems.filter(item => {
    if (!item.tradable) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.marketName && item.marketName.toLowerCase().includes(q))
    );
  });

  // Rarity order for sorting
  const rarityOrder = [
    "covert", "extraordinary", "master", "classified", "restricted", "mil-spec", "industrial", "consumer", "base grade", "common"
  ];

  // Sort items based on selected sort method
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sort) {
      case "rarity": {
        const aIdx = rarityOrder.findIndex(r => a.rarity && a.rarity.toLowerCase().includes(r));
        const bIdx = rarityOrder.findIndex(r => b.rarity && b.rarity.toLowerCase().includes(r));
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      }
      case "price-high": {
        const bPrice = b.price?.replace("$", "").replace(",", "") || "0";
        const aPrice = a.price?.replace("$", "").replace(",", "") || "0";
        return (parseFloat(bPrice) - parseFloat(aPrice));
      }
      case "price-low": {
        const aPrice2 = a.price?.replace("$", "").replace(",", "") || "0";
        const bPrice2 = b.price?.replace("$", "").replace(",", "") || "0";
        return (parseFloat(aPrice2) - parseFloat(bPrice2));
      }
      case "name": {
        return a.name.localeCompare(b.name);
      }
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

  // Rarity/grade background gradient
  function getRarityGradient(rarity: string): string {
    const r = rarity.toLowerCase();
    if (["covert", "extraordinary", "master"].some((g) => r.includes(g))) return "from-red-700/10 to-zinc-900/100";
    if (r.includes("classified")) return "from-pink-500/10 to-zinc-900/100";
    if (r.includes("restricted")) return "from-purple-600/10 to-zinc-900/100";
    if (r.includes("mil-spec")) return "from-blue-600/10 to-zinc-900/100";
    if (r.includes("industrial")) return "from-sky-400/10 to-zinc-900/100";
    if (r.includes("base grade")) return "from-zinc-200/5 to-zinc-900/100";
    return "from-zinc-700/10 to-zinc-900/100";
  }

  // Solid color for rarity bar
  function getRaritySolidColor(rarity: string): string {
    const r = rarity.toLowerCase();
    if (["covert", "extraordinary", "master"].some((g) => r.includes(g))) return "#ef4444"; // red-500
    if (r.includes("classified")) return "#ec4899"; // pink-500
    if (r.includes("restricted")) return "#a21caf"; // purple-600
    if (r.includes("mil-spec")) return "#2563eb"; // blue-600
    if (r.includes("industrial")) return "#38bdf8"; // sky-400
    if (r.includes("base grade")) return "#d4d4d8"; // zinc-200
    return "#71717a"; // zinc-700
  }

  // Selection logic
  const toggleSelectItem = (item: InventoryItem) => {
    setSelectedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        // Remove item and its price
        setSelectedItemPrices(prices => {
          const newPrices = { ...prices };
          delete newPrices[item.id];
          return newPrices;
        });
        return prev.filter((i) => i.id !== item.id);
      } else {
        // Add item with default pricePct 100
        setSelectedItemPrices(prices => ({ ...prices, [item.id]: 100 }));
        return [...prev, item];
      }
    });
  };

  const removeSelectedItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItemPrices(prices => {
      const newPrices = { ...prices };
      delete newPrices[id];
      return newPrices;
    });
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
    setSelectedItemPrices({});
  };

  // Calculate subtotal based on per-item price
  const basePrice = 10; // TODO: Replace with real price logic per item
  const subtotal = selectedItems.reduce((sum, item) => {
    const pct = selectedItemPrices[item.id] ?? 100;
    return sum + (basePrice * pct) / 100;
  }, 0);

  // Calculate total inventory value (placeholder: sum of all item prices or basePrice)
  const totalInventoryValue = inventoryItems.reduce((sum, item) => {
    // Try to parse item.price, fallback to basePrice if not available
    const price = item.price && !isNaN(Number(item.price)) ? Number(item.price) : basePrice;
    return sum + price;
  }, 0);

  // Helper to remove wear from item name if present
  function stripWearFromName(name: string, exterior?: string | null) {
    if (!exterior) return name;
    // Remove (Factory New), (Minimal Wear), etc. from the end of the name
    return name.replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)$/i, "");
  }

  // Helper to render StatTrak in orange if present
  function renderStatTrakTitle(name: string) {
    // Match "★ StatTrak™ ..." or "StatTrak™ ..."
    const starStatTrakRegex = /^(★)\s*(StatTrak™?)(.*)$/i;
    const statTrakRegex = /^(StatTrak™?)(.*)$/i;
    const starMatch = name.match(starStatTrakRegex);
    if (starMatch) {
      return <><span className="text-orange-400">{starMatch[1]}</span>{' '}<span className="text-orange-400">{starMatch[2]}</span>{starMatch[3]}</>;
    }
    const statTrakMatch = name.match(statTrakRegex);
    if (statTrakMatch) {
      return <><span className="text-orange-400">{statTrakMatch[1]}</span>{statTrakMatch[2]}</>;
    }
    return name;
  }

  return (
    <main className="relative min-h-screen flex flex-row bg-black text-white pt-20 h-[calc(100vh-5rem)] px-4 md:px-12 xl:px-32">
      <section className="flex-1 flex flex-col py-8 overflow-y-auto h-full mx-auto max-w-7xl">
        {/* Header moved outside card area, smaller font */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-start gap-6 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-color-3" />
              Inventory
              <span className="text-sm text-zinc-400 font-normal whitespace-nowrap ml-2">Inv. Value: ~ ${totalInventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </h1>
            <div className="mt-1">
              <span className="text-sm text-zinc-400 font-normal">Your Items</span>
              <span className="block text-xs text-zinc-500">View and manage your CS2 items</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 md:ml-4">
            {/* Search Field */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search For Item"
              className="w-full md:w-64 pl-9 pr-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-color-3"
            />
            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="ml-2 px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-color-3"
            >
              <option value="rarity">Sort by Rarity</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-zinc-800 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              {inventoryLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                <div className="grid gap-4"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  {sortedItems.map((item) => (
                    <div key={item.id} className={`rounded-lg border border-zinc-700 overflow-hidden flex flex-col relative w-full max-w-xs h-[360px] mx-auto ${selectedItems.find(i => i.id === item.id) ? 'ring-2 ring-color-3' : ''}`}>
                      <div
                        className={`relative p-6 flex items-center justify-center h-80 bg-gradient-to-t ${getRarityGradient(item.rarity)}`}
                      >
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={420}
                          height={260}
                          className="max-h-64 w-auto object-contain"
                        />
                        {/* Overlayed text */}
                        <div className="absolute left-0 top-0 w-full px-4 pt-3 pb-2 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
                          <h3 className="font-bold text-sm truncate text-left drop-shadow" title={item.marketName}>
                            {renderStatTrakTitle(stripWearFromName(item.name, item.exterior))}
                          </h3>
                          {item.exterior && (
                            <p className="text-xs text-zinc-200 truncate drop-shadow text-left">{item.exterior}</p>
                          )}
                        </div>
                        {/* Rarity color bar */}
                        <div
                          className="absolute left-0 bottom-0 w-full"
                          style={{
                            height: "6px",
                            background: getRaritySolidColor(item.rarity),
                            borderBottomLeftRadius: "0.5rem",
                            borderBottomRightRadius: "0.5rem",
                          }}
                        />
                      </div>
                      <div className="p-3 flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-center">
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
                        <button
                          className={`w-full mt-2 py-1.5 rounded-md text-sm font-semibold transition-colors ${selectedItems.find(i => i.id === item.id) ? 'bg-color-3 text-white' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
                          onClick={() => toggleSelectItem(item)}
                        >
                          {selectedItems.find(i => i.id === item.id) ? 'Selected' : 'Sell Item'}
                        </button>
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
      </section>
      {/* Side Panel */}
      <aside className="h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-lg flex flex-col z-30 min-w-[22rem] mt-8 ml-8 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-color-3" />
            {selectedItems.length} item{selectedItems.length !== 1 && 's'} selected
          </h2>
          {selectedItems.length > 0 && (
            <button onClick={clearSelectedItems} className="text-zinc-400 hover:text-red-400 transition-colors" title="Clear all">
              <Trash2 size={18} />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {selectedItems.length === 0 ? (
            <p className="text-zinc-500 text-center mt-8">No items selected.</p>
          ) : (
            selectedItems.map((item) => {
              const pricePct = selectedItemPrices[item.id] ?? 100;
              const price = ((basePrice * pricePct) / 100).toFixed(2);
              let tier = "Recommended";
              let tierColor = "text-green-400";
              if (pricePct < 95) { tier = "Discounted"; tierColor = "text-orange-400"; }
              else if (pricePct > 103) { tier = "Expensive"; tierColor = "text-yellow-400"; }
              return (
                <div key={item.id} className="bg-zinc-800/70 rounded-md p-3 border border-zinc-700 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-400 truncate">{item.rarity} {item.exterior && `| ${item.exterior}`}</p>
                    </div>
                    <button onClick={() => removeSelectedItem(item.id)} className="text-zinc-400 hover:text-red-400 transition-colors" title="Remove">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-400">Price</span>
                    <div className="flex items-center bg-zinc-800 rounded px-2 py-1">
                      <span className="text-zinc-400 mr-1">$</span>
                      <input
                        type="number"
                        min={((basePrice * 80) / 100).toFixed(2)}
                        max={((basePrice * 120) / 100).toFixed(2)}
                        step="0.01"
                        value={price}
                        onChange={e => {
                          const val = Math.round((parseFloat(e.target.value) / basePrice) * 100);
                          setSelectedItemPrices(prices => ({ ...prices, [item.id]: Math.max(80, Math.min(120, val)) }));
                        }}
                        className="w-16 bg-transparent text-zinc-100 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min={80}
                      max={120}
                      value={pricePct}
                      onChange={e => setSelectedItemPrices(prices => ({ ...prices, [item.id]: Number(e.target.value) }))}
                      className="w-full accent-color-3"
                    />
                    <span className="text-xs text-zinc-400 w-10 text-right">{pricePct}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm font-semibold flex items-center gap-1 ${tierColor}`}>{tier === "Recommended" ? <>&#10003;</> : null} {tier}</span>
                    <span className="ml-auto text-xs text-zinc-400">{((parseFloat(price) / basePrice) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Subtotal and Sell button */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm">Subtotal</span>
            <span className="text-zinc-200 font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <button
            className="w-full py-2 rounded-md bg-color-3 text-white font-bold hover:bg-color-2 transition-colors disabled:opacity-50"
            disabled={selectedItems.length === 0}
          >
            Sell Items
          </button>
        </div>
      </aside>
    </main>
  );
} 