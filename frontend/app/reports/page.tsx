import { MainLayout } from "@/components/layout/main-layout"
import { ReportsSystem } from "@/components/reports/reports-system"

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Health Reports</h1>
            <p className="text-muted-foreground">Comprehensive analytics and reports for your recovery journey</p>
          </div>
        </div>
        <ReportsSystem />
      </div>
    </MainLayout>
  )
}
