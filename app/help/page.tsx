'use client';

import { useAuth } from "@/lib/authContext";
import { HelpCircle, ArrowLeft, Search, MessageSquare, FileText, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HelpPage() {
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
            <HelpCircle className="mr-3 h-7 w-7 text-color-3" />
            Help Center
          </h1>

          <div className="mb-10">
            <div className="relative max-w-xl mx-auto mb-10">
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-3 px-4 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-color-3/30"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-color-3" />
              </div>
              <h3 className="text-lg font-medium mb-2">Documentation</h3>
              <p className="text-sm text-zinc-400 mb-4">Browse our detailed guides and documentation</p>
              <button className="mt-auto text-color-3 text-sm hover:underline">View Guides</button>
            </div>
            
            <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-color-3" />
              </div>
              <h3 className="text-lg font-medium mb-2">Live Chat</h3>
              <p className="text-sm text-zinc-400 mb-4">Talk to our support team in real-time</p>
              <button className="mt-auto text-color-3 text-sm hover:underline">Start Chat</button>
            </div>
            
            <div className="bg-zinc-800/40 p-6 rounded-lg border border-zinc-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-color-3" />
              </div>
              <h3 className="text-lg font-medium mb-2">Email Support</h3>
              <p className="text-sm text-zinc-400 mb-4">Send us a message and we'll respond promptly</p>
              <button className="mt-auto text-color-3 text-sm hover:underline">Contact Us</button>
            </div>
          </div>

          <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b border-zinc-700 pb-4">
                <h3 className="font-medium mb-2">How do I connect my Steam account?</h3>
                <p className="text-sm text-zinc-400">Click the "Sign in with Steam" button in the top right corner of the page and follow the prompts to connect your account.</p>
              </div>
              
              <div className="border-b border-zinc-700 pb-4">
                <h3 className="font-medium mb-2">How do deposits and withdrawals work?</h3>
                <p className="text-sm text-zinc-400">Our deposit and withdrawal systems are currently under development. Once implemented, you'll be able to securely add and remove funds from your account.</p>
              </div>
              
              <div className="border-b border-zinc-700 pb-4">
                <h3 className="font-medium mb-2">Is my personal information secure?</h3>
                <p className="text-sm text-zinc-400">Yes, we use industry-standard security protocols to ensure your personal information and digital assets are protected at all times.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">When will the marketplace be available?</h3>
                <p className="text-sm text-zinc-400">The marketplace is currently under development. We're working hard to bring you a secure and feature-rich trading platform soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 