import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default function Dashboard() {
  return <DashboardPage />;
}
