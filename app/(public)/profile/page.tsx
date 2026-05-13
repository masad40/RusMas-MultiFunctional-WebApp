import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile/ProfilePage";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile",
};

export default function Profile() {
  return <ProfilePage />;
}
