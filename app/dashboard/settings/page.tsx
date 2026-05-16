import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function DashboardSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
          Paramètres
        </p>
        <h1
          className="text-4xl font-extrabold text-primary-dk tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Réglages du compte
        </h1>
      </header>

      <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
        <SettingsForm user={user} />
      </section>
    </div>
  );
}
