import { ArtisanView } from "@/components/dashboard/ArtisanView";
import { ClientView } from "@/components/dashboard/ClientView";
import { AdminView } from "@/components/dashboard/AdminView";
import { redirect } from "next/navigation";
import { getSession, getAccessToken } from "@/lib/auth/session";
import { resolveRole } from "@/lib/auth/display";
import { buildArtisanStats } from "@/lib/dashboard/artisan-stats";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user, profile } = session;
  const role = resolveRole(user, profile);

  let stats = null;
  if (role === "artisan") {
    const token = await getAccessToken();
    if (token) {
      try {
        stats = await buildArtisanStats(token, user.id);
      } catch {
        stats = {
          totalRevenue: 0,
          monthlyRevenue: 0,
          weeklyMissionsCount: 0,
          activeClients: 0,
          recentMissions: [],
          confirmedMissions: [],
          availableMissions: [],
        };
      }
    }
  }

  return (
    <>
      {role === "admin" ? (
        <AdminView user={user} profile={profile} />
      ) : role === "artisan" ? (
        <ArtisanView user={user} profile={profile} stats={stats} />
      ) : (
        <ClientView user={user} profile={profile} />
      )}
    </>
  );
}
