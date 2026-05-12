"use client";

import { BarChart3, CalendarDays, CheckCircle2, Clock, MapPin, PieChart, ShieldCheck, TrendingUp, Users, Wallet, Check, X, BellDot, Mail, ShieldAlert } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DownloadInvoiceButton from "./DownloadInvoiceButton";
import dynamic from 'next/dynamic';

const ArtisanMap = dynamic(() => import('./ArtisanMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] rounded-[2.5rem] bg-bg-alt border border-border animate-pulse flex items-center justify-center"><p className="text-sm font-bold text-text-muted">Chargement du Radar Live...</p></div>
});


const graphPanels = [
  {
    title: "Clients cette semaine",
    subtitle: "+18%",
    points: [40, 55, 75, 62, 85, 90, 78],
    labels: ["L", "M", "M", "J", "V", "S", "D"],
  },
  {
    title: "Revenus du mois",
    subtitle: "+14%",
    points: [50, 60, 72, 80, 90, 95, 110],
    labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
  },
  {
    title: "6 derniers mois",
    subtitle: "+32%",
    points: [62, 70, 74, 82, 88, 96],
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
  },
  {
    title: "Performance annuelle",
    subtitle: "+42%",
    points: [68, 72, 75, 80, 86, 92, 98],
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7"],
  },
];

interface ArtisanViewProps {
  user: any;
  profile: any;
  stats: {
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyMissionsCount: number;
    activeClients: number;
    recentMissions: any[];
    availableMissions?: any[];
    confirmedMissions?: any[];
  } | null;
}

export function ArtisanView({ user, profile, stats }: ArtisanViewProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (profile?.is_verified === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-4xl font-black text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>En cours de vérification</h1>
        <p className="text-text-muted max-w-md text-base leading-relaxed">
          Notre équipe examine actuellement votre profil d'artisan pour garantir la qualité de la plateforme Nova. 
          Vous pourrez accéder aux interventions et commencer à générer des revenus dès votre validation.
        </p>
        <button onClick={() => alert("Le support sera bientôt disponible.")} className="px-6 py-3 bg-bg-alt text-primary font-bold rounded-xl mt-4 hover:bg-border transition-colors uppercase tracking-widest text-[10px]">
          Contacter le support
        </button>
      </div>
    );
  }

  const displayStats = stats || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyMissionsCount: 0,
    activeClients: 0,
    recentMissions: [],
    availableMissions: [],
    confirmedMissions: []
  };

  const handleAccept = async (missionId: string) => {
    setIsProcessing(missionId);
    try {
      const { error } = await supabase
        .from("missions")
        .update({ 
          artisan_id: user.id,
          status: "confirmed" 
        })
        .eq("id", missionId);

      if (error) throw error;
      
      router.refresh();
    } catch (err) {
      console.error("Error accepting mission:", err);
      alert("Erreur lors de l'acceptation de la mission.");
    } finally {
      setIsProcessing(null);
    }
  };


  const handleArrive = async (missionId: string) => {
    setIsProcessing(missionId);
    try {
      const { error } = await supabase
        .from("missions")
        .update({ 
          status: "in_progress",
          arrived_at: new Date().toISOString()
        })
        .eq("id", missionId);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Error marking arrival:", err);
      alert("Erreur lors de la validation de l'arrivée.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handlePhotoUpload = async (missionId: string, type: 'before' | 'after', file: File) => {
    setIsProcessing(`${missionId}-${type}`);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${missionId}_${type}_${Date.now()}.${fileExt}`;
      const filePath = `interventions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('interventions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('interventions')
        .getPublicUrl(filePath);

      const updateData = type === 'before' ? { photo_before: publicUrl } : { photo_after: publicUrl };
      const { error: updateError } = await supabase
        .from("missions")
        .update(updateData)
        .eq("id", missionId);

      if (updateError) throw updateError;
      router.refresh();
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Erreur lors de l'envoi de la photo.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleComplete = async (missionId: string) => {
    setIsProcessing(missionId);
    try {
      const { error } = await supabase
        .from("missions")
        .update({ status: "waiting_confirmation" })
        .eq("id", missionId);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Error completing mission:", err);
      alert("Erreur lors de la clôture de la mission.");
    } finally {
      setIsProcessing(null);
    }
  };

  const firstName = profile?.first_name || user.user_metadata?.first_name || "Artisan";
  const lastName = profile?.last_name || user.user_metadata?.last_name || "Nova";
  const displayName = `${firstName} ${lastName}`;
  const displayPhone = profile?.phone || user.user_metadata?.phone || "Non spécifié";
  const displayCity = profile?.city || user.user_metadata?.city || "France";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Tableau de bord Artisan</p>
          <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Bonjour, {firstName}
          </h1>
          <p className="mt-3 text-sm text-text-muted max-w-2xl">
            Gérez vos interventions en temps réel et suivez vos performances financières.
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-wrap items-center gap-6 p-6 bg-white border border-border rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users size={24} />
             </div>
             <div>
               <p className="text-sm font-bold text-primary-dk">{displayName}</p>
               <p className="text-xs text-text-muted truncate max-w-[150px]">{user.email}</p>
             </div>
          </div>
          <div className="h-10 w-px bg-border hidden sm:block"></div>
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Localisation</span>
             <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-primary" />
                <span className="text-xs font-bold text-primary-dk">{displayCity}</span>
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Téléphone</span>
             <span className="text-xs font-bold text-primary-dk">{displayPhone}</span>
          </div>
        </div>
      </header>
      
      {/* SECTION MISSIONS EN COURS */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-primary-dk">Missions actives</h2>
            <p className="text-sm text-text-muted mt-1">Interventions en cours de réalisation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStats.confirmedMissions && displayStats.confirmedMissions.length > 0 ? (
            displayStats.confirmedMissions.map((mission) => (
              <div key={mission.id} className="card p-6 bg-white border border-blue-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${mission.status === 'confirmed' ? "bg-blue-50 text-blue-700" : 
                        mission.status === 'in_progress' ? "bg-green-50 text-green-700" : 
                        "bg-orange-50 text-orange-700"}
                    `}>
                      {mission.status === 'confirmed' ? 'Acceptée' : 
                       mission.status === 'in_progress' ? 'En cours' : 'Attente Client'}
                    </span>
                    <span className="font-bold text-primary-dk">{mission.price}€</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary-dk mb-1">{mission.customer_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                    <MapPin size={12} className="text-primary" />
                    {mission.location}
                  </div>

                  {mission.photo_url && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-text-muted uppercase mb-2">Photo du client</p>
                      <img src={mission.photo_url} alt="Leak" className="w-full h-24 object-cover rounded-xl border border-border" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  {mission.status === 'confirmed' && (
                    <button 
                      onClick={() => handleArrive(mission.id)}
                      disabled={isProcessing === mission.id}
                      className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {isProcessing === mission.id ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"/> : "Je suis arrivé"}
                    </button>
                  )}

                  {mission.status === 'in_progress' && (
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border border-dashed transition-all cursor-pointer text-[10px] font-bold uppercase
                        ${mission.photo_before ? 'bg-green-50 border-green-200 text-green-700' : 'bg-bg-alt border-border text-text-muted hover:border-primary'}
                      `}>
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhotoUpload(mission.id, 'before', e.target.files[0])} />
                         {mission.photo_before ? 'Photo Avant ✅' : 'Photo Avant'}
                      </label>
                      <label className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border border-dashed transition-all cursor-pointer text-[10px] font-bold uppercase
                        ${mission.photo_after ? 'bg-green-50 border-green-200 text-green-700' : 'bg-bg-alt border-border text-text-muted hover:border-primary'}
                      `}>
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhotoUpload(mission.id, 'after', e.target.files[0])} />
                         {mission.photo_after ? 'Photo Après ✅' : 'Photo Après'}
                      </label>
                      <button 
                        disabled={!mission.photo_before || !mission.photo_after || isProcessing === mission.id}
                        onClick={() => handleComplete(mission.id)}
                        className="col-span-2 py-3 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                      >
                         Terminer la mission
                      </button>
                    </div>
                  )}

                  {mission.status === 'waiting_confirmation' && (
                    <div className="py-3 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold uppercase text-center border border-orange-100">
                      En attente du client
                    </div>
                  )}
                  
                  <button className="w-full py-3 bg-bg-alt rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <Mail size={12} /> Messagerie Nova
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 px-6 rounded-3xl bg-bg-alt border border-dashed border-border text-center">
              <p className="text-sm text-text-muted italic">Aucune mission en cours pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION MISSIONS DISPONIBLES (Style Uber) */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
            <BellDot size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-primary-dk">Missions disponibles</h2>
            <p className="text-sm text-text-muted mt-1">Interventions à proximité en attente d'artisan.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStats.availableMissions && displayStats.availableMissions.length > 0 ? (
            displayStats.availableMissions.map((mission) => (
              <div key={mission.id} className="card p-6 bg-white border-2 border-primary/10 rounded-[2rem] shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-bg-alt px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                      {mission.title}
                    </span>
                    <span className="text-primary font-black text-lg">{mission.price}€</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-dk mb-2">{mission.customer_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                    <MapPin size={14} className="text-primary" />
                    <span>{mission.location}</span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2 mb-6 italic">"{mission.description}"</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAccept(mission.id)}
                    disabled={!!isProcessing}
                    className="flex-1 btn btn-primary py-3 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20"
                  >
                    {isProcessing === mission.id ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Check size={16} /> Accepter
                      </>
                    )}
                  </button>
                  <button className="p-3 bg-bg-alt text-text-muted rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 px-6 rounded-4xl bg-bg-alt border border-dashed border-border text-center">
              <p className="text-sm text-text-muted italic">Aucune nouvelle demande d'intervention pour le moment. Restez à l'écoute !</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION CARTE INTERACTIVE */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ArtisanMap missions={[...(displayStats.availableMissions || []), ...(displayStats.confirmedMissions || [])]} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-8">
        <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-primary-dk">Portefeuille et performance</h2>
              <p className="text-sm text-text-muted mt-2">Visualisez votre activité et vos revenus sur les derniers cycles.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-sm font-bold text-primary-dk">
              <BarChart3 size={16} /> Suivi multi-périodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-4xl bg-bg-alt p-5 border border-border">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted mb-3">Revenus ce mois</p>
              <p className="text-3xl font-black text-primary-dk">{displayStats.monthlyRevenue.toLocaleString('fr-FR')} €</p>
              <p className="text-sm text-text-muted mt-2">Revenus basés sur les missions terminées.</p>
            </div>
            <div className="rounded-4xl bg-bg-alt p-5 border border-border">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted mb-3">Total facturé</p>
              <p className="text-3xl font-black text-primary-dk">{displayStats.totalRevenue.toLocaleString('fr-FR')} €</p>
              <p className="text-sm text-text-muted mt-2">Chiffre d'affaires cumulé sur votre compte.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Planning Express - Feature 4 */}
            <div className="rounded-4xl bg-white border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-primary" />
                  <p className="text-sm font-bold text-primary-dk">Planning Express</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Aujourd'hui</span>
              </div>
              <div className="space-y-3">
                {displayStats.confirmedMissions && displayStats.confirmedMissions.length > 0 ? (
                  displayStats.confirmedMissions.slice(0, 2).map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-bg-alt rounded-2xl border border-border/50">
                      <div className="w-2 h-10 bg-primary rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-primary-dk">{m.title}</p>
                        <p className="text-[10px] text-text-muted">{m.location}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-text-muted italic px-2">Aucun rendez-vous planifié aujourd'hui.</p>
                )}
              </div>
            </div>

            <div className="rounded-4xl bg-white border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-primary-dk">Opportunités clients</p>
                <span className="text-xs uppercase tracking-[0.25em] text-text-muted">A jour</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Nouvelles demandes', value: 5 },
                  { label: 'Devis envoyés', value: 3 },
                  { label: 'Clients chauds', value: 2 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">{item.label}</p>
                    <p className="text-base font-bold text-primary-dk">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-primary-dk">Comptabilité rapide</h2>
              <span className="text-xs uppercase tracking-[0.25em] text-text-muted">Bilan</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Total facturé', value: '9 120 €', icon: Wallet },
                { label: 'Paiements reçus', value: '7 850 €', icon: CheckCircle2 },
                { label: 'Factures à relancer', value: '2', icon: ShieldCheck },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-bg-alt p-4 border border-border flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-white border border-border flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-dk">{item.label}</p>
                    <p className="text-xl font-black text-primary-dk">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-text-muted">Suivi rapide des factures et des encaissements. Idéal pour garder une vue globale sans gestion comptable poussée.</p>
          </section>

          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-primary-dk">Clients récents</h2>
              <span className="text-xs uppercase tracking-[0.25em] text-text-muted">7 jours</span>
            </div>
            <div className="space-y-4">
              {displayStats.recentMissions.length > 0 ? displayStats.recentMissions.map((client) => (
                <div key={client.id} className="rounded-3xl bg-bg-alt p-4 border border-border">
                  <p className="font-bold text-primary-dk">{client.customer_name}</p>
                  <p className="text-sm text-text-muted">{client.title}</p>
                  <p className="text-sm font-bold text-primary-dk mt-2">{client.price ? `${client.price} €` : '--'}</p>
                </div>
              )) : (
                <p className="text-sm text-text-muted italic">Aucune mission récente.</p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-primary-dk">Graphes d'activité</h2>
            <p className="text-sm text-text-muted mt-2">Suivez vos clients et vos revenus semaine, mois, six mois et année.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-sm font-bold text-primary-dk">
            <CalendarDays size={16} /> Dernière mise à jour
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {graphPanels.map((panel) => (
            <div key={panel.title} className="rounded-4xl border border-border bg-bg-alt p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-primary-dk">{panel.title}</p>
                  <p className="text-xs text-text-muted">Analyse sur plusieurs périodes</p>
                </div>
                <span className="text-sm font-bold text-primary">{panel.subtitle}</span>
              </div>
              <div className="flex items-end gap-2 h-36">
                {panel.points.map((value, index) => (
                  <div key={index} className="flex-1 rounded-3xl bg-primary/20" style={{ height: `${value}%` }} />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[11px] uppercase tracking-[0.25em] text-text-muted">
                {panel.labels.map((label, i) => (
                  <span key={`${label}-${i}`}>{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
