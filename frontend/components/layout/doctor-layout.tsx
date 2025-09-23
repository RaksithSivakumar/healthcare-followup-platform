import type React from "react"
import { useState } from "react"
import { DoctorSidebar } from "./doctor-sidebar"
import { DoctorHeader } from "./doctor-header"

interface DoctorLayoutProps {
  children: React.ReactNode
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      <DoctorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={isCollapsed ? "md:ml-20 transition-all duration-300" : "md:ml-64 transition-all duration-300"}>
        <DoctorHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
