import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ClipboardList, Clock, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import DownloadInvoiceButton from "@/components/dashboard/DownloadInvoiceButton";

export default async function ClientRequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch client's missions
  const { data: missions } = await supabase
    .from("missions")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Suivi des Interventions</p>
          <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Mes Demandes
          </h1>
        </div>
        <Link href="/demander" className="btn btn-primary">
          Nouvelle Demande
        </Link>
      </header>

      <div className="grid gap-6">
        {missions && missions.length > 0 ? (
          missions.map((mission) => (
            <div key={mission.id} className="card p-6 bg-white border border-border rounded-3xl shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    mission.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                    mission.status === 'completed' ? 'bg-green-50 text-green-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    <ClipboardList size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-primary-dk">{mission.title}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        mission.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        mission.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {mission.status === 'pending' ? 'En attente' : 
                         mission.status === 'confirmed' ? 'Confirmée' : 
                         mission.status === 'completed' ? 'Terminée' : mission.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-text-muted font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> 
                        {new Date(mission.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> {mission.location || "Adresse non spécifiée"}
                      </span>
                      <span className="font-bold text-primary-dk">{mission.price}€</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex-1 md:flex-none px-6 py-3 bg-bg-alt rounded-2xl text-sm font-bold text-primary-dk hover:bg-border transition-colors">
                    Détails
                  </button>
                  {mission.status === 'completed' && (
                    <DownloadInvoiceButton 
                      mission={mission} 
                      className="flex-1 md:flex-none px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    />
                  )}
                  <div className="hidden md:block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="text-border" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-16 bg-white border border-dashed border-border rounded-[3rem] text-center">
            <div className="w-20 h-20 bg-bg-alt rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
              <ClipboardList size={40} />
            </div>
            <h2 className="text-2xl font-bold text-primary-dk mb-2">Aucune demande en cours</h2>
            <p className="text-text-muted max-w-sm mx-auto mb-8">
              Vous n'avez pas encore formulé de demande d'intervention. Un problème technique ? Nous sommes là pour vous aider.
            </p>
            <Link href="/demander" className="btn btn-primary px-8">
              Faire ma première demande
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
