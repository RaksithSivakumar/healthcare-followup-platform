"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, FileText, AlertTriangle, CheckCircle, TrendingUp, Share } from "lucide-react"

const patientInfo = {
  name: "John Doe",
  age: 45,
  mrn: "MRN-123456",
  procedure: "Knee Arthroscopy",
  surgeon: "Dr. Sarah Johnson",
  surgeryDate: "November 30, 2024",
  reportDate: "December 15, 2024",
}

const clinicalMetrics = [
  { metric: "Pain Level (0-10)", current: "2.7", baseline: "8.0", change: "-66%", status: "excellent" },
  { metric: "Mobility Score", current: "78%", baseline: "20%", change: "+58%", status: "good" },
  { metric: "Wound Healing", current: "85%", baseline: "0%", change: "+85%", status: "excellent" },
  { metric: "Medication Adherence", current: "98%", baseline: "N/A", change: "N/A", status: "excellent" },
]

const complications = [
  { date: "Dec 3", issue: "Mild swelling", severity: "Minor", resolved: true },
  { date: "Dec 7", issue: "Temporary stiffness", severity: "Minor", resolved: true },
]

const recommendations = [
  "Continue current physical therapy regimen",
  "Gradually increase activity level as tolerated",
  "Monitor for any signs of infection",
  "Follow-up appointment in 2 weeks",
  "Consider reducing pain medication as appropriate",
]

export function ProviderReport() {
  return (
    <div className="space-y-6">
      {/* Medical Header */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                <FileText className="h-5 w-5" />
                <span>Medical Provider Report</span>
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Post-Operative Recovery Assessment
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className="bg-blue-500">Confidential</Badge>
              <Button size="sm" variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share Securely
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Patient Information */}
      <Card className="glass glass-dark">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Patient Name:</span>
                <span>{patientInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Age:</span>
                <span>{patientInfo.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">MRN:</span>
                <span>{patientInfo.mrn}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Procedure:</span>
                <span>{patientInfo.procedure}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Surgeon:</span>
                <span>{patientInfo.surgeon}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Surgery Date:</span>
                <span>{patientInfo.surgeryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Report Date:</span>
                <span>{patientInfo.reportDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Days Post-Op:</span>
                <span>15 days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Clinical Metrics & Progress</span>
          </CardTitle>
          <CardDescription>Objective measurements and patient-reported outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clinicalMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1">
                  <div className="font-medium">{metric.metric}</div>
                  <div className="text-sm text-muted-foreground">
                    Baseline: {metric.baseline} → Current: {metric.current}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {metric.change !== "N/A" && (
                    <Badge variant="outline" className="text-green-600">
                      {metric.change}
                    </Badge>
                  )}
                  <Badge
                    className={
                      metric.status === "excellent"
                        ? "bg-green-500"
                        : metric.status === "good"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complications & Issues */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              <span>Complications & Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {complications.length > 0 ? (
              <div className="space-y-3">
                {complications.map((comp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{comp.issue}</div>
                      <div className="text-sm text-muted-foreground">{comp.date}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{comp.severity}</Badge>
                      {comp.resolved && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No complications reported</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span>Clinical Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-green-700 dark:text-green-300">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Summary & Assessment</CardTitle>
          <CardDescription>Professional evaluation of patient progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Overall Assessment:</h4>
            <p className="text-sm text-muted-foreground">
              Patient demonstrates excellent recovery progress following knee arthroscopy. Pain levels have decreased
              significantly from baseline (8/10 to 2.7/10), representing a 66% improvement. Wound healing is progressing
              ahead of schedule at 85% completion. Patient compliance with medication regimen and physical therapy
              exercises is exemplary at 98%.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Risk Assessment:</h4>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500">Low Risk</Badge>
              <span className="text-sm text-muted-foreground">
                No significant complications. Continue current treatment plan.
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Next Steps:</h4>
            <p className="text-sm text-muted-foreground">
              Schedule follow-up appointment in 2 weeks. Consider gradual reduction of pain medication as appropriate.
              Continue physical therapy regimen with progressive activity increases. Patient may return to light
              activities as tolerated.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Provider Signature */}
      <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Report Generated By:</div>
              <div className="text-sm text-muted-foreground">HealthCare AI System</div>
              <div className="text-sm text-muted-foreground">Based on patient-reported data</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Generated: {patientInfo.reportDate}</div>
              <div className="text-sm text-muted-foreground">Report ID: RPT-{Date.now()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
