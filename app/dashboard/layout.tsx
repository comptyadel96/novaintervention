import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ContactVerificationBanner } from "@/components/dashboard/ContactVerificationBanner";
import { ProfileCompletionRedirect } from "@/components/dashboard/ProfileCompletionRedirect";
import { SessionKeeper } from "@/components/auth/SessionKeeper";
import { getSessionRefreshIntervalMs } from "@/lib/auth/token-max-age";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { resolveRole } from "@/lib/auth/display";
import { hasVerifiedContact } from "@/lib/auth/contact";
import { needsProfileCompletion } from "@/lib/auth/needs-profile-completion";
import { profileCompletionBannerText } from "@/lib/auth/profile-completion-messages";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.isBanned) {
    redirect("/account-suspended");
  }

  const role = resolveRole(session.user, session.profile);
  const needsCompletion = needsProfileCompletion(session.user, session.profile);

  return (
    <div className="flex min-h-screen bg-bg-body">
      <SessionKeeper refreshIntervalMs={getSessionRefreshIntervalMs()} />
      <ProfileCompletionRedirect needsCompletion={needsCompletion} />
      <DashboardSidebar role={role} />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {needsCompletion && (
            <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm text-primary-dk">
              <p className="font-bold">Profil incomplet</p>
              <p className="mt-1 text-text-muted">
                {profileCompletionBannerText(session.user, session.profile)}{" "}
                <a
                  href="/dashboard/complete-profile"
                  className="text-primary font-bold underline"
                >
                  Compléter maintenant →
                </a>
              </p>
            </div>
          )}
          {!hasVerifiedContact(session.user) && role !== "admin" && (
            <ContactVerificationBanner
              email={session.user.email}
              phoneVerified={session.user.phoneVerified}
            />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
