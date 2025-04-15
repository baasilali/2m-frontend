"use client"

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'

export function ConditionalHeader() {
  const pathname = usePathname()
  const showNav = pathname !== '/page-two'

  // Always render Header, pass showNav prop
  return <Header showNav={showNav} /> 
} 