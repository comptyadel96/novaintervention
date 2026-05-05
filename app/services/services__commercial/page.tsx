import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Installation & remplacement plomberie | Nova Intervention",
  description: "Installation complète : chauffe-eau, appareil sanitaire, robinetterie, réseau de tuyauterie. Devis gratuit.",
};

const installations = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Appareil sanitaire", desc: "Installation ou remplacement de lavabo, WC, douche, baignoire." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>, title: "Chauffe-eau", desc: "Remplacement de chauffe-eau, thermodynamique ou gaz." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h16M4 14h16"/></svg>, title: "Réseau de tuyauterie", desc: "Extension de canalisations en cuivre, PER ou PVC." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M12 18v4"></path></svg>, title: "Remplacement de baignoire", desc: "Pose avec raccordement complet et joints parfaits." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: "Robinetterie", desc: "Remplacement de mitigeurs et vannes d'arrêt." },
];

const processList = [
  { num: "01", title: "Décrivez votre projet", body: "Partagez vos besoins. Un devis précis est établi." },
  { num: "02", title: "Planification et intervention", body: "Un artisan certifié intervient au créneau qui vous convient." },
  { num: "03", title: "Réception et garantie", body: "Travaux vérifiés, avec assurance et garantie incluses." },
];

export default function CommercialPage() {
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
            <span className="text-primary-dk">Installation</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Installations planifiées par des pros
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Planifiez en toute confiance vos installations sanitaires. Nos techniciens apportent savoir-faire et qualité premium.
            </p>
          </div>
        </div>
      </div>

      <main className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          
          <div className="space-y-12">
            <section className="card">
              <h2 className="h2 mb-6">Nos Prestations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {installations.map((p, i) => (
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
                <h2 className="h2 mb-4">Un processus fluide</h2>
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
                <Image src="/images/step__img01.png" alt="Installation" fill style={{ objectFit: "cover" }} />
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="card-mid !bg-primary !border-transparent sticky top-28">
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>Planifiez votre projet</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Obtenez une date d'intervention et un devis complet très rapidement.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="+33788209773" className="btn bg-white text-primary-dk hover:bg-bg-alt w-full">
                  📞 07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn border-2 border-white/30 !text-white hover:bg-white hover:!text-primary w-full">
                  Demande de devis
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}
