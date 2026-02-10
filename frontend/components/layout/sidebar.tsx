"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Home,
  MessageCircle,
  Stethoscope,
  TrendingUp,
  FileText,
  Settings,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

// Import the useSidebar hook
import { useSidebar } from "./main-layout"
import { useAuth } from "@/components/auth/auth-provider"
import PatientAvatar3D from "./PatientAvatar3D"


// ✅ Proper Radix Tooltip imports
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip"

// Navigation groups
const navGroups = [
  {
    title: "Main",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Chat", href: "/chat", icon: MessageCircle },
      { name: "Symptom Check", href: "/symptom-check", icon: Stethoscope },
    ],
  },
  {
    title: "Analysis",
    items: [
      { name: "Progress", href: "/progress", icon: TrendingUp },
      { name: "Reports", href: "/reports", icon: FileText },
    ],
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false) // State for mobile fly-out menu
  const { isCollapsed, setIsCollapsed, isMounted } = useSidebar() // Use shared state
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reusable NavLink component
  const NavLink = ({ item }: { item: { name: string; href: string; icon: React.ElementType } }) => {
    const isActive = pathname === item.href
    
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsOpen(false)
                }
              }}
              className={cn(
                "group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02]",
                isActive
                  ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-gradient-to-r hover:from-muted/80 hover:to-muted/40 hover:text-foreground hover:shadow-sm",
                isCollapsed ? "justify-center space-x-0" : "space-x-3"
              )}
            >
              <div
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-primary/60 transition-all duration-300",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
                )}
              />
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn(
                "truncate transition-all duration-300",
                isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}>
                {item.name}
              </span>
              
              {/* Subtle hover effect */}
              <div className={cn(
                "absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              )} />
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent 
              side="right" 
              sideOffset={5}
              className="bg-popover/95 backdrop-blur-sm border border-border/50 shadow-lg"
            >
              <p className="font-medium">{item.name}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Enhanced Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 h-12 w-12 rounded-xl border border-border/50 bg-background/95 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl md:hidden",
          isOpen && "rotate-90"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Menu className="h-6 w-6 transition-transform duration-300" />
        )}
      </Button>

      {/* Enhanced Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-border/30 bg-background/95 shadow-xl backdrop-blur-xl transition-all duration-500 ease-out",
          isCollapsed ? "w-20" : "w-64",
          // On mobile, control visibility with translate-x
          isOpen ? "translate-x-0" : "-translate-x-full",
          // On desktop, the sidebar is always visible
          "md:translate-x-0"
        )}
        aria-label="Sidebar Navigation"
      >
        {/* Enhanced Logo and App Name */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border/30 px-6 bg-gradient-to-r from-background/50 to-background/80">
          <div className={cn("flex items-center space-x-2 overflow-hidden", isCollapsed && "w-8")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 shadow-md ring-2 ring-primary/20">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "whitespace-nowrap text-lg font-bold text-foreground transition-all duration-500",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}
            >
              Healix
            </span>
          </div>

          {/* Professional Toggle Button in Header */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hidden h-8 w-8 rounded-lg border border-border/40 bg-muted/30 shadow-sm transition-all duration-300 hover:bg-muted hover:scale-105 hover:shadow-md md:flex",
                    isCollapsed && "mx-auto"
                  )}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 transition-transform duration-300" />
                  ) : (
                    <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p className="font-medium">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="flex flex-col gap-4" role="navigation" aria-label="Main Navigation">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3
                  className={cn(
                    "mb-2 text-xs font-semibold uppercase text-muted-foreground transition-all duration-500",
                    isCollapsed ? "text-center opacity-60" : "px-3 opacity-100"
                  )}
                >
                  {isCollapsed ? group.title.substring(0, 3) : group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
        {/* Patient 3D Avatar (below navigation) */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-border/30 bg-gradient-to-b from-background/40 to-background/10">
            <div className="rounded-xl bg-muted/20 p-3 shadow-inner ring-1 ring-border/40">
              <PatientAvatar3D />
            </div>
          </div>
        )}


        {/* Enhanced Footer Section */}
        <div className="mt-auto border-t border-border/30 bg-gradient-to-t from-muted/10 to-transparent p-4">
          <div className="space-y-4">
            <NavLink item={{ name: "Settings", href: "/settings", icon: Settings }} />
            <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

            {/* Enhanced User Profile */}
            {user && (
              <div className={cn(
                "flex items-center rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 p-2 transition-all duration-500 hover:from-muted/50 hover:to-muted/20",
                isCollapsed ? "justify-center space-x-0" : "space-x-3"
              )}>
                <Avatar className="h-9 w-9 ring-2 ring-primary/20 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.role === 'doctor' ? 'D' : 'P'}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "flex flex-col text-sm transition-all duration-500",
                  isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                )}>
                  <span className="font-semibold text-foreground">
                    {user.name || 'User'}
                  </span>
                  <span className="text-muted-foreground capitalize">
                    {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                  </span>
                </div>
              </div>
            )}

            {/* Professional Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              className={cn(
                "hidden h-10 w-full rounded-lg border border-border/40 bg-gradient-to-r from-muted/20 to-muted/10 shadow-sm transition-all duration-300 hover:from-muted/40 hover:to-muted/20 hover:scale-[1.02] hover:shadow-md md:flex",
                isCollapsed ? "justify-center px-0" : "justify-start space-x-3 px-3"
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronsRight className="h-5 w-5 text-muted-foreground" />
              ) : (
                <>
                  <ChevronsLeft className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}