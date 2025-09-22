import type React from "react"
import { DoctorSidebar } from "./doctor-sidebar"
import { DoctorHeader } from "./doctor-header"

interface DoctorLayoutProps {
  children: React.ReactNode
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DoctorSidebar />
      <div className="md:ml-64">
        <DoctorHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
