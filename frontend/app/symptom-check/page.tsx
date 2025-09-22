import { MainLayout } from "@/components/layout/main-layout"
import { SymptomChecker } from "@/components/symptom-check/symptom-checker"

export default function SymptomCheckPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Symptom Check</h1>
            <p className="text-muted-foreground">Monitor your recovery and track any changes</p>
          </div>
        </div>
        <SymptomChecker />
      </div>
    </MainLayout>
  )
}
