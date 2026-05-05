import { createClient } from "@/utils/supabase/server";
import { ArtisanView } from "@/components/dashboard/ArtisanView";
import { ClientView } from "@/components/dashboard/ClientView";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = user.user_metadata?.role || "client";

  return (
    <>
      {role === "artisan" ? (
        <ArtisanView user={user} />
      ) : (
        <ClientView user={user} />
      )}
    </>
  );
}
