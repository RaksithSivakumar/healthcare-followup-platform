"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Share, TrendingUp, Activity, Heart, Printer, User, Stethoscope, Pill, AlertTriangle, Loader2, ChevronDown, ChevronRight, Calendar, RefreshCw } from "lucide-react"
import { WeeklyReport } from "./weekly-report"
import { MonthlyReport } from "./monthly-report"
import { ProviderReport } from "./provider-report"
import { ExportOptions } from "./export-options"
import { useAuth } from "@/components/auth/auth-provider"

interface MedicalData {
  patientInfo: {
    id: string;
    name: string;
    email: string;
  };
  doctor: {
    did: string;
    dname: string;
    demail: string;
    specialization: string;
  } | null;
  visits: Array<{
    visit_date: string;
    condition: string;
    disease: string;
    vital: {
      bp: string;
      hr: string;
      spo2: string;
    };
    symptoms: Array<{
      name: string;
      pain_level: string;
      notes: string;
    }>;
    medications: Array<{
      medication: string;
      dosage: string;
      duration: string;
      route: string;
      notes: string;
    }>;
    report: string;
  }>;
  symptomLogs: Array<{
    symptoms: Array<{
      symptomName: string;
      intensity: string;
      notes: string;
    }>;
    timestamp: string;
    returnVisit: boolean;
    visitDate?: string;
  }>;
  summary: {
    totalVisits: number;
    totalSymptoms: number;
    lastVisit: string | null;
    hasDoctor: boolean;
  };
}

export function ReportsSystem() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("reports")
  const [showExportModal, setShowExportModal] = useState(false)
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSymptomLogs, setExpandedSymptomLogs] = useState<Set<number>>(new Set())

  // Load medical data when component mounts
  useEffect(() => {
    if (user?.id) {
      loadMedicalData();
    }
  }, [user?.id]);

  const loadMedicalData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      
      if (data.success) {
        setMedicalData(data.data);
      }
    } catch (error) {
      console.error('Error loading medical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSymptomLog = (index: number) => {
    const newExpanded = new Set(expandedSymptomLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSymptomLogs(newExpanded);
  };

  const reportStats = [
    {
      title: "Total Visits",
      value: medicalData?.summary.totalVisits.toString() || "0",
      change: medicalData?.summary.totalVisits ? `+${medicalData.summary.totalVisits}` : "+0",
      time: "all time",
      icon: Stethoscope,
      color: "text-blue-600",
    },
    {
      title: "Total Symptoms",
      value: medicalData?.summary.totalSymptoms.toString() || "0",
      change: medicalData?.summary.totalSymptoms ? `+${medicalData.summary.totalSymptoms}` : "+0",
      time: "all time",
      icon: TrendingUp,
      color: "text-green-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading your medical reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      {medicalData && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    {medicalData.patientInfo.name}
                  </h2>
                  <p className="text-blue-700 dark:text-blue-300">
                    {medicalData.patientInfo.email}
                  </p>
                </div>
              </div>
              {medicalData.doctor && (
                <div className="text-right">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Your Doctor</p>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {medicalData.doctor.dname}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {medicalData.doctor.specialization}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="animate-fade-in-up hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg text-muted-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.time}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  </div>
                  <p className="text-2xl text-green-600">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Actions</CardTitle>
              <CardDescription>Generate, export, and share your health reports</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowExportModal(true)}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Reports Interface */}
      <Card className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Health Reports Dashboard</span>
          </CardTitle>
          <CardDescription>Detailed analytics and comprehensive reports for your recovery progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass glass-dark">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Visits</CardTitle>
                    <CardDescription>Your latest medical visits and reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {medicalData?.visits && medicalData.visits.length > 0 ? (
                      medicalData.visits.slice(-4).reverse().map((visit, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{visit.condition}</div>
                            <Badge variant="outline">{visit.disease}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {new Date(visit.visit_date).toLocaleDateString()}
                          </div>
                          {visit.vital.bp && (
                            <div className="text-xs text-muted-foreground">
                              BP: {visit.vital.bp} | HR: {visit.vital.hr} | SpO2: {visit.vital.spo2}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No visit records found
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass glass-dark">
                  <CardHeader>
                    <CardTitle className="text-lg">Report Templates</CardTitle>
                    <CardDescription>Generate new reports from templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Recovery Progress", description: "Comprehensive recovery analysis", icon: TrendingUp },
                      { name: "Pain & Symptoms", description: "Detailed symptom tracking", icon: Activity },
                      { name: "Medication Adherence", description: "Medication compliance report", icon: Heart },
                      { name: "Provider Summary", description: "Medical professional report", icon: FileText },
                    ].map((template, index) => {
                      const Icon = template.icon
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start h-auto p-3 animate-fade-in-up bg-transparent"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </Button>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass glass-dark">
                  <CardHeader>
                    <CardTitle className="text-lg">Visit Details & Symptoms</CardTitle>
                    <CardDescription>Detailed logs from your medical visits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {medicalData?.visits && medicalData.visits.length > 0 ? (
                      medicalData.visits.slice(-3).reverse().map((visit, visitIndex) => (
                        <div key={visitIndex} className="border rounded-lg p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{visit.condition}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {new Date(visit.visit_date).toLocaleDateString()}
                            </Badge>
                          </div>
                          
                          {/* Symptoms */}
                          {visit.symptoms && visit.symptoms.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Symptoms:</p>
                              <div className="space-y-1">
                                {visit.symptoms.map((symptom, symIndex) => (
                                  <div key={symIndex} className="flex items-center space-x-2 text-xs">
                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                    <span>{symptom.name}</span>
                                    {symptom.pain_level && (
                                      <Badge variant="outline" className="text-xs">
                                        Pain: {symptom.pain_level}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {visit.medications && visit.medications.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Medications:</p>
                              <div className="space-y-1">
                                {visit.medications.map((med, medIndex) => (
                                  <div key={medIndex} className="flex items-center space-x-2 text-xs">
                                    <Pill className="h-3 w-3 text-blue-500" />
                                    <span>{med.medication}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {med.dosage}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Report */}
                          {visit.report && (
                            <div className="text-xs">
                              <p className="font-medium text-muted-foreground mb-1">Report:</p>
                              <p className="text-muted-foreground">{visit.report}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No visit logs found
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass glass-dark">
                  <CardHeader>
                    <CardTitle className="text-lg">Symptom Logs</CardTitle>
                    <CardDescription>Click on any log to view detailed symptom information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {medicalData?.symptomLogs && medicalData.symptomLogs.length > 0 ? (
                      medicalData.symptomLogs.slice(-4).reverse().map((log, index) => {
                        const isExpanded = expandedSymptomLogs.has(index);
                        return (
                          <div
                            key={index}
                            className="border rounded-lg overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {/* Clickable Header */}
                            <div 
                              className="p-3 bg-muted/50 hover:bg-muted/70 cursor-pointer transition-colors"
                              onClick={() => toggleSymptomLog(index)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="text-sm font-medium">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                  </div>
                                  <Badge variant="outline">
                                    {log.symptoms?.length || 0} symptoms
                                  </Badge>
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>

                            {/* Expandable Content */}
                            {isExpanded && (
                              <div className="p-3 space-y-3 border-t bg-white dark:bg-gray-950">
                                {/* Symptoms Details */}
                                {log.symptoms && log.symptoms.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">
                                      Symptoms Recorded:
                                    </h4>
                                    <div className="space-y-2">
                                      {log.symptoms.map((symptom, symIndex) => (
                                        <div key={symIndex} className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-l-blue-400">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{symptom.symptomName}</span>
                                            <Badge variant="secondary" className="text-xs">
                                              Intensity: {symptom.intensity}
                                            </Badge>
                                          </div>
                                          {symptom.notes && (
                                            <p className="text-xs text-muted-foreground">{symptom.notes}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Additional Information */}
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                  <div className="flex items-center space-x-2">
                                    <RefreshCw className="h-4 w-4 text-orange-500" />
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">Return Visit</p>
                                      <p className="text-sm font-semibold">
                                        {log.returnVisit ? (
                                          <Badge variant="destructive" className="text-xs">Required</Badge>
                                        ) : (
                                          <Badge variant="outline" className="text-xs">Not Required</Badge>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {log.visitDate && (
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-green-500" />
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground">Preferred Date</p>
                                        <p className="text-sm font-semibold">
                                          {new Date(log.visitDate).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Timestamp */}
                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                  Logged at: {new Date(log.timestamp).toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No symptom logs found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showExportModal && <ExportOptions onClose={() => setShowExportModal(false)} />}
    </div>
  )
}
