"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", heartRate: 68, bloodPressure: 118, temperature: 98.4 },
  { day: "Tue", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
  { day: "Wed", heartRate: 70, bloodPressure: 115, temperature: 98.5 },
  { day: "Thu", heartRate: 74, bloodPressure: 122, temperature: 98.7 },
  { day: "Fri", heartRate: 69, bloodPressure: 119, temperature: 98.6 },
  { day: "Sat", heartRate: 71, bloodPressure: 121, temperature: 98.5 },
  { day: "Sun", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
]

export function HealthChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={{ stroke: "hsl(var(--border))" }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
            name="Heart Rate (BPM)"
          />
          <Line
            type="monotone"
            dataKey="bloodPressure"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
            name="Blood Pressure (Systolic)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
