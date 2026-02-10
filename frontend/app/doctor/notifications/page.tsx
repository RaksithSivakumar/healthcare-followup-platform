"use client";

import dynamic from "next/dynamic";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";

const NotificationSystem = dynamic(
  () =>
    import("@/components/doctor/notification-system").then(
      (m) => m.NotificationSystem
    ),
  { ssr: false }
);

export default function NotificationsPage() {
  return (
    <LayoutWrapper>
      <NotificationSystem />
    </LayoutWrapper>
  );
}
