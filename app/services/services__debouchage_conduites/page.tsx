import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Débouchage des conduites – Plomberie | Nova Intervention",
  description: "WC, évier, douche bouchés ? Furet, hydrocurage et inspection caméra. Intervention rapide et efficace.",
};

const problems = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 16V8a3 3 0 0 1 6 0v8"></path><path d="M4 16h16"></path><path d="M4 20h16"></path></svg>, title: "WC bouché", desc: "Toilettes bloquées ? Débouchage rapide mécanique ou électrique." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18"></path><path d="M8 10v4a4 4 0 0 0 8 0v-4"></path><path d="M12 4v6"></path></svg>, title: "Évier ou lavabo bouché", desc: "Siphon encrassé résolu très proprement." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M12 18v4"></path></svg>, title: "Douche / baignoire bouchée", desc: "Eau stagnante. Débouchage express de l'évacuation." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>, title: "Canalisation principale", desc: "Hydrocurage haute pression pour toute obstruction lourde." },
];

const methods = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>, title: "Furet manuel", desc: "Pour débouchages courants (siphons)." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, title: "Furet électrique", desc: "Pour les bouchons plus tenaces." },
];

export default function DebouchagePage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />
      
      {/* Dynamic Header specifically for service to give it a premium flare */}
      <div className="relative w-full min-h-[35vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-grid opacity-50"></div>
        <div className="container relative z-10">
          <nav className="flex items-center gap-2 text-sm text-text-muted font-bold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <span>/</span>
            <span className="text-primary-dk">Débouchage</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Débouchage professionnel et assainissement
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Vos toilettes ou évier sont bouchés ? Nous intervenons immédiatement avec un équipement premium.
            </p>
          </div>
        </div>
      </div>

      <main className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          
          <div className="space-y-12">
            <section className="card">
              <h2 className="h2 mb-6">Problèmes courants</h2>
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
                <h2 className="h2 mb-4">La méthode Nova</h2>
                <div className="space-y-6 mt-6">
                  {methods.map((m, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-lg flex-shrink-0">
                        {m.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-dk text-lg">{m.title}</h3>
                        <p className="text-sm text-text-muted">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full relative h-[300px] rounded-3xl overflow-hidden shadow-xl">
                <Image src="/images/step__img01.png" alt="Inspection" fill style={{ objectFit: "cover" }} />
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="card-mid !bg-primary !border-transparent sticky top-28">
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>Intervention Urgente !</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Nos techniciens sont qualifiés. Contactez-nous dès maintenant.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="tel:+33788209773" className="btn bg-white text-primary-dk hover:bg-bg-alt w-full">
                  📞 07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn border-2 border-white/30 !text-white hover:bg-white hover:!text-primary w-full">
                  Demande de devis
                </Link>
              </div>
            </div>

            <div className="card-mid border-border">
               <h3 className="font-bold text-primary-dk text-lg mb-4">Notre approche</h3>
               <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden border border-border">
                 <Image src="/images/step__img02.png" alt="Nova Services" fill style={{ objectFit: "cover" }} />
               </div>
               <p className="text-sm text-text-muted">Nos techniciens s'assurent que votre intervention se déroule en toute sécurité et transparence.</p>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}
