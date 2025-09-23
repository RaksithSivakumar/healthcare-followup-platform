"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Bell,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  MessageSquare,
  Clock,
  Loader2,
  RefreshCw,
  User,
  Mail,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { PatientRecordsDialog } from "@/components/doctor/patient-records-dialog"

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

export function DoctorDashboard() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [openPid, setOpenPid] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch patients from backend
  const fetchPatients = async () => {
    if (!user || user.role !== "doctor") {
      setError("Only doctors can access patient data")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/patients/doctor-patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch patients')
      }

      if (result.success) {
        setPatients(result.patients)
      } else {
        throw new Error(result.error || 'Failed to fetch patients')
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching patients')
      console.error('Fetch patients error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load patients on component mount
  useEffect(() => {
    fetchPatients()
  }, [user])

  const filteredPatients = patients.filter((patient) =>
    patient.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pid.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate dashboard stats
  const totalPatients = patients.length
  const criticalPatients = patients.filter(p => p.riskLevel === "high").length
  const stablePatients = patients.filter(p => p.status === "stable").length
  const recoveryRate = totalPatients > 0 ? Math.round((stablePatients / totalPatients) * 100) : 0

  // Enhanced Critical Alerts System based on schema analysis
  const getCriticalAlerts = () => {
    const alerts: Array<{
      patient: Patient
      type: 'vital' | 'symptom' | 'medication' | 'visit' | 'symptom_log'
      severity: 'critical' | 'high' | 'medium'
      message: string
      value?: string
      timestamp: string
    }> = []

    patients.forEach(patient => {
      // Check latest visit vitals for critical values
      if (patient.visits && patient.visits.length > 0) {
        const latestVisit = patient.visits[patient.visits.length - 1]
        const vitals = latestVisit.vital

        // Blood Pressure Critical Alerts
        if (vitals.bp) {
          const bpValues = vitals.bp.split('/').map(v => parseInt(v))
          if (bpValues.length === 2) {
            const systolic = bpValues[0]
            const diastolic = bpValues[1]
            
            if (systolic >= 180 || diastolic >= 110) {
              alerts.push({
                patient,
                type: 'vital',
                severity: 'critical',
                message: 'Severe Hypertension',
                value: `${systolic}/${diastolic}`,
                timestamp: latestVisit.visit_date
              })
            } else if (systolic >= 160 || diastolic >= 100) {
              alerts.push({
                patient,
                type: 'vital',
                severity: 'high',
                message: 'High Blood Pressure',
                value: `${systolic}/${diastolic}`,
                timestamp: latestVisit.visit_date
              })
            } else if (systolic <= 90 || diastolic <= 60) {
              alerts.push({
                patient,
                type: 'vital',
                severity: 'critical',
                message: 'Low Blood Pressure',
                value: `${systolic}/${diastolic}`,
                timestamp: latestVisit.visit_date
              })
            }
          }
        }

        // Heart Rate Critical Alerts
        if (vitals.hr) {
          const hr = parseInt(vitals.hr)
          if (hr >= 120) {
            alerts.push({
              patient,
              type: 'vital',
              severity: 'critical',
              message: 'Tachycardia',
              value: `${hr} BPM`,
              timestamp: latestVisit.visit_date
            })
          } else if (hr <= 50) {
            alerts.push({
              patient,
              type: 'vital',
              severity: 'critical',
              message: 'Bradycardia',
              value: `${hr} BPM`,
              timestamp: latestVisit.visit_date
            })
          } else if (hr >= 100) {
            alerts.push({
              patient,
              type: 'vital',
              severity: 'high',
              message: 'Elevated Heart Rate',
              value: `${hr} BPM`,
              timestamp: latestVisit.visit_date
            })
          }
        }

        // SpO2 Critical Alerts
        if (vitals.spo2) {
          const spo2 = parseInt(vitals.spo2)
          if (spo2 <= 90) {
            alerts.push({
              patient,
              type: 'vital',
              severity: 'critical',
              message: 'Low Oxygen Saturation',
              value: `${spo2}%`,
              timestamp: latestVisit.visit_date
            })
          } else if (spo2 <= 95) {
            alerts.push({
              patient,
              type: 'vital',
              severity: 'high',
              message: 'Reduced Oxygen Saturation',
              value: `${spo2}%`,
              timestamp: latestVisit.visit_date
            })
          }
        }

        // Critical Symptoms Analysis
        if (latestVisit.symptoms && latestVisit.symptoms.length > 0) {
          latestVisit.symptoms.forEach(symptom => {
            const painLevel = parseInt(symptom.pain_level)
            const symptomName = symptom.name.toLowerCase()
            
            // High pain level alerts
            if (painLevel >= 8) {
              alerts.push({
                patient,
                type: 'symptom',
                severity: 'critical',
                message: `Severe Pain: ${symptom.name}`,
                value: `Pain Level: ${painLevel}/10`,
                timestamp: latestVisit.visit_date
              })
            } else if (painLevel >= 6) {
              alerts.push({
                patient,
                type: 'symptom',
                severity: 'high',
                message: `Moderate Pain: ${symptom.name}`,
                value: `Pain Level: ${painLevel}/10`,
                timestamp: latestVisit.visit_date
              })
            }

            // Critical symptom keywords
            const criticalSymptoms = [
              'chest pain', 'shortness of breath', 'dizziness', 'fainting',
              'severe headache', 'numbness', 'paralysis', 'seizure',
              'bleeding', 'swelling', 'infection', 'fever'
            ]
            
            if (criticalSymptoms.some(critical => symptomName.includes(critical))) {
              alerts.push({
                patient,
                type: 'symptom',
                severity: 'critical',
                message: `Critical Symptom: ${symptom.name}`,
                value: symptom.notes || 'Requires immediate attention',
                timestamp: latestVisit.visit_date
              })
            }
          })
        }

        // Medication Compliance Alerts
        if (latestVisit.medications && latestVisit.medications.length > 0) {
          const missedMedications = latestVisit.medications.filter(med => 
            med.notes && med.notes.toLowerCase().includes('missed') ||
            med.notes && med.notes.toLowerCase().includes('non-compliance')
          )
          
          if (missedMedications.length > 0) {
            alerts.push({
              patient,
              type: 'medication',
              severity: 'high',
              message: 'Medication Non-Compliance',
              value: `${missedMedications.length} medications missed`,
              timestamp: latestVisit.visit_date
            })
          }
        }
      }

      // Symptom Logs Analysis
      if (patient.symptomLogs && patient.symptomLogs.length > 0) {
        const recentLogs = patient.symptomLogs
          .filter(log => {
            const logDate = new Date(log.timestamp)
            const now = new Date()
            const daysDiff = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24)
            return daysDiff <= 7 // Last 7 days
          })

        recentLogs.forEach(log => {
          if (log.symptoms && log.symptoms.length > 0) {
            log.symptoms.forEach(symptom => {
              const intensity = parseInt(symptom.intensity)
              const symptomName = symptom.symptomName.toLowerCase()
              
              // High intensity symptoms
              if (intensity >= 8) {
                alerts.push({
                  patient,
                  type: 'symptom_log',
                  severity: 'critical',
                  message: `High Intensity Symptom: ${symptom.symptomName}`,
                  value: `Intensity: ${intensity}/10`,
                  timestamp: log.timestamp
                })
              }

              // Worsening symptoms
              const criticalSymptomKeywords = [
                'worsening', 'increasing', 'severe', 'acute', 'sudden',
                'unbearable', 'debilitating', 'constant'
              ]
              
              if (symptom.notes && criticalSymptomKeywords.some(keyword => 
                symptom.notes.toLowerCase().includes(keyword)
              )) {
                alerts.push({
                  patient,
                  type: 'symptom_log',
                  severity: 'high',
                  message: `Worsening Symptom: ${symptom.symptomName}`,
                  value: symptom.notes,
                  timestamp: log.timestamp
                })
              }
            })
          }
        })
      }

      // Visit Pattern Analysis
      if (patient.visits && patient.visits.length >= 2) {
        const recentVisits = patient.visits.slice(-3) // Last 3 visits
        const visitDates = recentVisits.map(v => new Date(v.visit_date))
        
        // Frequent visits (more than 2 visits in 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const recentVisitCount = visitDates.filter(date => date > thirtyDaysAgo).length
        
        if (recentVisitCount >= 3) {
          alerts.push({
            patient,
            type: 'visit',
            severity: 'high',
            message: 'Frequent Visits',
            value: `${recentVisitCount} visits in 30 days`,
            timestamp: recentVisits[recentVisits.length - 1].visit_date
          })
        }
      }
    })

    // Sort alerts by severity and timestamp (most recent first)
    return alerts.sort((a, b) => {
      const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1 }
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      
      if (severityDiff !== 0) return severityDiff
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }

  // Get priority alerts (high risk patients)
  const criticalAlerts = getCriticalAlerts()
  const priorityAlerts = criticalAlerts.slice(0, 5) // Show top 5 alerts

  if (!user || user.role !== "doctor") {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Only doctors can access the dashboard.</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6 relative">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute -top-20 right-0 h-72 w-72 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
      </div>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-down">
            Good morning, {user?.name || 'Doctor'}!
          </h1>
          <p className="text-muted-foreground/90">
            You have <span className="font-semibold text-destructive">{criticalPatients}</span> critical alerts and <span className="font-semibold">{totalPatients}</span> patients to review today
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchPatients} disabled={loading} className="bg-blue-900 hover:bg-blue-900/65">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:opacity-90">
            <a href="./doctor/add-patient">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
            </a>
          </Button>
          {/* <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button> */}
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

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-transparent bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/15 glass-dark shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {loading ? "..." : totalPatients}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {loading ? "Loading..." : "Active patients"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-gradient-to-br from-red-500/10 to-transparent dark:from-red-500/15 glass-dark shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {loading ? "..." : criticalPatients}
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              {loading ? "Loading..." : "Requires immediate attention"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-gradient-to-br from-green-500/10 to-transparent dark:from-green-500/15 glass-dark shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {loading ? "..." : `${recoveryRate}%`}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {loading ? "Loading..." : "Stable patients"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-gradient-to-br from-purple-500/10 to-transparent dark:from-purple-500/15 glass-dark shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {loading ? "..." : Math.min(patients.length, 8)}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {loading ? "Loading..." : "Patients to review"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Management Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient List */}
        <Card className="lg:col-span-2 glass-dark border-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Patient Overview</CardTitle>
                <CardDescription className="text-muted-foreground/80">Monitor your patients' health status and alerts</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Input 
                placeholder="Search patients..." 
                className="max-w-sm focus-visible:ring-2 focus-visible:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading patients...</span>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {patients.length === 0 ? "No patients found." : "No patients match your search."}
              </div>
            ) : (
            <div className="space-y-4">
                {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md hover:ring-1 hover:ring-primary/30 ${
                      patient.riskLevel === "high"
                      ? "border-red-200 bg-gradient-to-r from-red-500/10 to-transparent dark:border-red-800 dark:from-red-500/15 dark:to-transparent"
                        : patient.riskLevel === "medium"
                        ? "border-yellow-200 bg-gradient-to-r from-yellow-500/10 to-transparent dark:border-yellow-800 dark:from-yellow-500/15 dark:to-transparent"
                        : "border-green-200 bg-gradient-to-r from-green-500/10 to-transparent dark:border-green-800 dark:from-green-500/15 dark:to-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                          <AvatarImage src="/patient-avatar.png" alt={patient.pname} />
                        <AvatarFallback>
                            <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold tracking-tight">{patient.pname}</h3>
                          <Badge
                            variant={
                              patient.riskLevel === "high"
                                ? "destructive"
                                : patient.riskLevel === "medium"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {patient.riskLevel} risk
                          </Badge>
                            {patient.riskLevel === "high" && (
                            <Badge variant="destructive" className="animate-pulse">
                                Critical
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {patient.pid} • {patient.condition}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Mail className="inline h-3 w-3 mr-1" />
                            {patient.pemail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Visits: {patient.visitCount} • Last contact: {patient.lastContact}
                          </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{patient.vitals.heartRate} BPM</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{patient.vitals.bloodPressure}</div>
                          <div className="text-xs text-muted-foreground">SpO2: {patient.vitals.spo2}%</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setOpenPid(patient.pid)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Records
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                              Contact Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Appointment
                          </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          <Card className="glass-dark border-transparent">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-red-500" />
                <span>Priority Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Loading alerts...</span>
                </div>
              ) : priorityAlerts.length > 0 ? (
                priorityAlerts.map((alert) => (
                  <div key={alert.patient.id + alert.timestamp} className="p-3 rounded-lg border-red-200 bg-gradient-to-r from-red-500/10 to-transparent dark:border-red-800 dark:from-red-500/15 dark:to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                        <p className="font-medium text-red-900 dark:text-red-100">{alert.patient.pname}</p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {alert.patient.pid} • {alert.patient.condition}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          {alert.message}: {alert.value || 'Requires immediate attention'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Alert Type: {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </p>
                  </div>
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:opacity-90" onClick={() => setOpenPid(alert.patient.pid)}>
                        Review
                      </Button>
                </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No critical alerts</p>
                  <p className="text-xs">All patients are stable</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-dark border-transparent">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Loading activity...</span>
                </div>
              ) : patients.length > 0 ? (
                patients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                    <Clock className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                      <p className="text-sm font-medium">{patient.pname}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.condition} • Last: {patient.lastContact}
                      </p>
                </div>
              </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-dark border-transparent">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
                <a href="./doctor/add-patient">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Patient
                </a>
            </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/doctor/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Bot
                </Link>
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/doctor/reports">
                  <Activity className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <PatientRecordsDialog open={!!openPid} pid={openPid} onOpenChange={(v) => !v && setOpenPid(null)} />
      </div>
    </div>
  )
}
