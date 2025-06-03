'use client';

import { useAuth } from "@/lib/authContext";
import { Wallet, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DepositPage() {
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
            <Wallet className="mr-3 h-7 w-7 text-color-3" />
            Deposit
          </h1>

          {isLoading ? (
            <div className="h-32 bg-zinc-800 animate-pulse rounded-md"></div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
                <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>
                <p className="text-zinc-400 mb-6">
                  This feature is coming soon. You'll be able to deposit funds to your account to purchase items on the marketplace.
                </p>
                <div className="bg-zinc-900/70 p-4 rounded-md">
                  <p className="text-sm text-zinc-500">
                    We're working on integrating secure payment methods to ensure a safe and reliable experience.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800 flex flex-col items-center">
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-color-3">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Select Amount</h3>
                  <p className="text-sm text-zinc-400 text-center">Choose how much you want to deposit</p>
                </div>

                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800 flex flex-col items-center">
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-color-3">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-sm text-zinc-400 text-center">Select your preferred payment option</p>
                </div>

                <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-800 flex flex-col items-center">
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-color-3">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Confirmation</h3>
                  <p className="text-sm text-zinc-400 text-center">Funds are added to your account instantly</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">Please sign in to access the deposit feature.</p>
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