'use client';

import { useAuth } from "@/lib/authContext";
import { User, ArrowLeft, Mail, Phone, Link as LinkIcon, DollarSign, ShoppingCart, LineChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tradeLink, setTradeLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveContactInfo = () => {
    // TODO: Implement saving to backend
    setIsEditing(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white pt-20">
      <div className="w-full max-w-4xl px-4 py-8">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <User className="mr-3 h-7 w-7 text-color-3" />
            Profile
          </h1>

          {isLoading ? (
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-zinc-800 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-zinc-800 animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-zinc-800 animate-pulse rounded"></div>
              </div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                {user.photos && user.photos[0] ? (
                  <Image 
                    src={user.photos[0].value} 
                    alt="Profile picture"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="h-10 w-10 text-zinc-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{user.displayName}</h2>
                  <p className="text-zinc-400">Steam ID: {user.id}</p>
                </div>
              </div>

              {/* Trading Statistics Section */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-xl font-semibold mb-4">Trading Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-800/50 p-4 rounded-md flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mr-3">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Sales (Sold)</p>
                      <p className="text-xl font-bold">$0.00</p>
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-md flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center mr-3">
                      <ShoppingCart className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Purchases (Spent)</p>
                      <p className="text-xl font-bold">$0.00</p>
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-md flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                      <LineChart className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Net</p>
                      <p className="text-xl font-bold">$0.00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="bg-zinc-800/50 p-5 rounded-md space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">Email Address</label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-zinc-500 absolute ml-3" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-color-3"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm text-zinc-400 mb-1">Phone Number</label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-zinc-500 absolute ml-3" />
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-color-3"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="tradeLink" className="block text-sm text-zinc-400 mb-1">Steam Trade Link</label>
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 text-zinc-500 absolute ml-3" />
                        <input
                          id="tradeLink"
                          type="url"
                          value={tradeLink}
                          onChange={(e) => setTradeLink(e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-color-3"
                          placeholder="https://steamcommunity.com/tradeoffer/new/..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-sm bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveContactInfo}
                        className="text-sm bg-color-3 hover:bg-color-3/90 text-black font-medium px-4 py-2 rounded-md transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-800/50 p-5 rounded-md space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-zinc-500 mr-3" />
                      <div>
                        <p className="text-sm text-zinc-400">Email Address</p>
                        <p className="font-medium">{email || "Not set"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-zinc-500 mr-3" />
                      <div>
                        <p className="text-sm text-zinc-400">Phone Number</p>
                        <p className="font-medium">{phone || "Not set"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <LinkIcon className="h-5 w-5 text-zinc-500 mr-3" />
                      <div>
                        <p className="text-sm text-zinc-400">Steam Trade Link</p>
                        {tradeLink ? (
                          <a href={tradeLink} target="_blank" rel="noopener noreferrer" className="font-medium text-color-3 hover:underline">
                            View Trade Link
                          </a>
                        ) : (
                          <p className="font-medium">Not set</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-xl font-semibold mb-4">Account Details</h3>
                <div className="bg-zinc-800/50 p-4 rounded-md">
                  <p className="text-sm">Your account is connected via Steam authentication. Additional account management features will be available in future updates.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">Please sign in to view your profile.</p>
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