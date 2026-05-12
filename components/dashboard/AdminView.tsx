"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Briefcase, DollarSign, ShieldCheck, Search, CheckCircle2, XCircle } from "lucide-react";

export function AdminView({ user, profile }: { user: any; profile: any }) {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "artisans" | "missions">("overview");

  useEffect(() => {
    async function fetchData() {
      const { data: pData } = await supabase.from("profiles").select("*");
      if (pData) setProfiles(pData);

      const { data: mData } = await supabase.from("missions").select("*, artisan:profiles!missions_artisan_id_fkey(first_name, last_name)").order("created_at", { ascending: false });
      if (mData) setMissions(mData);
    }
    fetchData();
  }, [supabase]);

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: !currentStatus })
      .eq("id", id);
    if (!error) {
      setProfiles(profiles.map(p => p.id === id ? { ...p, is_verified: !currentStatus } : p));
    } else {
      alert("Erreur lors de la modification.");
    }
  };

  const artisans = profiles.filter(p => p.role === "artisan");
  const pendingMissions = missions.filter(m => m.status === "pending" || m.status === "confirmed" || m.status === "in_progress" || m.status === "waiting_confirmation");
  
  // Total Revenue calculation (all completed missions price sum)
  const completedMissions = missions.filter(m => m.status === 'completed');
  const totalVolume = completedMissions.reduce((acc, m) => acc + (Number(m.price) || 0), 0);
  const platformFee = totalVolume * 0.20;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Accès Restreint • Super Admin</p>
          <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Tour de Contrôle Nova
          </h1>
        </div>
        <div className="flex bg-white rounded-2xl p-1 border border-border shadow-sm">
          {(["overview", "artisans", "missions"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab ? "bg-red-50 text-red-600 shadow-sm" : "text-text-muted hover:text-primary-dk"
              }`}
            >
              {tab === "overview" ? "Vue d'ensemble" : tab === "artisans" ? "Artisans" : "Missions"}
            </button>
          ))}
        </div>
      </header>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Briefcase size={20} />
              </div>
              <p className="text-2xl font-black text-primary-dk mb-1">{missions.length}</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Missions Totales</p>
            </div>
            <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <p className="text-2xl font-black text-primary-dk mb-1">{artisans.length}</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Artisans Inscrits</p>
            </div>
            <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <DollarSign size={20} />
              </div>
              <p className="text-2xl font-black text-primary-dk mb-1">{totalVolume.toLocaleString('fr-FR')} €</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Volume d'affaires</p>
            </div>
            <div className="card p-6 bg-red-600 text-white rounded-[2rem] shadow-lg shadow-red-600/20">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <p className="text-2xl font-black mb-1">{platformFee.toLocaleString('fr-FR')} €</p>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Commissions (20%)</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-[2.5rem] p-8">
            <h2 className="text-xl font-bold mb-4 text-primary-dk">Activité Récente</h2>
            <p className="text-text-muted">Des graphiques globaux seront intégrés ici.</p>
          </div>
        </div>
      )}

      {activeTab === "artisans" && (
        <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dk mb-6 flex items-center gap-2"><Users size={24} className="text-primary"/> Gestion des Artisans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Nom</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contact</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Spécialité</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Statut</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {artisans.map(a => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-bg-body transition-colors">
                    <td className="py-4 font-bold text-primary-dk">{a.first_name || "N/A"} {a.last_name || ""}</td>
                    <td className="py-4 text-sm text-text-muted">{a.email}<br/>{a.phone || "Pas de numéro"}</td>
                    <td className="py-4 text-sm font-medium text-primary">{a.specialty || "Généraliste"}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${a.is_verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {a.is_verified ? "Vérifié" : "En attente"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => toggleVerification(a.id, !!a.is_verified)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 ml-auto text-xs font-bold uppercase tracking-widest transition-colors ${
                          a.is_verified ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20"
                        }`}
                      >
                        {a.is_verified ? <><XCircle size={14}/> Révoquer</> : <><CheckCircle2 size={14}/> Valider Profil</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "missions" && (
        <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dk mb-6 flex items-center gap-2"><Briefcase size={24} className="text-primary"/> Historique des Missions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Mission</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Artisan Assigné</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider">Prix</th>
                  <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Statut</th>
                </tr>
              </thead>
              <tbody>
                {missions.map(m => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-bg-body transition-colors">
                    <td className="py-4 text-sm font-medium text-text-muted">{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="py-4 font-bold text-primary-dk">{m.title}</td>
                    <td className="py-4 text-sm font-medium text-primary">
                      {m.artisan ? `${m.artisan.first_name || ""} ${m.artisan.last_name || ""}` : "Non assigné"}
                    </td>
                    <td className="py-4 font-black text-primary-dk">{m.price ? `${m.price} €` : "—"}</td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        m.status === 'completed' ? 'bg-green-100 text-green-700' : m.status === 'waiting_confirmation' ? 'bg-orange-100 text-orange-700' : m.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
