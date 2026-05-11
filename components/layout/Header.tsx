"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LayoutDashboard } from "lucide-react";

const services = [
  { href: "/services/services__emergency",             label: "Dépannage d'urgence" },
  { href: "/services/services__residential",           label: "Réparation & fuite d'eau" },
  { href: "/services/services__commercial",            label: "Installation & remplacement" },
  { href: "/services/services__debouchage_conduites",  label: "Débouchage des conduites" },
];

export function Header() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        {/* Logo — matches reference: globe icon + two-line text */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {/* Globe SVG icon — larger to match reference */}
          <div className="flex-shrink-0" style={{ width: "52px", height: "52px" }}>
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "52px", height: "52px" }}>
              <circle cx="24" cy="24" r="24" fill="#0c4c93"/>
              <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2" fill="none"/>
              <ellipse cx="24" cy="24" rx="6" ry="13" stroke="white" strokeWidth="2" fill="none"/>
              <line x1="11" y1="24" x2="37" y2="24" stroke="white" strokeWidth="2"/>
              <line x1="13" y1="17" x2="35" y2="17" stroke="white" strokeWidth="1.5"/>
              <line x1="13" y1="31" x2="35" y2="31" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          {/* Two-line text — larger to match reference */}
          <div className="flex flex-col" style={{ lineHeight: 1.15 }}>
            <span style={{ fontFamily: "var(--font-display)", color: "var(--primary-dk)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.01em" }}>Nova</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 500 }}>intervention</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="site-header__nav hide-mobile">
          <Link href="/"       className="nav-link">Accueil</Link>
          <Link href="/about"  className="nav-link">À propos</Link>

          {/* Services dropdown */}
          <div
            className="nav-services"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="nav-services__toggle">
              Services <span style={{ fontSize: "0.65rem" }}>▾</span>
            </button>
            {servicesOpen && (
              <div className="nav-services__dropdown">
                {services.map((s) => (
                  <Link key={s.href} href={s.href} className="nav-services__item">
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog"       className="nav-link">Blog</Link>
          <Link href="/contact-us" className="nav-link">Contact</Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="site-header__ctas hide-mobile">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Tableau de bord
              </Link>
              <span className="text-sm font-bold text-primary-dk">
                Hello, {user.user_metadata?.first_name || 'Artisan'}
              </span>
              <button 
                onClick={handleSignOut}
                className="btn btn-outline btn-sm"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-outline btn-sm"
            >
              Connexion
            </Link>
          )}
          <Link
            href="/demander"
            className="btn btn-primary btn-sm"
          >
            Demander une intervention
          </Link>
        </div>

        {/* Hamburger — blue square, visible ONLY on mobile */}
        <button
          className="lg:hidden flex items-center justify-center rounded-xl flex-shrink-0 transition-all"
          style={{ background: "var(--primary)", width: "2.75rem", height: "2.75rem", border: "none", cursor: "pointer" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="17" x2="21" y2="17"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — full-width dropdown */}
      {menuOpen && (
        <div className="site-header__mobile lg:hidden">
          {/* Main nav links */}
          {[
            { href: "/",          label: "Accueil" },
            { href: "/about",     label: "À propos" },
            { href: "/blog",      label: "Blog" },
            { href: "/contact-us",label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b font-semibold text-[0.95rem] text-primary-dk hover:text-primary transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          ))}

          {/* Services section */}
          <div className="py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--primary)" }}>
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 pl-3 text-sm font-medium hover:text-primary transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                {s.label}
              </Link>
            ))}
          </div>

          {/* Auth + CTA buttons */}
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <p className="text-sm font-bold text-primary-dk">Bonjour, {user.user_metadata?.first_name || 'Artisan'}</p>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full justify-center">
                  Tableau de bord
                </Link>
                <button onClick={handleSignOut} className="btn btn-outline w-full justify-center">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full justify-center">
                Connexion
              </Link>
            )}
            <Link href="/demander" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full justify-center">
              Demander une intervention
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
