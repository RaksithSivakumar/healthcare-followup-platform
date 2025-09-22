"use client"

import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { PatientDashboard } from "@/components/dashboard/patient-dashboard"
import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard"
import { useAuth } from "@/components/auth/auth-provider"

export default function HomePage() {
  return (
    <LayoutWrapper>
      <DashboardContent />
    </LayoutWrapper>
  )
}

function DashboardContent() {
  const { user } = useAuth()

  if (user?.role === "doctor") {
    return <DoctorDashboard />
  }

  return <PatientDashboard />
}
