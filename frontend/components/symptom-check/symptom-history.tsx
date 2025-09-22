"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const mockHistoryData = [
  { date: "2024-01-15", pain: 7, symptoms: ["Pain", "Swelling", "Redness"], notes: "Post-surgery day 1" },
  { date: "2024-01-17", pain: 6, symptoms: ["Pain", "Swelling"], notes: "Swelling reduced slightly" },
  { date: "2024-01-19", pain: 5, symptoms: ["Pain", "Itching"], notes: "Redness gone, some itching" },
  { date: "2024-01-21", pain: 4, symptoms: ["Pain"], notes: "Much better, minimal pain" },
  { date: "2024-01-23", pain: 3, symptoms: ["Itching"], notes: "Healing well" },
  { date: "2024-01-25", pain: 2, symptoms: [], notes: "Almost no symptoms" },
]

const chartData = mockHistoryData.map((entry, index) => ({
  day: `Day ${index + 1}`,
  pain: entry.pain,
  symptoms: entry.symptoms.length,
}))

export function SymptomHistory() {
  return (
    <div className="space-y-8">
      {/* Pain Trend Chart */}
      <Card className="bg-card/70 dark:bg-card-dark/60 backdrop-blur-lg border border-border/50 dark:border-border-dark/50 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground dark:text-foreground-dark">
            <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400 animate-bounce" />
            Pain Level Trend
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground-dark">
            Your pain levels over time showing improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }} 
                  axisLine={{ stroke: "hsl(var(--border))" }} 
                  tickLine={{ stroke: "hsl(var(--border))" }} 
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }} 
                  axisLine={{ stroke: "hsl(var(--border))" }} 
                  tickLine={{ stroke: "hsl(var(--border))" }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))", 
                    borderRadius: "12px", 
                    color: "hsl(var(--foreground))",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"
                  }} 
                  labelStyle={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }} 
                />
                <Line
                  type="monotone"
                  dataKey="pain"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 6 }}
                  name="Pain Level"
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="symptoms"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ fill: "var(--chart-2)", strokeWidth: 2, r: 4 }}
                  name="Symptom Count"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="bg-card/70 dark:bg-card-dark/60 backdrop-blur-lg border border-border/50 dark:border-border-dark/50 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground dark:text-foreground-dark">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            Recent Symptom Logs
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground-dark">
            Your latest symptom entries and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistoryData
              .slice()
              .reverse()
              .map((entry, index) => {
                const painLevel = entry.pain;
                let badgeColor = "bg-green-400 text-white dark:bg-green-700";
                if (painLevel > 7) badgeColor = "bg-red-500 text-white dark:bg-red-700";
                else if (painLevel > 4) badgeColor = "bg-yellow-400 text-black dark:bg-yellow-600 dark:text-white";

                return (
                  <motion.div
                    key={entry.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 dark:bg-muted-dark/30 rounded-xl backdrop-blur-md border border-border/40 dark:border-border-dark/40 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      {entry.pain <= 3 ? (
                        <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                      ) : entry.pain <= 6 ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-400 dark:text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
                      )}
                      <span className="font-medium text-foreground dark:text-foreground-dark">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge className={`px-3 py-1 font-semibold shadow-md ${badgeColor}`}>
                        Pain: {entry.pain}/10
                      </Badge>
                      {entry.symptoms.length > 0 && (
                        <Badge className="px-3 py-1 font-semibold shadow-md bg-blue-500 text-white dark:bg-blue-700">
                          {entry.symptoms.length} symptoms
                        </Badge>
                      )}
                    </div>
                    {entry.notes && <p className="mt-2 sm:mt-0 text-sm text-muted-foreground dark:text-muted-foreground-dark">{entry.notes}</p>}
                  </motion.div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
