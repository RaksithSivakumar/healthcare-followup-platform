"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Home,
  Users,
  FileText,
  Bell,
  Settings,
  Menu,
  X,
  Stethoscope,
  Calendar,
  MessageSquare,
  Activity,
  Bot,
  LogOut,
  User,
} from "lucide-react"
import { Chat } from "groq-sdk/resources/index.mjs"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/doctor", icon: Home },
  { name: "Patients", href: "/doctor/patients", icon: Users },
  { name: "Patient Records", href: "/doctor/records", icon: FileText },
  { name: "Chat", href: "/doctor/chat", icon: Bot },
  { name: "Notifications", href: "/doctor/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
]


export function DoctorSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const { user, logout} = useAuth()
  const router = useRouter()


  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-sidebar-foreground">Recuver</span>
                <span className="text-xs text-muted-foreground">Doctor Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            {/* User Profile Section */}
            {user && (
              <div className="mb-4 p-3 rounded-lg bg-sidebar-accent/50">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user.name || 'Doctor'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email || 'doctor@healthcare.com'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
                asChild
              >
                <Link href="/login">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            )}
            <div className="text-xs text-muted-foreground text-center">Doctor Portal v1.0</div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
