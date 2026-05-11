import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Mission = {
  id: string;
  title: string;
  status: string;
  scheduled_at: string | null;
  customer_name: string;
  location: string;
  price: number | string | null;
};

export default async function DashboardMissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("missions")
    .select("id, title, status, scheduled_at, customer_name, location, price")
    .eq("artisan_id", user.id)
    .order("scheduled_at", { ascending: true });

  const missions = data as Mission[] | null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Missions</p>
          <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Mes interventions
          </h1>
          <p className="mt-3 text-sm text-text-muted max-w-2xl">
            Retrouvez l’historique de vos interventions, accédez aux missions en cours et suivez les prochaines dates.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline btn-sm self-start sm:self-auto">
          Retour au tableau de bord
        </Link>
      </header>

      <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <p className="text-sm text-text-muted">Missions enregistrées</p>
            <p className="text-2xl font-black text-primary-dk">{missions?.length ?? 0}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-bg-alt p-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Confirmées</p>
              <p className="text-xl font-black text-primary-dk">{missions?.filter((m: Mission) => m.status === "confirmed").length ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-bg-alt p-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">En attente</p>
              <p className="text-xl font-black text-primary-dk">{missions?.filter((m: Mission) => m.status === "pending").length ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-bg-alt p-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Terminées</p>
              <p className="text-xl font-black text-primary-dk">{missions?.filter((m: Mission) => m.status === "completed").length ?? 0}</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-4xl bg-red-50 border border-red-200 p-6 text-red-700">
            Impossible de récupérer les interventions. Vérifiez la configuration Supabase.
          </div>
        ) : !missions || missions.length === 0 ? (
          <div className="rounded-4xl bg-bg-alt p-8 text-center text-text-muted">
            Aucune mission trouvée pour le moment. Commencez par accepter une demande depuis votre espace client.
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map((mission: Mission) => (
              <div key={mission.id} className="rounded-4xl bg-white border border-border p-6 shadow-sm hover:border-primary/20 transition-colors">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-text-muted mb-2">{mission.scheduled_at ? new Date(mission.scheduled_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "Date inconnue"}</p>
                    <h2 className="text-xl font-bold text-primary-dk">{mission.title}</h2>
                    <p className="text-sm text-text-muted">{mission.location} • {mission.customer_name}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full bg-bg-alt px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-dk">
                      {mission.status}
                    </span>
                    <p className="text-lg font-black text-primary-dk">{mission.price ?? "--"} €</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
