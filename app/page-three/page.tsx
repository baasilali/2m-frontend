'use client';

import Link from "next/link"
import { Activity, ShoppingBag, Shield, Lock, Clock, Server, Mail, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function PageThree() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send this to your backend
    console.log("Email submitted:", email);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 3000);
  };
  
  return (
    <main className="relative min-h-screen max-h-screen flex flex-col items-center bg-black text-white overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-4xl px-6 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Marketplace Access Coming Soon</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We're implementing enhanced security protocols and finalizing our trading infrastructure to ensure a safe and reliable marketplace experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 mr-3 text-color-3" />
              <h2 className="text-xl font-semibold">Advanced Security</h2>
            </div>
            <p className="text-gray-400">
              Our team is implementing industry-leading security measures to protect your digital assets and personal information.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
            <div className="flex items-center mb-4">
              <Server className="w-6 h-6 mr-3 text-color-3" />
              <h2 className="text-xl font-semibold">Infrastructure Optimization</h2>
            </div>
            <p className="text-gray-400">
              We're fine-tuning our trading infrastructure to handle high-volume transactions with minimal latency.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 mr-3 text-color-3" />
              <h2 className="text-xl font-semibold">Steam Integration</h2>
            </div>
            <p className="text-gray-400">
              Secure authentication and inventory management through Steam's API is being finalized for a seamless trading experience.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 mr-3 text-color-3" />
              <h2 className="text-xl font-semibold">Launch Timeline</h2>
            </div>
            <p className="text-gray-400">
              The marketplace is in final testing and will launch soon. Subscribe below to receive early access notifications.
            </p>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-color-3/10 via-brand/10 to-color-1/10 p-8 rounded-xl border border-zinc-800 w-full">
          <h3 className="text-xl font-semibold mb-4 text-center">Stay Updated</h3>
          <p className="text-gray-400 text-center mb-6">
            Subscribe to be notified when our marketplace launches and get early access to premium features.
          </p>
          
          {isSubmitted ? (
            <div className="bg-zinc-900/70 p-4 rounded-md text-center text-color-3 flex items-center justify-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>Thank you! We'll keep you updated.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full px-4 py-3 bg-zinc-800/70 rounded-md border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-color-3/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="px-5 py-3 bg-zinc-800 text-zinc-200 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors flex items-center justify-center gap-2 ring-1 ring-inset ring-white/10 hover:ring-white/20"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          
          <p className="text-xs text-gray-500 text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </main>
  )
}
