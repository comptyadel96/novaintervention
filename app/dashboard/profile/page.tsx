import { redirect } from "next/navigation";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { getSession } from "@/lib/auth/session";

export default async function DashboardProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <ProfilePageClient user={session.user} profile={session.profile} />
  );
}
