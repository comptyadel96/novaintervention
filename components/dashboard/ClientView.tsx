"use client";

import { History, FileText, Calendar, ShieldCheck, MapPin } from "lucide-react";

export function ClientView({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Espace Client • Carnet Nova</p>
        <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Ravi de vous revoir, {user.user_metadata?.first_name || "Client"}
        </h1>
      </header>

      {/* Services Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Historique", count: "12", icon: History, color: "text-primary", bg: "bg-primary/5" },
          { label: "En cours", count: "1", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Documents", count: "5", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
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
            <h2 className="text-xl font-extrabold text-primary-dk mb-8">Historique des interventions</h2>
            
            <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {[
                { date: "15 Oct. 2023", title: "Installation chauffe-eau", type: "Chauffage", status: "Terminé", price: "450 €" },
                { date: "02 Sept. 2023", title: "Fuite évier cuisine", type: "Plomberie", status: "Terminé", price: "120 €" },
              ].map((job, i) => (
                <div key={i} className="relative pl-12 group">
                  <div className="absolute left-0 top-1 w-9 h-9 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary mb-1">{job.date}</p>
                      <h3 className="text-lg font-bold text-primary-dk mb-1">{job.title}</h3>
                      <div className="flex gap-4 text-xs text-text-muted font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> Résidence Principale</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary-dk mb-1">{job.price}</p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">Facture Payée</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-bg-alt rounded-xl text-xs font-bold text-primary-dk hover:bg-border transition-colors">Détails</button>
                    <button className="px-4 py-2 bg-bg-alt rounded-xl text-xs font-bold text-primary-dk hover:bg-border transition-colors">Facture PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Space */}
        <aside className="space-y-6">
          <div className="card p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold mb-2">Besoin d'aide ?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Un problème urgent ? Nos techniciens interviennent en moins de 30 minutes.</p>
              <button className="w-full py-3 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-opacity-90 transition-all">
                Nouvelle Demande
              </button>
            </div>
            {/* Abstract Pattern background */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-bold text-primary-dk mb-1">Carnet Nova Pro</h4>
            <p className="text-xs text-text-muted mb-4">Suivi digital certifié de vos installations immobilières.</p>
            <div className="w-full bg-bg-alt rounded-full h-2 mb-2">
              <div className="bg-primary h-full rounded-full w-[65%]" />
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase">65% Complété</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
