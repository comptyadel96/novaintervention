import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isProfileComplete } from "@/lib/auth/profile-completion";
import { CompleteProfileForm } from "@/components/dashboard/CompleteProfileForm";

export default async function CompleteProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.isBanned) {
    redirect("/account-suspended");
  }

  if (isProfileComplete(session.user, session.profile)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Une dernière étape
          </p>
          <h1
            className="text-3xl font-extrabold text-primary-dk tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Complétez votre profil
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            Obligatoire après inscription ou connexion (Google, email, SMS).
          </p>
        </header>

        <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
          <CompleteProfileForm
            user={session.user}
            profile={session.profile}
          />
        </section>
      </div>
    </div>
  );
}
