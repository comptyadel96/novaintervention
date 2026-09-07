import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { ClientRequestsList } from "@/components/dashboard/ClientRequestsList";

export default async function ClientRequestsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Suivi des interventions
          </p>
          <h1
            className="page-title mb-0"
          >
            Mes demandes
          </h1>
        </div>
        <Link href="/demander" className="btn btn-primary">
          Nouvelle demande
        </Link>
      </header>

      <ClientRequestsList customerId={session.user.id} />
    </div>
  );
}
