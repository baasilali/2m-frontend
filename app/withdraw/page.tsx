'use client';

import { useAuth } from "@/lib/authContext";
import { CircleDollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WithdrawPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-black text-white pt-20">
      <div className="w-full max-w-4xl px-4 py-8">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <CircleDollarSign className="mr-3 h-7 w-7 text-color-3" />
            Withdraw
          </h1>

          {isLoading ? (
            <div className="h-32 bg-zinc-800 animate-pulse rounded-md"></div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
                <h2 className="text-xl font-semibold mb-4">Withdraw Funds</h2>
                <p className="text-zinc-400 mb-6">
                  This feature is coming soon. You'll be able to withdraw funds from your account to your preferred payment method.
                </p>
                <div className="bg-zinc-900/70 p-4 rounded-md">
                  <p className="text-sm text-zinc-500">
                    We're implementing secure withdrawal options to ensure your funds are transferred safely and efficiently.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800">
                <h3 className="font-medium mb-3">Your Balance</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">$0.00</span>
                  <span className="text-zinc-400 ml-2 text-sm">USD</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Withdrawals will be available when the feature is implemented.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">Please sign in to access the withdraw feature.</p>
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