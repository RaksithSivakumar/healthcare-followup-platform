"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { MainLayout } from "./main-layout"
import { DoctorLayout } from "./doctor-layout"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user?.role === "doctor") {
    return <DoctorLayout>{children}</DoctorLayout>
  }

  return <MainLayout>{children}</MainLayout>
}
