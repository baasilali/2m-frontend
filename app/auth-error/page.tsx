'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('Unknown authentication error');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-zinc-900/50 rounded-xl max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Authentication Failed</h1>
        <p className="mb-4">We encountered an error while trying to authenticate with Steam.</p>
        <div className="bg-zinc-800 p-4 rounded-md mb-6 text-left">
          <p className="text-gray-300 break-words font-mono text-sm">
            {errorMessage}
          </p>
        </div>
        <p className="text-gray-400 mb-4">Please try again or contact support if the issue persists.</p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/"
            className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
          >
            Return Home
          </Link>
          <Link 
            href="http://localhost:3001/auth/steam"
            className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 