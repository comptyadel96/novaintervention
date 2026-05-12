"use client";

import { History, FileText, Calendar, ShieldCheck, MapPin, Mail, Phone, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { generateInvoicePDF } from "@/lib/pdf/invoice-generator";
import { useRouter } from "next/navigation";

export function ClientView({ user, profile }: { user: any, profile: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [missions, setMissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    history: 0,
    active: 0,
    documents: 0
  });

  useEffect(() => {
    async function fetchClientData() {
      const { data } = await supabase
        .from("missions")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setMissions(data);
        setStats({
          history: data.filter(m => m.status === 'completed').length,
          active: data.filter(m => m.status === 'pending' || m.status === 'confirmed').length,
          documents: data.filter(m => m.status === 'completed').length, // Assuming 1 doc per completed mission
        });
      }
    }
    fetchClientData();
  }, [user.id, supabase]);

  const handleConfirmWork = async (missionId: string) => {
    try {
      const { error } = await supabase
        .from("missions")
        .update({ 
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", missionId);

      if (error) throw error;
      router.refresh(); // Refresh to catch updated state
      window.location.reload(); // Force reload to refresh local missions state
    } catch (err) {
      console.error("Error confirming work:", err);
      alert("Erreur lors de la validation des travaux.");
    }
  };

  const displayName = profile?.first_name || user.user_metadata?.first_name || "Client";
  const displayPhone = profile?.phone || user.user_metadata?.phone || "Non spécifié";
  const displayRole = profile?.role || user.user_metadata?.role || "Client";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Espace Client • Carnet Nova</p>
          <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Ravi de vous revoir, {displayName}
          </h1>
        </div>
        
        {/* User Quick Info */}
        <div className="flex flex-wrap gap-4 p-4 bg-white border border-border rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
            <Mail size={16} className="text-primary" />
            {user.email}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
            <Phone size={16} className="text-primary" />
            {displayPhone}
          </div>
          {profile?.city && (
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <MapPin size={16} className="text-primary" />
              {profile.city}
            </div>
          )}
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider">
            Compte {displayRole}
          </div>
        </div>
      </header>

      {/* SECTION VALIDATION TRAVAUX (Lifecycle Phase 4) */}
      {missions.filter(m => m.status === 'waiting_confirmation').length > 0 && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-[2.5rem] p-8 shadow-xl shadow-orange-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-600 text-white p-2 rounded-xl">
                 <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-orange-900 leading-none">Validez vos travaux</h2>
                <p className="text-sm text-orange-800 mt-2 font-medium">L'artisan a terminé son intervention. Veuillez confirmer la fin des travaux.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {missions.filter(m => m.status === 'waiting_confirmation').map((m) => (
                <div key={m.id} className="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-primary-dk mb-4">Intervention : {m.title}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest text-center">Avant</p>
                      <img src={m.photo_before || m.photo_url} alt="Avant" className="w-full h-32 object-cover rounded-2xl border border-border" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest text-center">Après</p>
                      <img src={m.photo_after} alt="Après" className="w-full h-32 object-cover rounded-2xl border border-green-200" />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConfirmWork(m.id)}
                    className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
                  >
                    Confirmer & Clôturer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Historique", count: stats.history.toString(), icon: History, color: "text-primary", bg: "bg-primary/5" },
          { label: "En cours", count: stats.active.toString(), icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Documents", count: stats.documents.toString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Garanties", count: "Active", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50" },
        ].map((item, i) => (
          <div key={i} className="card p-5 bg-white border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
              <item.icon size={20} />
            </div>
            <p className="text-2xl font-black text-primary-dk mb-1">{item.count}</p>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Carnet Nova Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Historique */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-primary-dk">Historique des interventions</h2>
              <Link href="/dashboard/requests" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Voir tout</Link>
            </div>
            
            <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {missions.length > 0 ? missions.slice(0, 3).map((job, i) => (
                <div key={i} className="relative pl-12 group">
                  <div className="absolute left-0 top-1 w-9 h-9 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary mb-1">
                        {new Date(job.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 className="text-lg font-bold text-primary-dk mb-1">{job.title}</h3>
                      <div className="flex gap-4 text-xs text-text-muted font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || "Adresse..."}</span>
                        <span>•</span>
                        <span className={job.status === 'completed' ? 'text-green-600' : 'text-orange-500'}>
                          {job.status === 'completed' ? 'Terminé' : job.status === 'waiting_confirmation' ? 'Attente Validation' : 'En cours'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary-dk mb-1">{job.price} €</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {job.status === 'completed' ? 'Facture Payée' : 'Paiement en attente'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-bg-alt rounded-xl text-xs font-bold text-primary-dk hover:bg-border transition-colors">Détails</button>
                    {job.status === 'completed' && (
                      <button 
                        onClick={() => generateInvoicePDF(job)}
                        className="px-4 py-2 bg-bg-alt rounded-xl text-xs font-bold text-primary-dk hover:bg-border transition-colors"
                      >
                        Facture PDF
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-text-muted italic">Aucune intervention enregistrée pour le moment.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Space */}
        <aside className="space-y-6">
          <div className="card p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold mb-2">Besoin d'aide ?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Un problème urgent ? Nos techniciens interviennent en moins de 30 minutes.</p>
              <Link href="/demander" className="block w-full py-3 bg-white text-primary rounded-2xl font-black text-sm text-center uppercase tracking-wider hover:bg-opacity-90 transition-all">
                Nouvelle Demande
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} />
            </div>
            <h4 className="font-bold text-primary-dk mb-1">Messagerie Express</h4>
            <p className="text-xs text-text-muted mb-4">Chat direct avec votre artisan pour un suivi optimal.</p>
            <button className="w-full py-2 bg-bg-alt rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted cursor-not-allowed">
              Indisponible
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
