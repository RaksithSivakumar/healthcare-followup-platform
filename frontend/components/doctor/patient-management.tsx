"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  MessageSquare,
  Calendar,
  Heart,
  Activity,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  User,
  Mail,
  FileText,
} from "lucide-react"
import { AddPatientForm } from "./add-patients"

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

export function PatientManagement() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Fetch patients from backend
  const fetchPatients = async () => {
    if (!user || user.role !== "doctor") {
      setError("Only doctors can access patient management")
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

  // Handle new patient added
  const handlePatientAdded = (newPatient: any) => {
    setPatients(prev => [...prev, newPatient])
    setIsAddDialogOpen(false)
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.pid.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (!user || user.role !== "doctor") {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Only doctors can access patient management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-muted-foreground">Manage your patients and their health records</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchPatients} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <AddPatientForm onPatientAdded={handlePatientAdded} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
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

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                {loading ? "Loading patients..." : `${filteredPatients.length} of ${patients.length} patients`}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="attention">Attention</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, condition, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading patients...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {patients.length === 0 ? "No patients found. Add your first patient!" : "No patients match your search criteria."}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                    patient.status === "critical"
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                      : patient.status === "attention"
                        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20"
                        : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
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
                          <h3 className="font-semibold">{patient.pname}</h3>
                          <Badge variant="outline">{patient.pid}</Badge>
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
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {patient.condition}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Mail className="inline h-3 w-3 mr-1" />
                          {patient.pemail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last contact: {patient.lastContact} • Visits: {patient.visitCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{patient.vitals.heartRate} BPM</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{patient.vitals.bloodPressure}</div>
                        <div className="text-xs text-muted-foreground">SpO2: {patient.vitals.spo2}%</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Patient
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

      {/* Patient Details Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-lg">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src="/patient-avatar.png" alt={selectedPatient.pname} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{selectedPatient.pname}</p>
                  <div className="flex gap-2 mt-1 text-sm">
                    <Badge variant="outline">{selectedPatient.pid}</Badge>
                    <Badge
                      variant={
                        selectedPatient.riskLevel === "high"
                          ? "destructive"
                          : selectedPatient.riskLevel === "medium"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {selectedPatient.riskLevel} risk
                    </Badge>
                    <Badge
                      variant={
                        selectedPatient.status === "critical"
                          ? "destructive"
                          : selectedPatient.status === "attention"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {selectedPatient.status}
                    </Badge>
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription className="mt-1 text-muted-foreground">
                Patient details and recent medical history
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                <p className="text-xs text-muted-foreground flex items-center">
                  <Mail className="inline h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate max-w-[150px]">{selectedPatient.pemail}</span>
                </p>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span>{selectedPatient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Visits:</span>
                    <span>{selectedPatient.visitCount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-red-500" />
                    Current Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heart Rate:</span>
                    <Badge variant="secondary">{selectedPatient.vitals.heartRate} BPM</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Pressure:</span>
                    <Badge variant="secondary">{selectedPatient.vitals.bloodPressure}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SpO₂:</span>
                    <Badge variant="secondary">{selectedPatient.vitals.spo2}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medications */}
            {selectedPatient.medications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    💊 Current Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {selectedPatient.medications.map((med, idx) => (
                    <Badge key={idx} variant="outline" className="px-3 py-1 text-sm">
                      {med}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Symptoms */}
            {selectedPatient.symptoms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    🤒 Recent Symptoms
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {selectedPatient.symptoms.map((sym, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm">
                      {sym}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Visits */}
            {selectedPatient.visits?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">🗓️ Recent Visits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedPatient.visits.slice(-3).reverse().map((v, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-muted/50">
                      <div className="flex justify-between">
                        <p className="font-medium">{v.visit_date}</p>
                        <Badge variant="outline">{v.condition}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Disease: {v.disease}
                      </p>
                      {v.report && (
                        <p className="text-xs mt-1 italic">Report: {v.report}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Symptom Logs */}
            {selectedPatient.symptomLogs?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">📋 Symptom Logs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedPatient.symptomLogs.slice(-3).reverse().map((log, idx) => (
                    <div key={idx} className="p-3 rounded-lg border">
                      <div className="flex justify-between">
                        <p className="font-medium">{log.timestamp}</p>
                        {log.returnVisit && <Badge>Return: {log.returnVisit}</Badge>}
                      </div>
                      {log.symptoms?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {log.symptoms.map((s, si) => (
                            <Badge key={si} variant="secondary" className="text-xs">
                              {s.symptomName} (Lvl {s.intensity})
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">📝 Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{selectedPatient.notes}</p>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="sticky bottom-0 bg-background border-t mt-6 pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
