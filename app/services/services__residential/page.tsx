import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Réparation & fuite d'eau – Plomberie | Nova Intervention",
  description: "Fuite de tuyau, robinetterie défectueuse, baignoire qui fuit. Artisan certifié avec devis transparent.",
};

const problems = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>, title: "Fuite de tuyau", desc: "Fuite sur canalisation encastrée ou apparente ? Localisation précise et réparation durable." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: "Robinetterie défectueuse", desc: "Remplacement de robinets, mitigeurs, douchettes, flexibles, joints et cartouches." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M12 18v4"></path></svg>, title: "Baignoire / douche qui fuit", desc: "Fuite au niveau de la bonde, du siphon ou du joint de baignoire. Intervention rapide." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>, title: "Chauffe-eau qui fuit", desc: "Fuite sur le groupe de sécurité, les raccords ou le ballon. Diagnostic et réparation." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>, title: "Canalisation bouchée", desc: "Évacuation lente ou complètement bouchée ? Débouchage par furet ou hydrocurage." },
];

const processList = [
  { num: "01", title: "Décrivez le problème", body: "Envoyez une photo de la fuite, notre IA analyse immédiatement et vous propose une estimation." },
  { num: "02", title: "Un artisan certifié intervient", body: "Sélectionné pour son expertise, il arrive équipé pour résoudre le problème rapidement." },
  { num: "03", title: "Paiement à la fin", body: "Vous payez uniquement une fois satisfait. Aucun frais caché, aucune surprise." },
];

export default function ResidentialPage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />
      
      <div className="relative w-full min-h-[35vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-grid opacity-50"></div>
        <div className="container relative z-10">
          <nav className="flex items-center gap-2 text-sm text-text-muted font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <span>/</span>
            <span className="text-primary-dk">Réparation & Fuite</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Fuites et réparations plomberie, résolues rapidement
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Après diagnostic, nous réparons vos fuites, robinetterie, canalisations et chauffe-eau. Devis transparent et artisans certifiés pour une intervention sans stress.
            </p>
          </div>
        </div>
      </div>

      <main className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          
          <div className="space-y-12">
            <section className="card">
              <h2 className="h2 mb-6">Types de réparations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {problems.map((p, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-bg-alt border border-border transition-colors hover:border-primary-lt">
                    <span className="text-primary mt-1">{p.icon}</span>
                    <div>
                      <h3 className="font-bold text-primary-dk text-lg">{p.title}</h3>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card flex flex-col md:flex-row gap-8 items-center bg-dots border-border">
              <div className="flex-1">
                <h2 className="h2 mb-4">Comment ça fonctionne ?</h2>
                <div className="space-y-6 mt-6">
                  {processList.map((m, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-white flex-shrink-0 rounded-full flex items-center justify-center text-primary font-bold shadow-lg border border-border">
                        {m.num}
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-dk text-lg">{m.title}</h3>
                        <p className="text-sm text-text-muted">{m.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full relative h-[300px] rounded-3xl overflow-hidden shadow-xl">
                <Image src="/images/step__img02.png" alt="Réparation" fill style={{ objectFit: "cover" }} />
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="card-mid !bg-primary !border-transparent sticky top-28">
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>Réservez un pro !</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Appelez nos techniciens disponibles immédiatement pour un dépannage ou un entretien.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="+33788209773" className="btn bg-white text-primary-dk hover:bg-bg-alt w-full">
                  📞 07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn border-2 border-white/30 !text-white hover:bg-white hover:!text-primary w-full">
                  Demande en ligne
                </Link>
              </div>
            </div>

            <div className="card-mid border-border">
               <h3 className="font-bold text-primary-dk text-lg mb-4">6 raisons de nous faire confiance</h3>
               <ul className="flex flex-col gap-3 w-full">
                 {["Techniciens certifiés", "Intervention rapide", "Prix transparents", "Paiement sécurisé", "Aucun frais caché", "Intervention garantie"].map((w, i) => (
                    <li key={w} className="flex items-center gap-3 text-sm text-text-muted">
                        <span className="w-6 h-6 flex flex-shrink-0 items-center justify-center bg-bg-alt text-primary font-bold text-xs rounded-full border border-border">{i + 1}</span>
                        {w}
                    </li>
                 ))}
               </ul>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}
