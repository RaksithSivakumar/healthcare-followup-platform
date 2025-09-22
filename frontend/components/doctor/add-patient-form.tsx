"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Trash2, Save, UserPlus } from "lucide-react"

interface Vital {
  bp: string
  hr: number
  spo2: number
  temperature?: number
  weight?: number
  height?: number
  [key: string]: any
}

interface Symptom {
  name: string
  pain_level: number
  notes: string
}

interface Medication {
  medication: string
  dosage: string
  duration: string
  route: string
  notes: string
}

interface Visit {
  visit_date: string
  condition: string
  disease: string
  vital: Vital
  symptoms: Symptom[]
  medications: Medication[]
  report: boolean
}

interface Patient {
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
  visits: Visit[]
}

export function AddPatientForm({ onPatientAdded, onCancel }: { onPatientAdded?: (patient: Patient) => void; onCancel?: () => void }) {
  const { user } = useAuth()
  
  const generatePID = () => `P${String(Date.now()).slice(-6)}`
  
  const [formData, setFormData] = useState<Omit<Patient, 'pid' | 'doctor'>>({
    pname: "",
    pemail: "",
    ppassword: "",
    visits: [{
      visit_date: new Date().toISOString().split('T')[0],
      condition: "",
      disease: "",
      vital: { bp: "", hr: 0, spo2: 0 },
      symptoms: [],
      medications: [],
      report: false
    }]
  })

  const [customVitals, setCustomVitals] = useState<{ name: string; value: string; unit: string }[]>([])

  const addSymptom = (visitIndex: number) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].symptoms.push({ name: "", pain_level: 1, notes: "" })
    setFormData({ ...formData, visits: updatedVisits })
  }

  const removeSymptom = (visitIndex: number, symptomIndex: number) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].symptoms.splice(symptomIndex, 1)
    setFormData({ ...formData, visits: updatedVisits })
  }

  const addMedication = (visitIndex: number) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].medications.push({ medication: "", dosage: "", duration: "", route: "", notes: "" })
    setFormData({ ...formData, visits: updatedVisits })
  }

  const removeMedication = (visitIndex: number, medicationIndex: number) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].medications.splice(medicationIndex, 1)
    setFormData({ ...formData, visits: updatedVisits })
  }

  const updateVisit = (visitIndex: number, field: keyof Visit, value: any) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex] = { ...updatedVisits[visitIndex], [field]: value }
    setFormData({ ...formData, visits: updatedVisits })
  }

  const updateVital = (visitIndex: number, field: string, value: any) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].vital = { ...updatedVisits[visitIndex].vital, [field]: value }
    setFormData({ ...formData, visits: updatedVisits })
  }

  const updateSymptom = (visitIndex: number, symptomIndex: number, field: keyof Symptom, value: any) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].symptoms[symptomIndex] = {
      ...updatedVisits[visitIndex].symptoms[symptomIndex],
      [field]: value
    }
    setFormData({ ...formData, visits: updatedVisits })
  }

  const updateMedication = (visitIndex: number, medicationIndex: number, field: keyof Medication, value: any) => {
    const updatedVisits = [...formData.visits]
    updatedVisits[visitIndex].medications[medicationIndex] = {
      ...updatedVisits[visitIndex].medications[medicationIndex],
      [field]: value
    }
    setFormData({ ...formData, visits: updatedVisits })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || user.role !== "doctor") {
      alert("Only doctors can add patients")
      return
    }

    const finalVital = { ...formData.visits[0].vital }
    customVitals.forEach(vital => {
      finalVital[vital.name] = vital.value + (vital.unit ? ` ${vital.unit}` : '')
    })

    const newPatient: Patient = {
      pid: generatePID(),
      pname: formData.pname,
      pemail: formData.pemail,
      ppassword: formData.ppassword,
      doctor: {
        did: user.doctorId || "D001",
        dname: user.name,
        demail: user.email,
        dpassword: "hashed_password"
      },
      visits: [{
        ...formData.visits[0],
        vital: finalVital
      }]
    }

    console.log("New Patient Data:", newPatient)
    alert("Patient added successfully!")
    
    if (onPatientAdded) {
      onPatientAdded(newPatient)
    }
  }

  if (!user || user.role !== "doctor") {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Only doctors can access this form.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Patient
        </CardTitle>
        <CardDescription>
          Enter patient details and initial visit information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pname">Patient Name *</Label>
                <Input
                  id="pname"
                  value={formData.pname}
                  onChange={(e) => setFormData({ ...formData, pname: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pemail">Email *</Label>
                <Input
                  id="pemail"
                  type="email"
                  value={formData.pemail}
                  onChange={(e) => setFormData({ ...formData, pemail: e.target.value })}
                  placeholder="patient@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ppassword">Password *</Label>
                <Input
                  id="ppassword"
                  type="password"
                  value={formData.ppassword}
                  onChange={(e) => setFormData({ ...formData, ppassword: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Visit Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visit_date">Visit Date *</Label>
                <Input
                  id="visit_date"
                  type="date"
                  value={formData.visits[0].visit_date}
                  onChange={(e) => updateVisit(0, "visit_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Input
                  id="condition"
                  value={formData.visits[0].condition}
                  onChange={(e) => updateVisit(0, "condition", e.target.value)}
                  placeholder="e.g., Chronic Headache"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease">Disease *</Label>
                <Input
                  id="disease"
                  value={formData.visits[0].disease}
                  onChange={(e) => updateVisit(0, "disease", e.target.value)}
                  placeholder="e.g., Migraine"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vital Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp">Blood Pressure *</Label>
                <Input
                  id="bp"
                  value={formData.visits[0].vital.bp}
                  onChange={(e) => updateVital(0, "bp", e.target.value)}
                  placeholder="120/80"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hr">Heart Rate (BPM) *</Label>
                <Input
                  id="hr"
                  type="number"
                  value={formData.visits[0].vital.hr}
                  onChange={(e) => updateVital(0, "hr", parseInt(e.target.value))}
                  placeholder="78"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spo2">SpO2 (%) *</Label>
                <Input
                  id="spo2"
                  type="number"
                  value={formData.visits[0].vital.spo2}
                  onChange={(e) => updateVital(0, "spo2", parseInt(e.target.value))}
                  placeholder="98"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            {/* Additional Standard Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.visits[0].vital.temperature || ""}
                  onChange={(e) => updateVital(0, "temperature", parseFloat(e.target.value))}
                  placeholder="98.6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.visits[0].vital.weight || ""}
                  onChange={(e) => updateVital(0, "weight", parseFloat(e.target.value))}
                  placeholder="70.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.visits[0].vital.height || ""}
                  onChange={(e) => updateVital(0, "height", parseFloat(e.target.value))}
                  placeholder="170.0"
                />
              </div>
            </div>

            {/* Custom Vitals */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Custom Vitals</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomVitals([...customVitals, { name: "", value: "", unit: "" }])}
                  className="h-8"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Vital
                </Button>
              </div>
              
              {customVitals.map((vital, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Input
                    placeholder="Vital name"
                    value={vital.name}
                    onChange={(e) => {
                      const updated = [...customVitals]
                      updated[index].name = e.target.value
                      setCustomVitals(updated)
                    }}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={vital.value}
                    onChange={(e) => {
                      const updated = [...customVitals]
                      updated[index].value = e.target.value
                      setCustomVitals(updated)
                    }}
                    className="w-24"
                  />
                  <Input
                    placeholder="Unit"
                    value={vital.unit}
                    onChange={(e) => {
                      const updated = [...customVitals]
                      updated[index].unit = e.target.value
                      setCustomVitals(updated)
                    }}
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCustomVitals(customVitals.filter((_, i) => i !== index))}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Symptoms */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Symptoms</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSymptom(0)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Symptom
              </Button>
            </div>
            
            {formData.visits[0].symptoms.map((symptom, symptomIndex) => (
              <div key={symptomIndex} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Symptom {symptomIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSymptom(0, symptomIndex)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Symptom Name</Label>
                    <Input
                      value={symptom.name}
                      onChange={(e) => updateSymptom(0, symptomIndex, "name", e.target.value)}
                      placeholder="e.g., Headache"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pain Level (1-10)</Label>
                    <Select
                      value={symptom.pain_level.toString()}
                      onValueChange={(value) => updateSymptom(0, symptomIndex, "pain_level", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                          <SelectItem key={level} value={level.toString()}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={symptom.notes}
                      onChange={(e) => updateSymptom(0, symptomIndex, "notes", e.target.value)}
                      placeholder="Additional details about the symptom"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medications</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addMedication(0)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
            
            {formData.visits[0].medications.map((medication, medicationIndex) => (
              <div key={medicationIndex} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Medication {medicationIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(0, medicationIndex)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Medication Name</Label>
                    <Input
                      value={medication.medication}
                      onChange={(e) => updateMedication(0, medicationIndex, "medication", e.target.value)}
                      placeholder="e.g., Paracetamol"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dosage</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(0, medicationIndex, "dosage", e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(0, medicationIndex, "duration", e.target.value)}
                      placeholder="e.g., 5 days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select
                      value={medication.route}
                      onValueChange={(value) => updateMedication(0, medicationIndex, "route", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oral">Oral</SelectItem>
                        <SelectItem value="Topical">Topical</SelectItem>
                        <SelectItem value="Intravenous">Intravenous</SelectItem>
                        <SelectItem value="Intramuscular">Intramuscular</SelectItem>
                        <SelectItem value="Subcutaneous">Subcutaneous</SelectItem>
                        <SelectItem value="Inhalation">Inhalation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={medication.notes}
                      onChange={(e) => updateMedication(0, medicationIndex, "notes", e.target.value)}
                      placeholder="Special instructions or notes"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Report Generation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report Generation</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="report"
                checked={formData.visits[0].report}
                onChange={(e) => updateVisit(0, "report", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="report">Generate detailed report for this visit</Label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
