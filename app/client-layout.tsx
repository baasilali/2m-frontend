"use client";

import { useEffect, useState } from "react";
import { Header } from '@/components/header';
import { ThemeProvider } from "@/components/theme-provider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [inSession, setInSession] = useState(false);

  useEffect(() => {
    const handleSessionChange = (e: CustomEvent) => {
      setInSession(e.detail.inSession);
      // Add/remove class on body based on session state
      if (e.detail.inSession) {
        document.body.classList.add('chat-active');
      } else {
        document.body.classList.remove('chat-active');
      }
    };

    window.addEventListener("sessionStateChange", handleSessionChange as EventListener);
    return () => {
      window.removeEventListener("sessionStateChange", handleSessionChange as EventListener);
      // Clean up class on unmount
      document.body.classList.remove('chat-active');
    };
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <Header />
      {children}
    </ThemeProvider>
  );
} 