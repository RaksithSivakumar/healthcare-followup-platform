"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Bell,
  Shield,
  Download,
  Upload,
  Heart,
  Phone,
  AlertTriangle,
  Save,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"

export function SettingsSystem() {
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    symptomAlerts: true,
    medicationReminders: true,
    appointmentReminders: true,
    progressUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const [privacy, setPrivacy] = useState({
    shareDataWithProviders: true,
    anonymousAnalytics: false,
    dataRetention: "2-years",
    twoFactorAuth: false,
  })

  const [showPassword, setShowPassword] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and profile settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/patient-avatar.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="text-sm text-slate-600 dark:text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" defaultValue="1985-06-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" defaultValue="Male" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Main St, Anytown, ST 12345" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input id="currentPassword" type={showPassword ? "text" : "password"} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how and when you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Health Reminders</h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "dailyReminders",
                        label: "Daily Check-in Reminders",
                        desc: "Get reminded to log your daily symptoms and progress",
                      },
                      {
                        key: "symptomAlerts",
                        label: "Symptom Alerts",
                        desc: "Receive alerts when symptoms worsen or improve significantly",
                      },
                      {
                        key: "medicationReminders",
                        label: "Medication Reminders",
                        desc: "Never miss your medication schedule",
                      },
                      {
                        key: "appointmentReminders",
                        label: "Appointment Reminders",
                        desc: "Get notified about upcoming medical appointments",
                      },
                      {
                        key: "progressUpdates",
                        label: "Progress Updates",
                        desc: "Weekly summaries of your recovery progress",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="space-y-1">
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="space-y-1">
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive notifications via text message
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy">
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your privacy settings and data security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Sharing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="space-y-1">
                        <p className="font-medium">Share Data with Healthcare Providers</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Allow your healthcare team to access your recovery data
                        </p>
                      </div>
                      <Switch
                        checked={privacy.shareDataWithProviders}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({ ...prev, shareDataWithProviders: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="space-y-1">
                        <p className="font-medium">Anonymous Analytics</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Help improve the app with anonymous usage data
                        </p>
                      </div>
                      <Switch
                        checked={privacy.anonymousAnalytics}
                        onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, anonymousAnalytics: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="space-y-1">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {privacy.twoFactorAuth && <Badge variant="secondary">Enabled</Badge>}
                        <Switch
                          checked={privacy.twoFactorAuth}
                          onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, twoFactorAuth: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Retention</h3>
                  <div className="space-y-2">
                    <Label>How long should we keep your data?</Label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={privacy.dataRetention}
                      onChange={(e) => setPrivacy((prev) => ({ ...prev, dataRetention: e.target.value }))}
                    >
                      <option value="1-year">1 Year</option>
                      <option value="2-years">2 Years</option>
                      <option value="5-years">5 Years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="medical">
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  Medical Information
                </CardTitle>
                <CardDescription>Manage your medical history and health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input id="bloodType" defaultValue="O+" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input id="height" defaultValue="5'10&quot;" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input id="weight" defaultValue="175 lbs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhysician">Primary Physician</Label>
                    <Input id="primaryPhysician" defaultValue="Dr. Sarah Johnson" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input id="allergies" defaultValue="Penicillin, Shellfish" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <textarea
                    id="medications"
                    className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                    defaultValue="Ibuprofen 400mg - Twice daily&#10;Vitamin D3 1000IU - Once daily"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Medical Conditions</Label>
                  <textarea
                    id="conditions"
                    className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                    defaultValue="Post-surgical recovery - Knee replacement&#10;Hypertension - Well controlled"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surgeryDate">Recent Surgery Date</Label>
                  <Input id="surgeryDate" type="date" defaultValue="2024-01-15" />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Update Medical Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="emergency">
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>Manage your emergency contacts and medical alert information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Primary Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName1">Full Name</Label>
                      <Input id="emergencyName1" defaultValue="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation1">Relationship</Label>
                      <Input id="emergencyRelation1" defaultValue="Spouse" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone1">Phone Number</Label>
                      <Input id="emergencyPhone1" defaultValue="+1 (555) 987-6543" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyEmail1">Email</Label>
                      <Input id="emergencyEmail1" type="email" defaultValue="jane.doe@email.com" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Secondary Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName2">Full Name</Label>
                      <Input id="emergencyName2" defaultValue="Robert Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation2">Relationship</Label>
                      <Input id="emergencyRelation2" defaultValue="Brother" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone2">Phone Number</Label>
                      <Input id="emergencyPhone2" defaultValue="+1 (555) 456-7890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyEmail2">Email</Label>
                      <Input id="emergencyEmail2" type="email" defaultValue="robert.smith@email.com" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Medical Alert Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="medicalAlert">Medical Alert Details</Label>
                    <textarea
                      id="medicalAlert"
                      className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                      placeholder="Include any critical medical information for emergency responders..."
                      defaultValue="Recent knee replacement surgery (Jan 2024)&#10;Allergic to Penicillin - severe reaction&#10;Takes blood pressure medication daily"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Emergency Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="data">
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Data Management
                </CardTitle>
                <CardDescription>Export, import, or delete your health data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Export Data</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Download your health data in various formats for your records or to share with healthcare providers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Export as PDF
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Export as CSV
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Export as JSON
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Import Data</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Import health data from other apps or devices.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Upload className="w-4 h-4" />
                      Import from File
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Heart className="w-4 h-4" />
                      Connect Health App
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                  <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">Delete All Data</h4>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Permanently delete all your health data. This action cannot be undone.
                        </p>
                      </div>
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
