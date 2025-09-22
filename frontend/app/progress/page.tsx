import { MainLayout } from "@/components/layout/main-layout"
import { ProgressTracker } from "@/components/progress/progress-tracker"

export default function ProgressPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recovery Progress</h1>
            <p className="text-muted-foreground">Track your healing journey and celebrate milestones</p>
          </div>
        </div>
        <ProgressTracker />
      </div>
    </MainLayout>
  )
}
