import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance — Nova Intervention",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-bg-alt flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-border rounded-3xl p-10 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          Nova Intervention
        </p>
        <h1 className="text-2xl font-extrabold text-primary-dk mb-3">
          Site temporairement indisponible
        </h1>
        <p className="text-text-muted text-sm leading-relaxed">
          Nous effectuons une opération de maintenance. Le service sera de
          nouveau accessible prochainement.
        </p>
      </div>
    </main>
  );
}
