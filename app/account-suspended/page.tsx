import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AccountSuspendedPage() {
  return (
    <div className="page-wrap flex flex-col min-h-screen bg-bg-body">
      <Header />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md text-center card bg-white border border-border shadow-2xl p-10 rounded-4xl">
          <h1
            className="text-2xl font-extrabold text-primary-dk mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Compte suspendu
          </h1>
          <p className="text-text-muted mb-8">
            Votre accès à Nova Intervention a été désactivé par un
            administrateur. Contactez le support si vous pensez qu&apos;il
            s&apos;agit d&apos;une erreur.
          </p>
          <Link href="/login" className="btn btn-primary">
            Retour à la connexion
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
