import { createClient } from "@/utils/supabase/server";
import { ArtisanView } from "@/components/dashboard/ArtisanView";
import { ClientView } from "@/components/dashboard/ClientView";
import { AdminView } from "@/components/dashboard/AdminView";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch detailed profile from our new profiles table
  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist (e.g. user existed before the trigger), create it now
  if (!profile && profileError) {
    console.log("DEBUG: Profile missing for user, provisioning now...", user.id);
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
        phone: user.user_metadata?.phone,
        role: user.user_metadata?.role || "client"
      })
      .select()
      .single();
    
    if (!insertError) {
      profile = newProfile;
    }
  }

  const role = profile?.role || user.user_metadata?.role || "client";

  let stats = null;
  if (role === "artisan") {
    // Fetch real stats for artisan
    const { data: missions } = await supabase
      .from("missions")
      .select("*")
      .eq("artisan_id", user.id);

    const { data: availableMissions } = await supabase
      .from("missions")
      .select("*")
      .is("artisan_id", null)
      .eq("status", "pending");

    if (missions) {
      const completedMissions = missions.filter(m => m.status === "completed");
      const confirmedMissions = missions.filter(m => m.status === "confirmed");
      const totalRevenue = completedMissions.reduce((acc, m) => acc + (Number(m.price) || 0), 0);
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyMissions = completedMissions.filter(m => m.scheduled_at && new Date(m.scheduled_at) >= startOfMonth);
      const monthlyRevenue = monthlyMissions.reduce((acc, m) => acc + (Number(m.price) || 0), 0);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      const weeklyMissionsCount = missions.filter(m => m.created_at && new Date(m.created_at) >= startOfWeek).length;

      const uniqueClients = new Set(missions.map(m => m.customer_name)).size;

      stats = {
        totalRevenue,
        monthlyRevenue,
        weeklyMissionsCount,
        activeClients: uniqueClients,
        recentMissions: missions
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 3),
        confirmedMissions: confirmedMissions || []
      };
    }
    
    // Add available missions to stats object to pass to ArtisanView
    if (stats) {
      (stats as any).availableMissions = availableMissions || [];
    } else {
      stats = { 
        totalRevenue: 0, 
        monthlyRevenue: 0, 
        weeklyMissionsCount: 0, 
        activeClients: 0, 
        recentMissions: [],
        confirmedMissions: [],
        availableMissions: availableMissions || []
      } as any;
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
