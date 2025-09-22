"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarDays, Stethoscope, Activity } from "lucide-react"

interface PatientDetails {
  pid: string
  pname: string
  pemail: string
  doctor?: { did: string; dname: string; specialization?: string } | null
  visits?: Array<{
    visit_date: string
    condition: string
    disease: string
    vital?: { bp?: string; hr?: string; spo2?: string }
    report?: string
    medications?: Array<{ name?: string; dose?: string }>
    symptoms?: Array<any>
  }>
}

export default function DoctorPatientDetailsPage() {
  const params = useParams() as { pid?: string }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patient, setPatient] = useState<PatientDetails | null>(null)

  useEffect(() => {
    const pid = params?.pid
    if (!pid) return
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ patientId: pid }),
        })
        const data = await res.json()
        if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to load patient")
        if (!cancelled) setPatient(data.patient as PatientDetails)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Something went wrong")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [params?.pid])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/doctor/patients")}> 
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Patients
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" /> Patient Details
          </CardTitle>
          <CardDescription>Review demographics, assigned doctor, and recent visits</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">Loading patient...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && patient && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold">{patient.pname}</h2>
                <Badge variant="secondary">{patient.pid}</Badge>
                <span className="text-sm text-muted-foreground">{patient.pemail}</span>
              </div>
              <div className="text-sm">
                <p>
                  Assigned Doctor: {patient.doctor?.dname || "Unassigned"}
                  {patient.doctor?.specialization ? (
                    <span className="text-muted-foreground"> · {patient.doctor.specialization}</span>
                  ) : null}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" /> Recent Visits
                </h3>
                {patient.visits && patient.visits.length > 0 ? (
                  <div className="grid gap-3">
                    {[...patient.visits].slice(-5).reverse().map((v, idx) => (
                      <div key={`${v.visit_date}-${idx}`} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{v.condition} ({v.disease})</div>
                          <Badge variant="outline">{v.visit_date}</Badge>
                        </div>
                        {v.vital && (
                          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                            <Activity className="h-3 w-3" />
                            <span>BP: {v.vital.bp || "-"}</span>
                            <span>HR: {v.vital.hr || "-"}</span>
                            <span>SpO2: {v.vital.spo2 || "-"}</span>
                          </div>
                        )}
                        {v.report && (
                          <p className="mt-2 text-sm text-muted-foreground">{v.report}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No visits recorded yet.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


