"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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
        {/* Logo */}
        <Link href="/" className="site-header__logo">
          Nova <span>Intervention</span>
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

        {/* Hamburger */}
        <button
          className="site-header__burger hide-desktop"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="site-header__mobile">
          {[
            { href: "/",       label: "Accueil" },
            { href: "/about",  label: "À propos" },
            { href: "/blog",   label: "Blog" },
            { href: "/contact-us", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "0.75rem 0", color: "var(--primary-dk)", fontSize: "0.9rem", borderBottom: "1px solid var(--border)" }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", marginTop: "0.25rem" }}>
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: "block", padding: "0.5rem 0 0.5rem 0.75rem", fontSize: "0.875rem", color: "var(--muted)" }}
              >
                {s.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            {user ? (
              <>
                <span className="text-sm font-bold text-primary-dk w-full">
                  Hello, {user.user_metadata?.first_name || 'Artisan'}
                </span>
                <button onClick={handleSignOut} className="btn btn-outline btn-sm">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline btn-sm">
                Connexion
              </Link>
            )}
            <Link href="/demander" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm">
              Demander une intervention
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
