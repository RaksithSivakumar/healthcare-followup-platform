"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Activity, Heart, Target } from "lucide-react"

const painMoodData = [
  { day: "Day 1", pain: 8, mood: 2, recovery: 10 },
  { day: "Day 3", pain: 7, mood: 2, recovery: 20 },
  { day: "Day 5", pain: 6, mood: 3, recovery: 35 },
  { day: "Day 7", pain: 5, mood: 3, recovery: 45 },
  { day: "Day 9", pain: 4, mood: 4, recovery: 60 },
  { day: "Day 11", pain: 4, mood: 4, recovery: 70 },
  { day: "Day 13", pain: 3, mood: 4, recovery: 80 },
  { day: "Day 14", pain: 3, mood: 4, recovery: 85 },
]

const weeklyProgress = [
  { week: "Week 1", mobility: 20, strength: 15, endurance: 10 },
  { week: "Week 2", mobility: 45, strength: 35, endurance: 25 },
  { week: "Current", mobility: 75, strength: 60, endurance: 50 },
]

const dailyActivities = [
  { activity: "Walking", completed: 85, target: 100 },
  { activity: "Exercises", completed: 92, target: 100 },
  { activity: "Medication", completed: 100, target: 100 },
  { activity: "Sleep", completed: 78, target: 100 },
  { activity: "Hydration", completed: 65, target: 100 },
]

export function ProgressCharts() {
  return (
    <div className="space-y-6">
      {/* Pain and Mood Trends */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Pain & Mood Trends</span>
            </CardTitle>
            <CardDescription>Daily tracking showing improvement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={painMoodData}>
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
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Recovery Progress</span>
            </CardTitle>
            <CardDescription>Overall recovery percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={painMoodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                  <Area
                    type="monotone"
                    dataKey="recovery"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Recovery %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-500" />
            <span>Weekly Progress Comparison</span>
          </CardTitle>
          <CardDescription>Mobility, strength, and endurance improvements by week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                <Bar dataKey="mobility" fill="hsl(var(--chart-1))" name="Mobility" radius={[4, 4, 0, 0]} />
                <Bar dataKey="strength" fill="hsl(var(--chart-2))" name="Strength" radius={[4, 4, 0, 0]} />
                <Bar dataKey="endurance" fill="hsl(var(--chart-3))" name="Endurance" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Activities Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Today's Activities</span>
          </CardTitle>
          <CardDescription>Progress on daily health activities and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyActivities.map((activity, index) => (
              <div
                key={activity.activity}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{activity.activity}</span>
                  <span className="text-sm text-muted-foreground">
                    {activity.completed}% of {activity.target}%
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${activity.completed}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{activity.completed}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
