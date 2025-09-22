"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Upload,
  Download,
  Edit,
  Save,
  Loader2,
  RefreshCw,
  User,
  Mail,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

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

export function PatientRecords() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch patients from backend
  const fetchPatients = async () => {
    if (!user || user.role !== "doctor") {
      setError("Only doctors can access patient records")
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
        // Set first patient as selected if available
        if (result.patients.length > 0 && !selectedPatient) {
          setSelectedPatient(result.patients[0])
        }
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

  // Transform visits data for charts
  const getVitalsHistory = (patient: Patient) => {
    return patient.visits.map(visit => ({
      date: visit.visit_date,
      heartRate: parseInt(visit.vital.hr) || 0,
      bloodPressure: parseInt(visit.vital.bp?.split('/')[0]) || 0,
      spo2: parseInt(visit.vital.spo2) || 0
    })).reverse()
  }

  if (!user || user.role !== "doctor") {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Only doctors can access patient records.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Records</h1>
          <p className="text-muted-foreground">Comprehensive patient medical records and history</p>
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
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

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Patient List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
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
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src="/patient-avatar.png" alt={patient.pname} />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{patient.pname}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.pid} • {patient.condition}
                          </p>
                        <p className="text-xs text-muted-foreground">
                            Visits: {patient.visitCount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Patient Records Detail */}
        <div className="lg:col-span-3">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/patient-avatar.png" alt={selectedPatient.pname} />
                      <AvatarFallback className="text-lg">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPatient.pname}</h2>
                      <p className="text-muted-foreground">
                        {selectedPatient.pid}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <Mail className="inline h-3 w-3 mr-1" />
                        {selectedPatient.pemail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Condition: {selectedPatient.condition} • Status: {selectedPatient.status}
                      </p>
                    </div>
                  </div>
                  <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Patient
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="vitals">Vitals</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="visits">Visit Notes</TabsTrigger>
                    <TabsTrigger value="symptoms">Symptom Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Activity className="h-5 w-5" />
                            <span>Current Status</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Visit:</span>
                            <span>{selectedPatient.lastContact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Visits:</span>
                            <span>{selectedPatient.visitCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Current Medications:</span>
                            <span>{selectedPatient.medications.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Risk Level:</span>
                            <Badge variant={
                              selectedPatient.riskLevel === "high" ? "destructive" :
                              selectedPatient.riskLevel === "medium" ? "secondary" : "default"
                            }>
                              {selectedPatient.riskLevel}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span>Latest Vitals</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Heart Rate:</span>
                            <span>{selectedPatient.vitals.heartRate} BPM</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Blood Pressure:</span>
                            <span>{selectedPatient.vitals.bloodPressure}</span>
                              </div>
                              <div className="flex justify-between">
                            <span className="text-muted-foreground">SpO2:</span>
                            <span>{selectedPatient.vitals.spo2}%</span>
                              </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Medical History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedPatient.visits.length > 0 ? (
                            selectedPatient.visits.slice(-5).reverse().map((visit, index) => (
                            <div key={index} className="border-l-2 border-primary/20 pl-4">
                              <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{visit.disease}</h4>
                                  <span className="text-sm text-muted-foreground">{visit.visit_date}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">Condition: {visit.condition}</p>
                                {visit.report && (
                                  <p className="text-sm">{visit.report}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  Treated by: {selectedPatient.doctor.dname}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No visit history available.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="vitals" className="space-y-6">
                    {selectedPatient.visits.length > 0 ? (
                      <>
                    <div className="grid gap-6 md:grid-cols-3">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Heart Rate Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={getVitalsHistory(selectedPatient)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                              <Line type="monotone" dataKey="heartRate" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Blood Pressure</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={getVitalsHistory(selectedPatient)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                              <Bar dataKey="bloodPressure" fill="hsl(var(--chart-2))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                              <CardTitle className="text-lg">SpO2 Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={getVitalsHistory(selectedPatient)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                                  <YAxis domain={[90, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                                  <Line type="monotone" dataKey="spo2" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Vitals History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                              {selectedPatient.visits.map((visit, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center space-x-4">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{visit.visit_date}</span>
                              </div>
                              <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                      <span>{visit.vital.hr} BPM</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Activity className="h-3 w-3 text-blue-500" />
                                      <span>{visit.vital.bp}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                      <Thermometer className="h-3 w-3 text-green-500" />
                                      <span>SpO2: {visit.vital.spo2}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                      </>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">No vitals data available for this patient.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="medications" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Current Medications</h3>
                      <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Medication
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Medication</DialogTitle>
                            <DialogDescription>Enter medication details for the patient</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="medication-name">Medication Name</Label>
                              <Input id="medication-name" placeholder="Enter medication name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input id="dosage" placeholder="e.g., 10mg" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="once">Once daily</SelectItem>
                                    <SelectItem value="twice">Twice daily</SelectItem>
                                    <SelectItem value="three">Three times daily</SelectItem>
                                    <SelectItem value="four">Four times daily</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="instructions">Instructions</Label>
                              <Textarea id="instructions" placeholder="Special instructions for the patient" />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddMedicationOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsAddMedicationOpen(false)}>Add Medication</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid gap-4">
                      {selectedPatient.medications.length > 0 ? (
                        selectedPatient.medications.map((medication, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <Pill className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{medication}</h4>
                                    <p className="text-sm text-muted-foreground">Current medication</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <Badge variant="default">Active</Badge>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">No medications recorded for this patient.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="visits" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Visit Notes</h3>
                      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Visit Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Visit Note</DialogTitle>
                            <DialogDescription>Record details from the patient visit</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="visit-type">Visit Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select visit type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="routine">Routine Check-up</SelectItem>
                                    <SelectItem value="followup">Follow-up</SelectItem>
                                    <SelectItem value="emergency">Emergency</SelectItem>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="visit-date">Visit Date</Label>
                                <Input id="visit-date" type="date" />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="heart-rate">Heart Rate (BPM)</Label>
                                <Input id="heart-rate" type="number" placeholder="72" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="blood-pressure">Blood Pressure</Label>
                                <Input id="blood-pressure" placeholder="120/80" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="spo2">SpO2 (%)</Label>
                                <Input id="spo2" type="number" placeholder="98" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="visit-notes">Visit Notes</Label>
                              <Textarea
                                id="visit-notes"
                                placeholder="Enter detailed notes about the visit, observations, and recommendations"
                                rows={6}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsAddNoteOpen(false)}>
                              <Save className="mr-2 h-4 w-4" />
                              Save Note
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-4">
                      {selectedPatient.visits.length > 0 ? (
                        selectedPatient.visits.map((visit, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{visit.condition}</Badge>
                                  <span className="font-semibold">{visit.visit_date}</span>
                                  <span className="text-sm text-muted-foreground">by {selectedPatient.doctor.dname}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="font-medium mb-2">Visit Notes</h4>
                                  <p className="text-sm">{visit.report || "No notes available"}</p>
                                  <div className="mt-3">
                                    <h5 className="font-medium text-sm mb-1">Disease:</h5>
                                    <p className="text-sm text-muted-foreground">{visit.disease}</p>
                                  </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Vitals Recorded</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Heart Rate:</span>
                                      <span>{visit.vital.hr} BPM</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Blood Pressure:</span>
                                      <span>{visit.vital.bp}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span>SpO2:</span>
                                      <span>{visit.vital.spo2}%</span>
                                    </div>
                                  </div>
                                  {visit.symptoms.length > 0 && (
                                    <div className="mt-3">
                                      <h5 className="font-medium text-sm mb-1">Symptoms:</h5>
                                      <div className="flex flex-wrap gap-1">
                                        {visit.symptoms.map((symptom, sIndex) => (
                                          <Badge key={sIndex} variant="secondary" className="text-xs">
                                            {symptom.name} (Level {symptom.pain_level})
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">No visit notes available for this patient.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="symptoms" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Symptom Logs</h3>
                    </div>

                    <div className="space-y-4">
                      {selectedPatient.symptomLogs && selectedPatient.symptomLogs.length > 0 ? (
                        selectedPatient.symptomLogs.map((log, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                                    <Activity className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Symptom Log - {log.timestamp}</h4>
                                    <p className="text-sm text-muted-foreground">Visit Date: {log.visitDate}</p>
                                    {log.returnVisit && (
                                      <p className="text-sm text-muted-foreground">Return Visit: {log.returnVisit}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {log.symptoms && log.symptoms.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-medium text-sm mb-2">Reported Symptoms:</h5>
                                  <div className="space-y-2">
                                    {log.symptoms.map((symptom, sIndex) => (
                                      <div key={sIndex} className="p-3 bg-muted/50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium text-sm">{symptom.symptomName}</p>
                                            <p className="text-xs text-muted-foreground">Intensity: {symptom.intensity}</p>
                                            {symptom.notes && (
                                              <p className="text-sm mt-1">{symptom.notes}</p>
                                            )}
                                          </div>
                                          <Badge variant="secondary">Level {symptom.intensity}</Badge>
                              </div>
                            </div>
                      ))}
                    </div>
                    </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">No symptom logs available for this patient.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {loading ? "Loading patient records..." : "Select a patient to view their records."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
