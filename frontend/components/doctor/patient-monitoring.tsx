"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Activity,
  Heart,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Bell,
  Phone,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

// Mock patient monitoring data
const mockMonitoringData = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    avatar: "/patient-avatar.png",
    condition: "Post-surgical recovery",
    riskScore: 25,
    status: "stable",
    lastUpdate: "2 minutes ago",
    vitals: {
      heartRate: { current: 72, threshold: { min: 60, max: 100 }, trend: "stable" },
      bloodPressure: { current: 120, threshold: { min: 90, max: 140 }, trend: "improving" },
      temperature: { current: 98.6, threshold: { min: 97, max: 99.5 }, trend: "stable" },
      oxygenSat: { current: 98, threshold: { min: 95, max: 100 }, trend: "stable" },
    },
    alerts: [],
    monitoring: {
      enabled: true,
      frequency: "hourly",
      parameters: ["heartRate", "bloodPressure", "temperature"],
    },
    history: [
      { time: "14:00", heartRate: 72, bloodPressure: 120, temperature: 98.6, riskScore: 25 },
      { time: "13:00", heartRate: 75, bloodPressure: 118, temperature: 98.4, riskScore: 28 },
      { time: "12:00", heartRate: 78, bloodPressure: 122, temperature: 98.8, riskScore: 32 },
      { time: "11:00", heartRate: 80, bloodPressure: 125, temperature: 99.1, riskScore: 35 },
      { time: "10:00", heartRate: 82, bloodPressure: 128, temperature: 99.3, riskScore: 38 },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 62,
    avatar: "/patient-avatar.png",
    condition: "Diabetes management",
    riskScore: 65,
    status: "attention",
    lastUpdate: "5 minutes ago",
    vitals: {
      heartRate: { current: 88, threshold: { min: 60, max: 100 }, trend: "increasing" },
      bloodPressure: { current: 145, threshold: { min: 90, max: 140 }, trend: "concerning" },
      temperature: { current: 99.2, threshold: { min: 97, max: 99.5 }, trend: "stable" },
      oxygenSat: { current: 96, threshold: { min: 95, max: 100 }, trend: "stable" },
    },
    alerts: [
      { type: "warning", message: "Blood pressure above threshold", timestamp: "5 minutes ago" },
      { type: "info", message: "Heart rate trending upward", timestamp: "15 minutes ago" },
    ],
    monitoring: {
      enabled: true,
      frequency: "30min",
      parameters: ["heartRate", "bloodPressure", "temperature", "bloodSugar"],
    },
    history: [
      { time: "14:00", heartRate: 88, bloodPressure: 145, temperature: 99.2, riskScore: 65 },
      { time: "13:30", heartRate: 85, bloodPressure: 142, temperature: 99.0, riskScore: 62 },
      { time: "13:00", heartRate: 90, bloodPressure: 148, temperature: 99.1, riskScore: 68 },
      { time: "12:30", heartRate: 87, bloodPressure: 144, temperature: 98.9, riskScore: 64 },
      { time: "12:00", heartRate: 92, bloodPressure: 150, temperature: 99.3, riskScore: 72 },
    ],
  },
  {
    id: "3",
    name: "Michael Chen",
    age: 38,
    avatar: "/patient-avatar.png",
    condition: "Hypertension",
    riskScore: 85,
    status: "critical",
    lastUpdate: "1 minute ago",
    vitals: {
      heartRate: { current: 105, threshold: { min: 60, max: 100 }, trend: "critical" },
      bloodPressure: { current: 165, threshold: { min: 90, max: 140 }, trend: "critical" },
      temperature: { current: 100.1, threshold: { min: 97, max: 99.5 }, trend: "increasing" },
      oxygenSat: { current: 94, threshold: { min: 95, max: 100 }, trend: "decreasing" },
    },
    alerts: [
      { type: "critical", message: "Multiple vitals outside safe range", timestamp: "1 minute ago" },
      { type: "critical", message: "Blood pressure critically high", timestamp: "3 minutes ago" },
      { type: "warning", message: "Heart rate above threshold", timestamp: "8 minutes ago" },
    ],
    monitoring: {
      enabled: true,
      frequency: "15min",
      parameters: ["heartRate", "bloodPressure", "temperature", "oxygenSat"],
    },
    history: [
      { time: "14:00", heartRate: 105, bloodPressure: 165, temperature: 100.1, riskScore: 85 },
      { time: "13:45", heartRate: 102, bloodPressure: 162, temperature: 100.0, riskScore: 82 },
      { time: "13:30", heartRate: 98, bloodPressure: 158, temperature: 99.8, riskScore: 78 },
      { time: "13:15", heartRate: 95, bloodPressure: 155, temperature: 99.6, riskScore: 75 },
      { time: "13:00", heartRate: 92, bloodPressure: 152, temperature: 99.4, riskScore: 72 },
    ],
  },
]

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "improving":
      return <TrendingDown className="h-4 w-4 text-green-500" />
    case "increasing":
    case "concerning":
    case "critical":
      return <TrendingUp className="h-4 w-4 text-red-500" />
    default:
      return <Activity className="h-4 w-4 text-blue-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical":
      return "destructive"
    case "attention":
      return "secondary"
    default:
      return "default"
  }
}

const getRiskColor = (score: number) => {
  if (score >= 70) return "text-red-600"
  if (score >= 40) return "text-yellow-600"
  return "text-green-600"
}

export function PatientMonitoring() {
  const [patients, setPatients] = useState(mockMonitoringData)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [monitoringSettings, setMonitoringSettings] = useState({
    autoAlerts: true,
    criticalThreshold: 70,
    warningThreshold: 40,
    updateFrequency: "5min",
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Simulate real-time monitoring updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients((prevPatients) =>
        prevPatients.map((patient) => {
          // Simulate vital sign changes
          const newVitals = { ...patient.vitals }
          const newHistory = [...patient.history]

          // Random variations in vitals
          if (Math.random() < 0.3) {
            const heartRateChange = (Math.random() - 0.5) * 10
            const bpChange = (Math.random() - 0.5) * 20
            const tempChange = (Math.random() - 0.5) * 2

            newVitals.heartRate.current = Math.max(
              50,
              Math.min(120, patient.vitals.heartRate.current + heartRateChange),
            )
            newVitals.bloodPressure.current = Math.max(
              80,
              Math.min(180, patient.vitals.bloodPressure.current + bpChange),
            )
            newVitals.temperature.current = Math.max(96, Math.min(102, patient.vitals.temperature.current + tempChange))

            // Calculate new risk score
            const newRiskScore = Math.min(
              100,
              Math.max(
                0,
                (newVitals.heartRate.current > 100 ? 20 : 0) +
                  (newVitals.bloodPressure.current > 140 ? 30 : 0) +
                  (newVitals.temperature.current > 99.5 ? 25 : 0) +
                  (patient.age > 60 ? 15 : 0) +
                  Math.random() * 10,
              ),
            )

            // Add to history
            const now = new Date()
            const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
            newHistory.unshift({
              time: timeString,
              heartRate: Math.round(newVitals.heartRate.current),
              bloodPressure: Math.round(newVitals.bloodPressure.current),
              temperature: Math.round(newVitals.temperature.current * 10) / 10,
              riskScore: Math.round(newRiskScore),
            })

            // Keep only last 10 entries
            if (newHistory.length > 10) {
              newHistory.pop()
            }

            return {
              ...patient,
              vitals: newVitals,
              riskScore: newRiskScore,
              history: newHistory,
              status: newRiskScore >= 70 ? "critical" : newRiskScore >= 40 ? "attention" : "stable",
              lastUpdate: "Just now",
            }
          }

          return patient
        }),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const criticalPatients = patients.filter((p) => p.status === "critical").length
  const attentionPatients = patients.filter((p) => p.status === "attention").length
  const stablePatients = patients.filter((p) => p.status === "stable").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Monitoring</h1>
          <p className="text-muted-foreground">Real-time patient condition monitoring and automated alerts</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Monitoring Settings</DialogTitle>
                <DialogDescription>Configure patient monitoring parameters and thresholds</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-alerts">Automatic Alerts</Label>
                  <Switch
                    id="auto-alerts"
                    checked={monitoringSettings.autoAlerts}
                    onCheckedChange={(checked) => setMonitoringSettings((prev) => ({ ...prev, autoAlerts: checked }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="critical-threshold">Critical Risk Threshold</Label>
                  <Input
                    id="critical-threshold"
                    type="number"
                    value={monitoringSettings.criticalThreshold}
                    onChange={(e) =>
                      setMonitoringSettings((prev) => ({ ...prev, criticalThreshold: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warning-threshold">Warning Risk Threshold</Label>
                  <Input
                    id="warning-threshold"
                    type="number"
                    value={monitoringSettings.warningThreshold}
                    onChange={(e) =>
                      setMonitoringSettings((prev) => ({ ...prev, warningThreshold: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-frequency">Update Frequency</Label>
                  <Select
                    value={monitoringSettings.updateFrequency}
                    onValueChange={(value) => setMonitoringSettings((prev) => ({ ...prev, updateFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1min">Every minute</SelectItem>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="30min">Every 30 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Live View
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{criticalPatients}</div>
            <p className="text-xs text-red-700 dark:text-red-300">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Attention</CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{attentionPatients}</div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">Need monitoring</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Stable</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stablePatients}</div>
            <p className="text-xs text-green-700 dark:text-green-300">Normal parameters</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Monitored</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{patients.length}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Active monitoring</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Patient Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alert History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <Card
                key={patient.id}
                className={`transition-all hover:shadow-md cursor-pointer ${
                  patient.status === "critical"
                    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                    : patient.status === "attention"
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20"
                      : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{patient.name}</h3>
                          <Badge variant={getStatusColor(patient.status)}>{patient.status}</Badge>
                          {patient.alerts.length > 0 && (
                            <Badge variant="destructive" className="animate-pulse">
                              {patient.alerts.length} alerts
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Age {patient.age} • {patient.condition}
                        </p>
                        <p className="text-xs text-muted-foreground">Last update: {patient.lastUpdate}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Risk Score */}
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getRiskColor(patient.riskScore)}`}>
                          {patient.riskScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                        <Progress
                          value={patient.riskScore}
                          className="w-16 h-2 mt-1"
                          // @ts-ignore
                          indicatorClassName={
                            patient.riskScore >= 70
                              ? "bg-red-500"
                              : patient.riskScore >= 40
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }
                        />
                      </div>

                      {/* Vitals */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{patient.vitals.heartRate.current} BPM</span>
                          {getTrendIcon(patient.vitals.heartRate.trend)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span>{patient.vitals.bloodPressure.current}/80</span>
                          {getTrendIcon(patient.vitals.bloodPressure.trend)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span>{patient.vitals.temperature.current}°F</span>
                          {getTrendIcon(patient.vitals.temperature.trend)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-purple-500" />
                          <span>{patient.vitals.oxygenSat.current}% O2</span>
                          {getTrendIcon(patient.vitals.oxygenSat.trend)}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Alerts */}
                  {patient.alerts.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-2">
                        {patient.alerts.slice(0, 2).map((alert, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <AlertTriangle
                              className={`h-3 w-3 ${
                                alert.type === "critical"
                                  ? "text-red-500"
                                  : alert.type === "warning"
                                    ? "text-yellow-500"
                                    : "text-blue-500"
                              }`}
                            />
                            <span>{alert.message}</span>
                            <span className="text-muted-foreground">• {alert.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Trends</CardTitle>
                <CardDescription>Patient risk scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={patients[0]?.history || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                    <Area type="monotone" dataKey="riskScore" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vital Signs Distribution</CardTitle>
                <CardDescription>Current vital signs across all patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Heart Rate (60-100 BPM)</span>
                      <span>
                        {
                          patients.filter((p) => p.vitals.heartRate.current >= 60 && p.vitals.heartRate.current <= 100)
                            .length
                        }
                        /{patients.length} normal
                      </span>
                    </div>
                    <Progress
                      value={
                        (patients.filter((p) => p.vitals.heartRate.current >= 60 && p.vitals.heartRate.current <= 100)
                          .length /
                          patients.length) *
                        100
                      }
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Blood Pressure (90-140)</span>
                      <span>
                        {
                          patients.filter(
                            (p) => p.vitals.bloodPressure.current >= 90 && p.vitals.bloodPressure.current <= 140,
                          ).length
                        }
                        /{patients.length} normal
                      </span>
                    </div>
                    <Progress
                      value={
                        (patients.filter(
                          (p) => p.vitals.bloodPressure.current >= 90 && p.vitals.bloodPressure.current <= 140,
                        ).length /
                          patients.length) *
                        100
                      }
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Temperature (97-99.5°F)</span>
                      <span>
                        {
                          patients.filter(
                            (p) => p.vitals.temperature.current >= 97 && p.vitals.temperature.current <= 99.5,
                          ).length
                        }
                        /{patients.length} normal
                      </span>
                    </div>
                    <Progress
                      value={
                        (patients.filter(
                          (p) => p.vitals.temperature.current >= 97 && p.vitals.temperature.current <= 99.5,
                        ).length /
                          patients.length) *
                        100
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>All patient alerts from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients
                  .flatMap((patient) =>
                    patient.alerts.map((alert) => ({
                      ...alert,
                      patientName: patient.name,
                      patientId: patient.id,
                    })),
                  )
                  .map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            alert.type === "critical"
                              ? "text-red-500"
                              : alert.type === "warning"
                                ? "text-yellow-500"
                                : "text-blue-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.patientName} • {alert.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          alert.type === "critical" ? "destructive" : alert.type === "warning" ? "secondary" : "outline"
                        }
                      >
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient Detail Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} alt={selectedPatient.name} />
                  <AvatarFallback>
                    {selectedPatient.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedPatient.name}</span>
                <Badge variant={getStatusColor(selectedPatient.status)}>{selectedPatient.status}</Badge>
              </DialogTitle>
              <DialogDescription>Real-time monitoring and vital signs tracking</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Vitals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(selectedPatient.vitals).map(([key, vital]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {key === "heartRate" && <Heart className="h-4 w-4 text-red-500" />}
                          {key === "bloodPressure" && <Activity className="h-4 w-4 text-blue-500" />}
                          {key === "temperature" && <Thermometer className="h-4 w-4 text-orange-500" />}
                          {key === "oxygenSat" && <Activity className="h-4 w-4 text-purple-500" />}
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{vital.current}</span>
                          {getTrendIcon(vital.trend)}
                          <span className="text-xs text-muted-foreground">
                            ({vital.threshold.min}-{vital.threshold.max})
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getRiskColor(selectedPatient.riskScore)}`}>
                        {selectedPatient.riskScore}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">Risk Score</div>
                      <Progress
                        value={selectedPatient.riskScore}
                        className="mb-4"
                        // @ts-ignore
                        indicatorClassName={
                          selectedPatient.riskScore >= 70
                            ? "bg-red-500"
                            : selectedPatient.riskScore >= 40
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }
                      />
                      <p className="text-sm">
                        {selectedPatient.riskScore >= 70
                          ? "High risk - requires immediate attention"
                          : selectedPatient.riskScore >= 40
                            ? "Moderate risk - monitor closely"
                            : "Low risk - stable condition"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vital Signs History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selectedPatient.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="time" tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                      <Line type="monotone" dataKey="heartRate" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="bloodPressure" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Full Analytics
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
