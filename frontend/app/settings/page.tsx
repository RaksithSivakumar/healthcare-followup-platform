import { SettingsSystem } from "@/components/settings/settings-system"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"

export default function SettingsPage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account, preferences, and privacy settings</p>
        </div>
        <SettingsSystem />
      </div>
    </LayoutWrapper>
  )
}
