import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getAccessToken } from "@/lib/auth/session";
import { missionsApi } from "@/services/api/missions";
import type { Mission } from "@/types/domain";

export default async function DashboardPlanningPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const token = await getAccessToken();
  let events: Mission[] | null = null;
  let error: string | null = null;

  if (token) {
    try {
      events = await missionsApi.list(token, {
        artisan_id: session.user.id,
      });
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Impossible de charger le planning.";
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Planning
          </p>
          <h1
            className="page-title mb-0"
          >
            Agenda des interventions
          </h1>
          <p className="mt-3 text-sm text-text-muted max-w-2xl">
            Planifiez vos interventions et suivez les prochaines dates de vos
            chantiers.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn btn-outline btn-sm self-start sm:self-auto"
        >
          Retour au tableau de bord
        </Link>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[0.7fr_0.3fr] gap-8">
        <div className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-primary-dk">
              Calendrier des rendez-vous
            </h2>
            <span className="text-sm uppercase tracking-[0.25em] text-text-muted">
              Échéances
            </span>
          </div>

          {error ? (
            <div className="rounded-4xl bg-red-50 border border-red-200 p-6 text-red-700">
              {error}
            </div>
          ) : !events || events.length === 0 ? (
            <div className="rounded-4xl bg-bg-alt p-8 text-center text-text-muted">
              Aucun événement planifié pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-4xl bg-bg-alt p-5 border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-sm font-bold text-primary-dk">
                      {event.scheduled_at
                        ? new Date(event.scheduled_at).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            },
                          )
                        : "Date inconnue"}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-text-muted">
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-primary-dk mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-text-muted">{event.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card rounded-4xl bg-white border border-border p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-text-muted mb-4">
              Résumé
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Événements prochains</span>
                <span className="font-bold text-primary-dk">
                  {events?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Réservations confirmées</span>
                <span className="font-bold text-primary-dk">
                  {events?.filter((event) => event.status === "confirmed")
                    .length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Interventions spécialisées</span>
                <span className="font-bold text-primary-dk">
                  {events?.filter((event) => event.status === "completed")
                    .length ?? 0}
                </span>
              </div>
            </div>
          </div>
          <div className="card rounded-4xl bg-bg-alt border border-border p-6">
            <p className="text-sm font-bold text-primary-dk mb-2">Astuce</p>
            <p className="text-sm text-text-muted">
              Mettez à jour vos disponibilités sur votre page Profil pour
              recevoir des demandes pertinentes.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
