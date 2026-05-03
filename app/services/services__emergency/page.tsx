import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dépannage plomberie urgence 24h/7j | Nova Intervention",
  description: "Plombier en urgence : fuite, panne chauffe-eau, WC bouché. Diagnostic rapide, artisan certifié en less de 30 min. Devis transparent.",
};

const problems = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12h10V10M7 6v4h10V6a2 2 0 0 0-4 0v4H9V6a2 2 0 0 0-2 0z"/></svg>, title: "Panne de chauffe-eau", desc: "Plus d'eau chaude ? Diagnostic rapide et réparation ou remplacement si nécessaire." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>, title: "Canalisation bouchée", desc: "WC, évier ou douche bouchés ? Débouchage rapide avec matériel professionnel." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 16V8a3 3 0 0 1 6 0v8"></path><path d="M4 16h16"></path><path d="M4 20h16"></path></svg>, title: "WC / chasse d'eau en panne", desc: "Fuite ou mécanisme défectueux ? Réparation rapide avec diagnostic inclus." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: "Robinet défectueux", desc: "Robinet qui fuit ou à remplacer ? Intervention propre et durable." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>, title: "Fuite d'eau visible", desc: "Fuite sur tuyau, raccord ou robinet ? Intervention rapide pour éviter les dégâts." },
];

const processList = [
  { num: "01", title: "Décrivez votre problème", body: "Prenez une photo et expliquez votre besoin. Vous recevez une estimation claire avant intervention." },
  { num: "02", title: "Un artisan intervient rapidement", body: "Un professionnel certifié, sélectionné et vérifié, intervient avec toutes les informations nécessaires." },
  { num: "03", title: "Paiement sécurisé", body: "Vous ne payez qu'une fois le travail terminé et validé. Aucun dépassement sans accord." },
];

export default function EmergencyPage() {
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
            <span className="text-primary-dk">Dépannage d'urgence</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Une urgence ne doit pas devenir un stress
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              Fuite d'eau, canalisation bouchée, panne de chauffe-eau… Avec Nova Intervention, un professionnel qualifié est envoyé rapidement avec un diagnostic précis.
            </p>
          </div>
        </div>
      </div>

      <main className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          
          <div className="space-y-12">
            <section className="card">
              <h2 className="h2 mb-6">Vos problèmes résolus</h2>
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
                <h2 className="h2 mb-4">Une intervention sans risque</h2>
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
                <Image src="/images/step__img03.png" alt="Processus" fill style={{ objectFit: "cover" }} />
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="card-mid !bg-primary !border-transparent sticky top-28">
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>Besoin d'une immédiate urgence ?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Un technicien qualifié intervient chez vous très rapidement. 24h/24 !
              </p>
              <div className="flex flex-col gap-3">
                <Link href="tel:+33788209773" className="btn bg-white text-primary-dk hover:bg-bg-alt w-full">
                  📞 07 88 20 97 73
                </Link>
                <Link href="/demander" className="btn border-2 border-white/30 !text-white hover:bg-white hover:!text-primary w-full">
                  Demander en ligne
                </Link>
              </div>
            </div>

            <div className="card-mid border-border">
               <h3 className="font-bold text-primary-dk text-lg mb-4">Pourquoi Nova ?</h3>
               <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden border border-border">
                 <Image src="/images/step__img01.png" alt="Sécurité" fill style={{ objectFit: "cover" }} />
               </div>
               <p className="text-sm text-text-muted">Techniciens certifiés, garantie sur l'intervention et transparence totale des prix sans aucuns frais cachés.</p>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}
