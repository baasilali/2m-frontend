'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after a short delay
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-zinc-900/50 rounded-xl max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">Authentication Successful!</h1>
        <p className="mb-4">You have successfully signed in with Steam.</p>
        <p className="text-gray-400">Redirecting you to the home page...</p>
        <div className="mt-4 h-1 w-full bg-gray-700 overflow-hidden">
          <div className="animate-progress-bar h-full bg-gradient-to-r from-color-3 via-brand to-color-1 bg-200%"></div>
        </div>
      </div>
    </div>
  );
} 