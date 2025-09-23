"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Activity,
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  TrendingUp,
  Mic,
  Loader2,
  RefreshCw,
  User,
  Mail,
  Calendar,
  Pill,
} from "lucide-react"
import { HealthChart } from "@/components/dashboard/health-chart"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { FloatingAssistant } from "@/components/dashboard/floating-assistant"
import { useAuth } from "@/components/auth/auth-provider"
import { formatDate, safeTruncate } from "@/lib/date-utils"

// Patient interface based on the exact schema structure
interface Patient {
  id: string
  pid: string
  pname: string
  pemail: string
  ppassword: string
  doctor: {
    did: string
    dname: string
    demail: string
    dpassword: string
  }
  visits: Array<{
    visit_date: string
    condition: string
    disease: string
    vital: {
      bp: string
      hr: string
      spo2: string
    }
    symptoms: Array<{
      name: string
      pain_level: string
      notes: string
    }>
    medications: Array<{
      medication: string
      dosage: string
      duration: string
      route: string
      notes: string
    }>
    report: string
  }>
  symptomLogs: Array<{
    symptoms: Array<{
      symptomName: string
      intensity: string
      notes: string
    }>
    timestamp: string
    returnVisit: string
    visitDate: string
  }>
  // Additional display fields for UI
  condition: string
  status: string
  lastContact: string
  riskLevel: string
  vitals: {
    heartRate: number
    bloodPressure: string
    spo2: number
  }
  medications: string[]
  symptoms: string[]
  notes: string
  visitCount: number
  lastVisitDate: string | null
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "Chat", href: "/chat" },
  { name: "Symptom Check", href: "/symptom-check" },
  { name: "Progress", href: "/progress" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
]

export function PatientDashboard() {
  const { user } = useAuth()
  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch patient data from backend
  const fetchPatientData = async () => {
    if (!user || user.role !== "patient") {
      setError("Only patients can access this dashboard")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/patients/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch patient data')
      }

      if (result.success) {
        setPatientData(result.patient)
      } else {
        throw new Error(result.error || 'Failed to fetch patient data')
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching patient data')
      console.error('Fetch patient data error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load patient data on component mount
  useEffect(() => {
    fetchPatientData()
  }, [user])

  // Calculate dashboard metrics
  const getLatestVitals = () => {
    if (!patientData || !patientData.visits || patientData.visits.length === 0) {
      return { heartRate: 0, bloodPressure: "0/0", spo2: 0 }
    }
    const latestVisit = patientData.visits[patientData.visits.length - 1]
    return {
      heartRate: parseInt(latestVisit.vital.hr) || 0,
      bloodPressure: latestVisit.vital.bp || "0/0",
      spo2: parseInt(latestVisit.vital.spo2) || 0
    }
  }

  const getCurrentMedications = () => {
    if (!patientData || !patientData.visits || patientData.visits.length === 0) {
      return []
    }
    const latestVisit = patientData.visits[patientData.visits.length - 1]
    return latestVisit.medications || []
  }

  const getNextAppointment = () => {
    if (!patientData || !patientData.symptomLogs || patientData.symptomLogs.length === 0) {
      return null
    }
    const upcomingVisits = patientData.symptomLogs
      .filter(log => log.returnVisit && new Date(log.returnVisit) > new Date())
      .sort((a, b) => new Date(a.returnVisit).getTime() - new Date(b.returnVisit).getTime())
    
    return upcomingVisits.length > 0 ? upcomingVisits[0] : null
  }

  const getRecoveryProgress = () => {
    if (!patientData || !patientData.visits || patientData.visits.length === 0) {
      return { overall: 0, pain: 0, mobility: 0, healing: 0 }
    }
    
    const totalVisits = patientData.visits.length
    const recentVisits = patientData.visits.slice(-3)
    
    // Calculate progress based on visit frequency and symptom improvement
    let painProgress = 0
    let mobilityProgress = 0
    let healingProgress = 0
    
    if (recentVisits.length > 0) {
      const latestVisit = recentVisits[recentVisits.length - 1]
      const symptoms = latestVisit.symptoms || []
      
      // Pain management progress (inverse of pain level)
      const avgPainLevel = symptoms.length > 0 
        ? symptoms.reduce((sum, s) => sum + parseInt(s.pain_level), 0) / symptoms.length
        : 0
      painProgress = Math.max(0, 100 - (avgPainLevel * 10))
      
      // Mobility progress (based on condition improvement)
      if (latestVisit.condition.toLowerCase().includes('improved') || 
          latestVisit.condition.toLowerCase().includes('stable')) {
        mobilityProgress = 75
      } else if (latestVisit.condition.toLowerCase().includes('recovery')) {
        mobilityProgress = 85
      } else {
        mobilityProgress = 50
      }
      
      // Healing progress (based on visit frequency and reports)
      healingProgress = Math.min(100, (totalVisits * 20) + 30)
    }
    
    const overall = Math.round((painProgress + mobilityProgress + healingProgress) / 3)
    
    return {
      overall,
      pain: Math.round(painProgress),
      mobility: Math.round(mobilityProgress),
      healing: Math.round(healingProgress)
    }
  }

  const latestVitals = getLatestVitals()
  const currentMedications = getCurrentMedications()
  const nextAppointment = getNextAppointment()
  const recoveryProgress = getRecoveryProgress()

  if (!user || user.role !== "patient") {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Only patients can access this dashboard.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute -top-24 left-0 h-72 w-72 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
      </div>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-down">
            Welcome back, {patientData?.pname || user?.name || 'there'}!
          </h1>
          <p className="text-muted-foreground/90">
            {patientData?.pid ? `Patient ID: ${patientData.pid}` : 'Here\'s your health overview for today'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchPatientData} disabled={loading} className="bg-blue-900 hover:bg-blue-900/65">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button asChild className="animate-pulse-glow bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:opacity-90">
            <Link href="/chat">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat with AI
            </Link>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Alert Cards with real data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-transparent bg-gradient-to-br from-rose-500/10 to-transparent dark:from-rose-500/15 glass-dark animate-slide-down shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Current Medications</CardTitle>
            <Pill className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {loading ? "..." : currentMedications.length}
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              {loading ? "Loading..." : "Active medications"}
            </p>
            {currentMedications.length > 0 && (
              <div className="mt-2 text-xs text-red-600">
                {currentMedications[0]?.medication} {currentMedications[0]?.dosage}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-transparent bg-gradient-to-br from-green-500/10 to-transparent dark:from-green-500/15 glass-dark shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Recovery Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {loading ? "..." : `${recoveryProgress.overall}%`}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {loading ? "Loading..." : "Overall recovery progress"}
            </p>
            <div className="mt-2">
              <Progress value={recoveryProgress.overall} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-500/15 glass-dark shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {loading ? "..." : nextAppointment ? "Scheduled" : "None"}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {loading ? "Loading..." : 
                nextAppointment 
                  ? `Return visit: ${formatDate(nextAppointment.returnVisit)}`
                  : "No upcoming appointments"
              }
            </p>
            {nextAppointment && (
              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                View Details
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <AIInsightsCard />

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Enhanced Vital Signs with real data */}
        <Card className="glass glass-dark animate-fade-in-up lg:col-span-2 border-transparent">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Vital Signs</span>
            </CardTitle>
            <CardDescription>
              {loading ? "Loading..." : "Latest readings from your most recent visit"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="font-semibold">
                  {loading ? "..." : `${latestVitals.heartRate} BPM`}
                </div>
                <div className="text-xs text-muted-foreground">Heart Rate</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Activity className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <div className="font-semibold">
                  {loading ? "..." : latestVitals.bloodPressure}
                </div>
                <div className="text-xs text-muted-foreground">Blood Pressure</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Activity className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <div className="font-semibold">
                  {loading ? "..." : `${latestVitals.spo2}%`}
                </div>
                <div className="text-xs text-muted-foreground">SpO2</div>
              </div>
            </div>
            {patientData && patientData.visits && patientData.visits.length > 0 && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Latest Visit: {patientData.visits[patientData.visits.length - 1].visit_date}</p>
                <p className="text-xs text-muted-foreground">
                  Condition: {patientData.visits[patientData.visits.length - 1].condition}
                </p>
                <p className="text-xs text-muted-foreground">
                  Disease: {patientData.visits[patientData.visits.length - 1].disease}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="animate-fade-in-up glass-dark border-transparent" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white">
              <Link href="/chat">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start AI Chat
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/symptom-check">
                <Activity className="mr-2 h-4 w-4" />
                Log Symptoms
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/progress">
                <Heart className="mr-2 h-4 w-4" />
                View Progress
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/reports">
                <Clock className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/chat">
                <Mic className="mr-2 h-4 w-4" />
                Voice Assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Progress with real data */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in-up glass-dark border-transparent" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Recovery Milestones</span>
            </CardTitle>
            <CardDescription>Your healing journey progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pain Management</span>
                    <span className="text-sm text-muted-foreground">
                      {loading ? "..." : `${recoveryProgress.pain}%`}
                    </span>
                  </div>
                  <Progress value={recoveryProgress.pain} className="h-2 mt-1" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mobility</span>
                    <span className="text-sm text-muted-foreground">
                      {loading ? "..." : `${recoveryProgress.mobility}%`}
                    </span>
                  </div>
                  <Progress value={recoveryProgress.mobility} className="h-2 mt-1" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Healing Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {loading ? "..." : `${recoveryProgress.healing}%`}
                    </span>
                  </div>
                  <Progress value={recoveryProgress.healing} className="h-2 mt-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity with real data */}
        <Card className="glass-dark border-transparent">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest health interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading activity...</span>
              </div>
            ) : patientData && patientData.visits && patientData.visits.length > 0 ? (
              <div className="space-y-4">
                {patientData.visits.slice(-3).reverse().map((visit, index) => (
                  <div key={index} className="flex items-center space-x-4 p-2 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Visit: {visit.condition}</p>
                      <p className="text-xs text-muted-foreground">
                        {visit.visit_date} • {visit.disease}
                      </p>
                      {visit.report && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {safeTruncate(visit.report, 50)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {patientData.symptomLogs && patientData.symptomLogs.length > 0 && (
                  <div className="flex items-center space-x-4 p-2 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Symptom Log Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {patientData.symptomLogs[patientData.symptomLogs.length - 1].timestamp}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No recent activity</p>
                <p className="text-xs">Start by logging your symptoms or chatting with AI</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FloatingAssistant />
    </div>
  )
}
