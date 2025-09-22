"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, TrendingUp, Award, Target, CheckCircle } from "lucide-react"

const monthlyTrends = [
  { week: "Week 1", pain: 7.2, mood: 2.5, recovery: 25, activities: 60 },
  { week: "Week 2", pain: 5.8, mood: 3.2, recovery: 45, activities: 75 },
  { week: "Week 3", pain: 4.1, mood: 3.8, recovery: 65, activities: 85 },
  { week: "Week 4", pain: 2.7, mood: 4.1, recovery: 85, activities: 89 },
]

const achievementData = [
  { name: "Completed", value: 12, color: "#10b981" },
  { name: "In Progress", value: 3, color: "#f59e0b" },
  { name: "Upcoming", value: 5, color: "#6b7280" },
]

const monthlyStats = [
  { title: "Pain Reduction", value: "62%", description: "From 7.2 to 2.7 average", icon: TrendingUp },
  { title: "Mood Improvement", value: "64%", description: "Consistent positive trend", icon: CheckCircle },
  { title: "Recovery Progress", value: "85%", description: "Ahead of schedule", icon: Target },
  { title: "Achievements", value: "12", description: "Milestones completed", icon: Award },
]

export function MonthlyReport() {
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
                <Calendar className="h-5 w-5" />
                <span>Monthly Recovery Report</span>
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                December 2024 • Post-Surgery Month 1
              </CardDescription>
            </div>
            <Badge className="bg-purple-500">Month 1</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Monthly Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {monthlyStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="animate-fade-in-up hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">{stat.title}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Trends Chart */}
      <Card className="glass glass-dark">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Recovery Trends</CardTitle>
          <CardDescription>Comprehensive view of your recovery progress over the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                <Area
                  type="monotone"
                  dataKey="recovery"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                  name="Recovery %"
                />
                <Area
                  type="monotone"
                  dataKey="activities"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                  name="Activities %"
                />
                <Line
                  type="monotone"
                  dataKey="pain"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 6 }}
                  name="Pain Level"
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 6 }}
                  name="Mood Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="text-lg">Achievement Overview</CardTitle>
            <CardDescription>Your milestone completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={achievementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {achievementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {achievementData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-dark">
          <CardHeader>
            <CardTitle className="text-lg">Recovery Milestones</CardTitle>
            <CardDescription>Key achievements this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">First Independent Walk</div>
                  <div className="text-sm text-muted-foreground">Week 1 - Day 5</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Pain Below 5/10</div>
                  <div className="text-sm text-muted-foreground">Week 2 - Sustained</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Physical Therapy Started</div>
                  <div className="text-sm text-muted-foreground">Week 2 - Day 14</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Wound Healing 85%</div>
                  <div className="text-sm text-muted-foreground">Week 4 - Ahead of schedule</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Monthly Summary</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Overall assessment of your recovery progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Excellent Progress</h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Pain reduced by 62%</li>
                <li>• Mood consistently improved</li>
                <li>• All major milestones met</li>
                <li>• Wound healing ahead of schedule</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Key Achievements</h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• 12 recovery milestones completed</li>
                <li>• 89% activity completion rate</li>
                <li>• Consistent medication adherence</li>
                <li>• Improved sleep quality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Next Month Goals</h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Complete physical therapy program</li>
                <li>• Achieve 95% recovery</li>
                <li>• Return to normal activities</li>
                <li>• Maintain positive trends</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
