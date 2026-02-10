import dynamic from "next/dynamic"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"

const AddPatientForm = dynamic(
  () => import("@/components/doctor/add-patients").then((m) => m.AddPatientForm),
  { ssr: false }
)

export default function AddPatientPage() {
  return (
    <LayoutWrapper>
      <AddPatientForm />
    </LayoutWrapper>
  )
}