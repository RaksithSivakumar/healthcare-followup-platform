"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Save, AlertTriangle, Thermometer, Activity, Droplets, Wind, Brain, Loader2, Calendar, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

// Define a type for our symptoms for better code quality
type Symptom = {
  name: string
  icon: React.ElementType
  color: string
}

const initialSymptoms: Symptom[] = [
  { name: "Pain", icon: AlertTriangle, color: "text-red-400" },
  { name: "Swelling", icon: Wind, color: "text-orange-400" },
  { name: "Redness", icon: Thermometer, color: "text-rose-400" },
  { name: "Drainage", icon: Droplets, color: "text-blue-400" },
  { name: "Itching", icon: Activity, color: "text-yellow-400" },
  { name: "Numbness", icon: Brain, color: "text-gray-400" },
]

// State now holds both symptom name and its intensity
type LoggedSymptoms = {
  [key: string]: { intensity: number }
}

interface PatientData {
  patientName: string;
  todayLog: any;
  latestVisit: any;
  hasExistingData: boolean;
}

export function SymptomLogger() {
  const { user } = useAuth();
  const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>(initialSymptoms)
  const [loggedSymptoms, setLoggedSymptoms] = useState<LoggedSymptoms>({})
  const [notes, setNotes] = useState("")
  const [customSymptom, setCustomSymptom] = useState("")
  const [returnVisit, setReturnVisit] = useState(false)
  const [visitDate, setVisitDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [showExistingData, setShowExistingData] = useState(false)

  // Load existing data when component mounts
  useEffect(() => {
    if (user?.id) {
      loadExistingData();
    }
  }, [user?.id]);

  const loadExistingData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/symptoms');
      const data = await response.json();
      
      if (data.success) {
        setPatientData(data);
        
        // If there's existing data for today, show it
        if (data.hasExistingData && data.todayLog) {
          setShowExistingData(true);
          // Convert existing symptoms to current format
          const existingSymptoms: LoggedSymptoms = {};
          data.todayLog.symptoms.forEach((symptom: any) => {
            existingSymptoms[symptom.symptomName] = { intensity: symptom.intensity };
          });
          setLoggedSymptoms(existingSymptoms);
          setNotes(data.todayLog.notes || "");
          setReturnVisit(data.todayLog.returnVisit || false);
          setVisitDate(data.todayLog.visitDate || "");
        }
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomToggle = (symptomName: string, isEnabled: boolean) => {
    setLoggedSymptoms((prev) => {
      const newSymptoms = { ...prev }
      if (isEnabled) {
        // Add symptom with a default intensity of 1
        newSymptoms[symptomName] = { intensity: 1 }
      } else {
        // Remove symptom
        delete newSymptoms[symptomName]
      }
      return newSymptoms
    })
  }

  const handleIntensityChange = (symptomName: string, newIntensity: number[]) => {
    setLoggedSymptoms((prev) => ({
      ...prev,
      [symptomName]: { intensity: newIntensity[0] },
    }))
  }

  const addCustomSymptom = () => {
    if (customSymptom && !availableSymptoms.find((s) => s.name === customSymptom)) {
      const newSymptom: Symptom = { name: customSymptom, icon: Activity, color: "text-purple-400" }
      setAvailableSymptoms((prev) => [...prev, newSymptom])
      handleSymptomToggle(customSymptom, true) // Automatically enable the new symptom
      setCustomSymptom("")
    }
  }

  const handleSave = async () => {
    if (!user?.id) {
      alert("Please log in to save symptom logs");
      return;
    }

    setIsSaving(true);
    try {
      // Convert loggedSymptoms to array format for API
      const symptomsArray = Object.entries(loggedSymptoms).map(([name, data]) => ({
        symptomName: name,
        intensity: data.intensity
      }));

      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptomsArray,
          notes,
          returnVisit,
          visitDate: visitDate || null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Symptom log saved successfully!');
        // Reset form after saving
        setLoggedSymptoms({})
        setNotes("")
        setReturnVisit(false)
        setVisitDate("")
        setShowExistingData(false)
        // Reload data to show the new entry
        await loadExistingData();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving symptom log:', error);
      alert('Failed to save symptom log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border/20 bg-background/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading your symptom data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/20 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <User className="h-5 w-5" />
          Log Your Symptoms
          {patientData && (
            <span className="text-sm text-muted-foreground font-normal">
              - {patientData.patientName}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Track each symptom's intensity to monitor your recovery.
          {patientData?.hasExistingData && (
            <span className="text-green-600 dark:text-green-400 ml-2">
              ✓ You have already logged symptoms today
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* EXISTING DATA SUMMARY */}
        {patientData?.latestVisit && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Latest Visit Information
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Date:</strong> {patientData.latestVisit.date}</p>
              <p><strong>Condition:</strong> {patientData.latestVisit.condition}</p>
              <p><strong>Disease:</strong> {patientData.latestVisit.disease}</p>
              {patientData.latestVisit.report && (
                <p><strong>Report:</strong> {patientData.latestVisit.report}</p>
              )}
            </div>
          </div>
        )}

        {/* RETURN VISIT SECTION */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="returnVisit"
              checked={returnVisit}
              onCheckedChange={(checked) => setReturnVisit(checked as boolean)}
            />
            <Label htmlFor="returnVisit" className="text-base font-semibold">
              Return Visit Required
            </Label>
          </div>
          {returnVisit && (
            <div className="space-y-2">
              <Label htmlFor="visitDate">Preferred Visit Date</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="visitDate"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}
        </div>

        {/* SYMPTOM LIST */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Select Symptoms & Rate Intensity</Label>
          <div className="space-y-2">
            {availableSymptoms.map((symptom) => {
              const isSelected = loggedSymptoms.hasOwnProperty(symptom.name)
              const Icon = symptom.icon
              return (
                <div key={symptom.name} className="p-4 border rounded-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${symptom.color}`} />
                      <span className="font-medium">{symptom.name}</span>
                    </div>
                    <Switch
                      checked={isSelected}
                      onCheckedChange={(isChecked) => handleSymptomToggle(symptom.name, isChecked)}
                    />
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[loggedSymptoms[symptom.name]?.intensity || 0]}
                            onValueChange={(value) => handleIntensityChange(symptom.name, value)}
                            max={10}
                            min={0}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-lg font-bold text-primary w-8 text-center">
                            {loggedSymptoms[symptom.name]?.intensity}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Mild</span>
                          <span>Severe</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* CUSTOM SYMPTOM INPUT */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Add Other Symptoms</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., 'Headache', 'Fatigue'..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
            />
            <Button onClick={addCustomSymptom} variant="secondary" aria-label="Add custom symptom">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* ADDITIONAL NOTES */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-semibold">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Describe anything else relevant, like triggers or reliefs..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* SAVE BUTTON */}
        <Button 
          onClick={handleSave} 
          size="lg" 
          className="w-full font-semibold text-base"
          disabled={isSaving || Object.keys(loggedSymptoms).length === 0}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Symptom Log for Today
            </>
          )}
        </Button>

        {/* INFO MESSAGE */}
        {patientData?.hasExistingData && (
          <div className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            This will create a new symptom log entry. Your previous entry for today will be preserved.
          </div>
        )}
      </CardContent>
    </Card>
  )
}