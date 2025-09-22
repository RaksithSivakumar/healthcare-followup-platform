"use client"

import type React from "react"
import { useState, createContext, useContext, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

// Create context for sidebar state
interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMounted: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
    
    // Optional: Load saved sidebar state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Optional: Save sidebar state to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed, isMounted])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="md:ml-64">
          <div className="h-16 border-b border-border/50" /> {/* Placeholder header */}
          <main className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMounted }}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div 
          className={`transition-all duration-500 ease-out ${
            isCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}