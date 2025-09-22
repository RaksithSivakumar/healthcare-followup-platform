"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Calendar, CheckCircle, AlertTriangle } from "lucide-react"

const weeklyData = [
  { day: "Mon", pain: 4, mood: 3, activities: 85, sleep: 7.5 },
  { day: "Tue", pain: 3, mood: 4, activities: 90, sleep: 8.0 },
  { day: "Wed", pain: 3, mood: 4, activities: 88, sleep: 7.8 },
  { day: "Thu", pain: 2, mood: 4, activities: 95, sleep: 8.2 },
  { day: "Fri", pain: 3, mood: 4, activities: 92, sleep: 7.9 },
  { day: "Sat", pain: 2, mood: 5, activities: 87, sleep: 8.5 },
  { day: "Sun", pain: 2, mood: 5, activities: 89, sleep: 8.1 },
]

const weeklyMetrics = [
  {
    title: "Average Pain Level",
    value: "2.7/10",
    change: "-1.3 from last week",
    trend: "down",
    color: "text-green-600",
  },
  {
    title: "Mood Score",
    value: "4.1/5",
    change: "+0.8 from last week",
    trend: "up",
    color: "text-green-600",
  },
  {
    title: "Activity Completion",
    value: "89%",
    change: "+5% from last week",
    trend: "up",
    color: "text-green-600",
  },
  {
    title: "Sleep Quality",
    value: "8.0 hrs",
    change: "+0.5 hrs from last week",
    trend: "up",
    color: "text-green-600",
  },
]

export function WeeklyReport() {
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                <Calendar className="h-5 w-5" />
                <span>Weekly Recovery Report</span>
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                December 9-15, 2024 • Post-Surgery Week 2
              </CardDescription>
            </div>
            <Badge className="bg-blue-500">Week 2</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {weeklyMetrics.map((metric, index) => {
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={metric.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.title}</span>
                  <TrendIcon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.color}`}>{metric.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="text-lg">Daily Pain & Mood Tracking</CardTitle>
            <CardDescription>Your pain levels and mood scores throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                  <Line
                    type="monotone"
                    dataKey="pain"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 6 }}
                    name="Pain Level"
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 6 }}
                    name="Mood Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="text-lg">Activity & Sleep Performance</CardTitle>
            <CardDescription>Daily activity completion and sleep hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                  <Bar dataKey="activities" fill="hsl(var(--chart-3))" name="Activity %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sleep" fill="hsl(var(--chart-4))" name="Sleep Hours" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Highlights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span>Achievements This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Pain levels consistently below 4/10</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Completed all physical therapy exercises</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Improved sleep quality by 0.5 hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Maintained positive mood 6/7 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              <span>Areas for Focus</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Hydration goals missed 2 days</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Slight pain increase on Friday</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Consider earlier bedtime routine</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Recovery Progress</CardTitle>
          <CardDescription>Progress towards recovery milestones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pain Management</span>
              <span className="text-sm text-muted-foreground">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mobility & Movement</span>
              <span className="text-sm text-muted-foreground">78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Wound Healing</span>
              <span className="text-sm text-muted-foreground">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Recovery</span>
              <span className="text-sm text-muted-foreground">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
