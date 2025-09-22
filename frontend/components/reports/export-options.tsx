"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, X, Printer } from "lucide-react"

interface ExportOptionsProps {
  onClose: () => void
}

const reportTypes = [
  { id: "weekly", label: "Weekly Summary", description: "Last 7 days of data" },
  { id: "monthly", label: "Monthly Report", description: "Complete month overview" },
  { id: "provider", label: "Provider Report", description: "Medical professional format" },
  { id: "custom", label: "Custom Range", description: "Select specific date range" },
]

const exportFormats = [
  { value: "pdf", label: "PDF Document", icon: FileText },
  { value: "excel", label: "Excel Spreadsheet", icon: FileText },
  { value: "print", label: "Print Preview", icon: Printer },
]

export function ExportOptions({ onClose }: ExportOptionsProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>(["weekly"])
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeImages, setIncludeImages] = useState(false)
  const [emailReport, setEmailReport] = useState(false)

  const handleReportToggle = (reportId: string) => {
    setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
  }

  const handleExport = () => {
    // Mock export functionality
    console.log({
      reports: selectedReports,
      format: exportFormat,
      options: {
        includeCharts,
        includeImages,
        emailReport,
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-down">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-blue-600" />
                <span>Export Health Reports</span>
              </CardTitle>
              <CardDescription>Choose reports and format options for export</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Reports to Export</Label>
            <div className="space-y-3">
              {reportTypes.map((report) => (
                <div key={report.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox
                    id={report.id}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => handleReportToggle(report.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={report.id} className="font-medium cursor-pointer">
                      {report.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="space-y-2">
                {exportFormats.map((format) => {
                  const Icon = format.icon
                  return (
                    <div key={format.value} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <RadioGroupItem value={format.value} id={format.value} />
                      <Icon className="h-4 w-4" />
                      <Label htmlFor={format.value} className="cursor-pointer">
                        {format.label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Additional Options */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Additional Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                <Label htmlFor="charts" className="cursor-pointer">
                  Include charts and graphs
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="images" checked={includeImages} onCheckedChange={setIncludeImages} />
                <Label htmlFor="images" className="cursor-pointer">
                  Include wound images (if applicable)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="email" checked={emailReport} onCheckedChange={setEmailReport} />
                <Label htmlFor="email" className="cursor-pointer">
                  Email report to healthcare provider
                </Label>
              </div>
            </div>
          </div>

          {/* Email Options */}
          {emailReport && (
            <div className="animate-slide-down">
              <Label className="text-base font-semibold mb-3 block">Email Settings</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="provider-email" className="text-sm font-medium">
                    Provider Email
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select healthcare provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson - sarah.johnson@hospital.com</SelectItem>
                      <SelectItem value="dr-smith">Dr. Michael Smith - michael.smith@clinic.com</SelectItem>
                      <SelectItem value="custom">Enter custom email...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={selectedReports.length === 0}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
