"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  Bell,
  Clock,
  Heart,
  Pill,
  Calendar,
  MessageSquare,
  Settings,
  Check,
  X,
  MoreHorizontal,
  Phone,
  Filter,
  Archive,
} from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    type: "critical",
    category: "vitals",
    title: "Critical Blood Pressure Alert",
    message: "Michael Chen's blood pressure reading of 180/110 requires immediate attention",
    patient: {
      id: "3",
      name: "Michael Chen",
      avatar: "/patient-avatar.png",
    },
    timestamp: "2024-01-25T14:30:00Z",
    isRead: false,
    priority: "high",
    actions: ["call", "message", "schedule"],
  },
  {
    id: "2",
    type: "medication",
    category: "adherence",
    title: "Medication Missed",
    message: "Sarah Johnson missed her evening insulin dose",
    patient: {
      id: "2",
      name: "Sarah Johnson",
      avatar: "/patient-avatar.png",
    },
    timestamp: "2024-01-25T12:15:00Z",
    isRead: false,
    priority: "medium",
    actions: ["call", "message"],
  },
  {
    id: "3",
    type: "appointment",
    category: "scheduling",
    title: "Appointment Reminder",
    message: "John Doe has a follow-up appointment in 2 hours",
    patient: {
      id: "1",
      name: "John Doe",
      avatar: "/patient-avatar.png",
    },
    timestamp: "2024-01-25T11:00:00Z",
    isRead: true,
    priority: "low",
    actions: ["reschedule", "confirm"],
  },
  {
    id: "4",
    type: "symptom",
    category: "reporting",
    title: "New Symptom Reported",
    message: "Emily Rodriguez reported increased pain levels (8/10)",
    patient: {
      id: "4",
      name: "Emily Rodriguez",
      avatar: "/patient-avatar.png",
    },
    timestamp: "2024-01-25T10:45:00Z",
    isRead: false,
    priority: "medium",
    actions: ["call", "schedule", "message"],
  },
  {
    id: "5",
    type: "lab",
    category: "results",
    title: "Lab Results Available",
    message: "HbA1c results for Sarah Johnson are now available",
    patient: {
      id: "2",
      name: "Sarah Johnson",
      avatar: "/patient-avatar.png",
    },
    timestamp: "2024-01-25T09:30:00Z",
    isRead: true,
    priority: "low",
    actions: ["view", "message"],
  },
  {
    id: "6",
    type: "system",
    category: "alert",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM",
    timestamp: "2024-01-25T08:00:00Z",
    isRead: false,
    priority: "low",
    actions: [],
  },
]

const notificationIcons = {
  critical: AlertTriangle,
  medication: Pill,
  appointment: Calendar,
  symptom: Heart,
  lab: MessageSquare,
  system: Settings,
}

const priorityColors = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [filter, setFilter] = useState("all")
  const [notificationSettings, setNotificationSettings] = useState({
    criticalAlerts: true,
    medicationReminders: true,
    appointmentReminders: true,
    labResults: true,
    systemUpdates: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  })

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.isRead
    if (filter === "critical") return notification.priority === "high"
    return notification.category === filter
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const criticalCount = notifications.filter((n) => n.priority === "high" && !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new critical alert
      if (Math.random() < 0.1) {
        const newNotification = {
          id: Date.now().toString(),
          type: "critical",
          category: "vitals",
          title: "New Critical Alert",
          message: "Patient vitals require immediate attention",
          patient: {
            id: "new",
            name: "Test Patient",
            avatar: "/patient-avatar.png",
          },
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: "high",
          actions: ["call", "message"],
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notifications • {criticalCount} critical alerts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Notifications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("unread")}>Unread Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("critical")}>Critical Alerts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("vitals")}>Vitals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("medication")}>Medications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("scheduling")}>Appointments</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Critical Alerts Banner */}
          {criticalCount > 0 && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">
                      {criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""} Require Immediate Attention
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Review and respond to critical patient alerts immediately
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons]
              return (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md cursor-pointer ${
                    !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
                  } ${
                    notification.priority === "high"
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                      : ""
                  }`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            notification.priority === "high"
                              ? "bg-red-100 dark:bg-red-900/20"
                              : notification.priority === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/20"
                                : "bg-blue-100 dark:bg-blue-900/20"
                          }`}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${
                              notification.priority === "high"
                                ? "text-red-600"
                                : notification.priority === "medium"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                            } ${notification.priority === "high" ? "animate-pulse" : ""}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${!notification.isRead ? "text-primary" : ""}`}>
                              {notification.title}
                            </h3>
                            <Badge variant={priorityColors[notification.priority as keyof typeof priorityColors]}>
                              {notification.priority}
                            </Badge>
                            {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            {notification.patient && (
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={notification.patient.avatar || "/placeholder.svg"}
                                    alt={notification.patient.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {notification.patient.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{notification.patient.name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{getTimeAgo(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {notification.actions.length > 0 && (
                          <div className="flex space-x-1">
                            {notification.actions.includes("call") && (
                              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                                <Phone className="h-3 w-3" />
                              </Button>
                            )}
                            {notification.actions.includes("message") && (
                              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "You're all caught up! No new notifications."
                    : `No notifications match the current filter: ${filter}`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Alert Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="critical-alerts">Critical Patient Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        High-priority medical alerts requiring immediate attention
                      </p>
                    </div>
                    <Switch
                      id="critical-alerts"
                      checked={notificationSettings.criticalAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, criticalAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="medication-reminders">Medication Reminders</Label>
                      <p className="text-sm text-muted-foreground">Alerts for missed or upcoming medications</p>
                    </div>
                    <Switch
                      id="medication-reminders"
                      checked={notificationSettings.medicationReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, medicationReminders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Upcoming appointments and scheduling updates</p>
                    </div>
                    <Switch
                      id="appointment-reminders"
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, appointmentReminders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lab-results">Lab Results</Label>
                      <p className="text-sm text-muted-foreground">New laboratory and test results</p>
                    </div>
                    <Switch
                      id="lab-results"
                      checked={notificationSettings.labResults}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, labResults: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Platform maintenance and feature updates</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, systemUpdates: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive critical alerts via text message</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Detail Dialog */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {(() => {
                  const IconComponent = notificationIcons[selectedNotification.type as keyof typeof notificationIcons]
                  return (
                    <IconComponent
                      className={`h-5 w-5 ${
                        selectedNotification.priority === "high"
                          ? "text-red-600"
                          : selectedNotification.priority === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                  )
                })()}
                <span>{selectedNotification.title}</span>
                <Badge variant={priorityColors[selectedNotification.priority as keyof typeof priorityColors]}>
                  {selectedNotification.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {getTimeAgo(selectedNotification.timestamp)}
                {selectedNotification.patient && ` • Patient: ${selectedNotification.patient.name}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <p className="text-sm">{selectedNotification.message}</p>
              </div>
              {selectedNotification.patient && (
                <div>
                  <h4 className="font-semibold mb-2">Patient Information</h4>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Avatar>
                      <AvatarImage
                        src={selectedNotification.patient.avatar || "/placeholder.svg"}
                        alt={selectedNotification.patient.name}
                      />
                      <AvatarFallback>
                        {selectedNotification.patient.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedNotification.patient.name}</p>
                      <p className="text-sm text-muted-foreground">Patient ID: {selectedNotification.patient.id}</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedNotification.actions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <div className="flex space-x-2">
                    {selectedNotification.actions.includes("call") && (
                      <Button>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Patient
                      </Button>
                    )}
                    {selectedNotification.actions.includes("message") && (
                      <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    )}
                    {selectedNotification.actions.includes("schedule") && (
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Appointment
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedNotification(null)}>
                Close
              </Button>
              {!selectedNotification.isRead && (
                <Button
                  onClick={() => {
                    markAsRead(selectedNotification.id)
                    setSelectedNotification(null)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Read
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
