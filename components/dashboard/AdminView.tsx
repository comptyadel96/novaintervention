"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clientAdminApi,
  clientProfilesApi,
} from "@/services/api/client";
import {
  Users,
  Briefcase,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";
import { MissionCommissionBreakdown } from "@/components/missions/MissionCommissionBreakdown";
import { ContactApplicationDialog } from "@/components/admin/ContactApplicationDialog";
import { getErrorMessage } from "@/lib/api/errors";
import type {
  AdminDashboard,
  AdminUser,
  AuthUser,
  Mission,
  PartnerApplication,
  Profile,
} from "@/types/domain";

export function AdminView({
  user,
  profile,
}: {
  user: AuthUser;
  profile: Profile | null;
}) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "applications" | "users" | "artisans" | "missions"
  >("overview");
  const [error, setError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [contactApp, setContactApp] = useState<PartnerApplication | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [dash, usersRes, missionsRes, appsRes] = await Promise.all([
        clientAdminApi.getDashboard(),
        clientAdminApi.listUsers({ limit: 100 }),
        clientAdminApi.listMissions({ limit: 50 }),
        clientAdminApi.listPartnerApplications({ status: "pending" }),
      ]);
      setDashboard(dash);
      setUsers(
        Array.isArray(usersRes)
          ? usersRes
          : (usersRes.items ?? []),
      );
      setMissions(missionsRes);
      setApplications(appsRes.items ?? []);
    } catch (e) {
      setError(getErrorMessage(e, "Impossible de charger les données admin."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const artisans = users.filter((u) => u.role === "artisan");
  const rate = dashboard?.revenue.commissionRate ?? 0.2;

  const pendingApplications =
    dashboard?.artisans.pendingApplications ?? applications.length;

  const updateApplicationStatus = async (
    id: string,
    status: PartnerApplication["status"],
  ) => {
    try {
      await clientAdminApi.updatePartnerApplication(id, { status });
      await load();
    } catch (e) {
      alert(getErrorMessage(e, "Mise à jour impossible."));
    }
  };

  const toggleVerification = async (id: string, approved: boolean) => {
    try {
      await clientProfilesApi.setVerification(id, approved ? "approved" : "rejected");
      await load();
    } catch {
      alert("Erreur lors de la validation artisan.");
    }
  };

  const handleBan = async (userId: string) => {
    const reason = window.prompt("Motif du bannissement :");
    if (!reason?.trim()) return;
    try {
      await clientAdminApi.banUser(userId, reason.trim());
      await load();
    } catch (e) {
      alert(getErrorMessage(e, "Bannissement impossible."));
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await clientAdminApi.unbanUser(userId);
      await load();
    } catch (e) {
      alert(getErrorMessage(e, "Débannissement impossible."));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${u.firstName ?? ""} ${u.lastName ?? ""}`
        .toLowerCase()
        .includes(userSearch.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">
            Admin · Commission {(rate * 100).toFixed(0)} %
          </p>
          <h1
            className="text-4xl font-extrabold text-primary-dk tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tour de contrôle Nova
          </h1>
        </div>
        <div className="flex bg-white rounded-2xl p-1 border border-border shadow-sm flex-wrap">
          {(
            [
              ["overview", "Vue d'ensemble"],
              ["applications", `Candidatures (${pendingApplications})`],
              ["users", "Utilisateurs"],
              ["artisans", "Artisans"],
              ["missions", "Missions"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-red-50 text-red-600 shadow-sm"
                  : "text-text-muted hover:text-primary-dk"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {activeTab === "overview" && dashboard && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Briefcase}
              label="Missions"
              value={String(dashboard.missions.total)}
              sub={`${dashboard.missions.active} actives`}
            />
            <StatCard
              icon={Users}
              label="Utilisateurs"
              value={String(dashboard.users.total)}
              sub={`+${dashboard.users.newLast30Days} / 30 j`}
            />
            <StatCard
              icon={DollarSign}
              label="GMV total"
              value={`${dashboard.revenue.totalGmv.toLocaleString("fr-FR")} €`}
              sub={`${dashboard.revenue.thisMonth.toLocaleString("fr-FR")} € ce mois`}
            />
            <StatCard
              icon={ShieldCheck}
              label="Commission Nova"
              value={`${dashboard.revenue.platformCommissionTotal.toLocaleString("fr-FR")} €`}
              sub={`${dashboard.revenue.platformCommissionThisMonth.toLocaleString("fr-FR")} € ce mois`}
              highlight
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <MiniStat label="Bannis" value={dashboard.users.banned} />
            <MiniStat
              label="Artisans en attente"
              value={dashboard.artisans.pendingVerification}
            />
            <MiniStat
              label="Candidatures artisans"
              value={pendingApplications}
            />
            <MiniStat label="Terminées" value={dashboard.missions.completed} />
            <MiniStat label="Aujourd'hui GMV" value={`${dashboard.revenue.today} €`} />
          </div>
          <p className="text-text-muted text-sm">
            Connecté : {profile?.email ?? user.email}
          </p>
        </div>
      )}

      {activeTab === "applications" && (
        <div className="bg-white border border-border rounded-4xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dk mb-2">
            Candidatures partenaires (plomberie)
          </h2>
          <p className="text-sm text-text-muted mb-6">
            Demandes envoyées depuis la page Devenir partenaire. Contactez
            l&apos;artisan puis validez ou refusez.
          </p>
          {applications.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">
              Aucune candidature en attente.
              {error
                ? " (Vérifiez que le backend expose GET /admin/partner-applications.)"
                : ""}
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-text-muted">
                  <th className="pb-3">Nom</th>
                  <th className="pb-3">Téléphone</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Ville</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 font-bold">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="py-3">
                      <a
                        href={`tel:${app.phone.replace(/\s/g, "")}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {app.phone}
                      </a>
                    </td>
                    <td className="py-3 text-text-muted text-sm">
                      {app.email ?? "—"}
                    </td>
                    <td className="py-3 text-text-muted">{app.city}</td>
                    <td className="py-3 text-text-muted text-xs">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td className="py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setContactApp(app)}
                        className="btn btn-sm btn-outline"
                      >
                        Contacter
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(app.id, "approved")
                        }
                        className="btn btn-sm btn-primary"
                      >
                        <CheckCircle2 size={14} /> Valider
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(app.id, "rejected")
                        }
                        className="btn btn-sm btn-outline text-red-600"
                      >
                        <XCircle size={14} /> Refuser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white border border-border rounded-4xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <h2 className="text-xl font-bold text-primary-dk flex-1">
              Utilisateurs
            </h2>
            <input
              type="search"
              placeholder="Rechercher email, nom…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="form-input max-w-xs"
            />
          </div>
          <UserTable
            users={filteredUsers}
            onBan={handleBan}
            onUnban={handleUnban}
          />
        </div>
      )}

      {activeTab === "artisans" && (
        <div className="bg-white border border-border rounded-4xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dk mb-6">
            Validation artisans
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-text-muted">
                <th className="pb-3">Nom</th>
                <th className="pb-3">Email</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-bold">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="py-3 text-sm text-text-muted">{a.email}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleVerification(a.id, true)}
                      className="btn btn-sm btn-primary mr-2"
                    >
                      <CheckCircle2 size={14} /> Approuver
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVerification(a.id, false)}
                      className="btn btn-sm btn-outline"
                    >
                      <XCircle size={14} /> Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "missions" && (
        <div className="bg-white border border-border rounded-4xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-primary-dk">
            Missions ({missions.length})
          </h2>
          {missions.map((m) => (
            <div
              key={m.id}
              className="border border-border rounded-2xl p-4 space-y-3"
            >
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-primary-dk">{m.title}</p>
                  <p className="text-xs text-text-muted">{m.status}</p>
                </div>
                <p className="font-black">
                  {m.price_final ?? m.price ?? "—"} €
                </p>
              </div>
              <MissionCommissionBreakdown mission={m} />
            </div>
          ))}
        </div>
      )}

      <ContactApplicationDialog
        application={contactApp}
        open={contactApp != null}
        onClose={() => setContactApp(null)}
        onContacted={(app) => {
          if (app.status === "pending") {
            void updateApplicationStatus(app.id, "contacted");
          }
        }}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card p-6 rounded-4xl shadow-sm ${
        highlight ? "bg-red-600 text-white" : "bg-white border border-border"
      }`}
    >
      <Icon
        size={20}
        className={highlight ? "text-white/80 mb-3" : "text-primary mb-3"}
      />
      <p className={`text-2xl font-black ${highlight ? "" : "text-primary-dk"}`}>
        {value}
      </p>
      <p
        className={`text-xs font-bold uppercase tracking-wider mt-1 ${
          highlight ? "text-white/80" : "text-text-muted"
        }`}
      >
        {label}
      </p>
      <p className={`text-sm mt-2 ${highlight ? "text-white/70" : "text-text-muted"}`}>
        {sub}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-bg-alt border border-border p-4">
      <p className="text-[10px] uppercase font-bold text-text-muted">{label}</p>
      <p className="text-lg font-black text-primary-dk">{value}</p>
    </div>
  );
}

function UserTable({
  users,
  onBan,
  onUnban,
}: {
  users: AdminUser[];
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase text-text-muted">
            <th className="pb-3">Email</th>
            <th className="pb-3">Rôle</th>
            <th className="pb-3">Statut</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="py-3">{u.email}</td>
              <td className="py-3">{u.role}</td>
              <td className="py-3">
                {u.isBanned ? (
                  <span className="text-red-600 font-bold">Banni</span>
                ) : (
                  <span className="text-green-700">Actif</span>
                )}
              </td>
              <td className="py-3 text-right">
                {u.role !== "admin" &&
                  (u.isBanned ? (
                    <button
                      type="button"
                      onClick={() => onUnban(u.id)}
                      className="btn btn-sm btn-outline"
                    >
                      Débannir
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBan(u.id)}
                      className="btn btn-sm btn-outline text-red-600"
                    >
                      <Ban size={14} className="inline mr-1" />
                      Bannir
                    </button>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
