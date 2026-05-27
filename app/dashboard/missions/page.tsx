import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ArtisanMissionsList } from "@/components/dashboard/ArtisanMissionsList";
import { ArtisanMissionsMapSection } from "@/components/dashboard/ArtisanMissionsMapSection";

export default async function DashboardMissionsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Missions
          </p>
          <h1
            className="text-4xl font-extrabold text-primary-dk tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mes interventions
          </h1>
          <p className="mt-3 text-sm text-text-muted max-w-2xl">
            Démarrez, terminez et confirmez vos interventions. Le client valide
            les travaux après votre photo « après ».
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn btn-outline btn-sm self-start sm:self-auto"
        >
          Retour au tableau de bord
        </Link>
      </header>

      <ArtisanMissionsMapSection activeMissions={[]} />

      <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
        <ArtisanMissionsList artisanId={session.user.id} />
      </section>
    </div>
  );
}
