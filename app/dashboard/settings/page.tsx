import { redirect } from "next/navigation";
import SettingsForm from "@/components/dashboard/SettingsForm";
import { PasswordChangeForm } from "@/components/dashboard/PasswordChangeForm";
import { GoogleAccountLink } from "@/components/auth/GoogleAccountLink";
import { getSession } from "@/lib/auth/session";

export default async function DashboardSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
          Paramètres
        </p>
        <h1
          className="text-4xl font-extrabold text-primary-dk tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Réglages du compte
        </h1>
      </header>

      <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm space-y-10">
        <GoogleAccountLink user={session.user} />
        <hr className="border-border" />
        {session.user.hasPassword === false &&
        session.user.authProvider === "guest" ? (
          <p className="text-sm text-text-muted">
            Votre compte a été créé lors de votre demande d&apos;intervention.
            Consultez l&apos;email reçu pour choisir votre mot de passe et vous
            connecter. Sinon, utilisez{" "}
            <a href="/forgot-password" className="text-primary font-semibold underline">
              mot de passe oublié
            </a>{" "}
            avec la même adresse email.
          </p>
        ) : session.user.hasPassword === false ? (
          <p className="text-sm text-text-muted">
            Ce compte n&apos;a pas de mot de passe local (connexion Google).
            Associez Google ci-dessus ou contactez le support pour ajouter un mot
            de passe.
          </p>
        ) : (
          <PasswordChangeForm />
        )}
        <hr className="border-border" />
        <SettingsForm user={session.user} />
      </section>
    </div>
  );
}
