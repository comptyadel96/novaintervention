"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import { displayFirstName } from "@/lib/auth/display";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import type { Session } from "@/types/domain";
import { UserAvatar } from "@/components/user/UserAvatar";
import { SESSION_REFRESH_EVENT } from "@/lib/auth/session-events";
import { LayoutDashboard } from "lucide-react";
import Image from "next/image";

const services = [
  { href: "/services/services__emergency", label: "Dépannage d'urgence" },
  {
    href: "/services/services__residential",
    label: "Réparation & fuite d'eau",
  },
  {
    href: "/services/services__commercial",
    label: "Installation & remplacement",
  },
  {
    href: "/services/services__debouchage_conduites",
    label: "Débouchage des conduites",
  },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const loadSession = () => {
    authApi
      .getSession()
      .then(setSession)
      .catch(() => setSession(null));
  };

  useEffect(() => {
    loadSession();
    const onRefresh = () => loadSession();
    window.addEventListener(SESSION_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(SESSION_REFRESH_EVENT, onRefresh);
  }, []);

  const user = session?.user ?? null;
  const profile = session?.profile ?? null;

  const handleSignOut = async () => {
    await authApi.logout();
    setSession(null);
    router.refresh();
    router.push("/");
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo">
          <Image src="/images/novalogo.png" alt="Nova Intervention" width={120} height={40} />
        </Link>

        <nav className="site-header__nav hide-mobile">
          <Link href="/" className="nav-link">
            Accueil
          </Link>
          <Link href="/about" className="nav-link">
            À propos
          </Link>

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
                  <Link
                    key={s.href}
                    href={s.href}
                    className="nav-services__item"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <Link href="/contact-us" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="site-header__ctas hide-mobile">
          {user ? (
            <div className="flex items-center gap-4">
              <UserAvatar
                user={user}
                profile={profile}
                size="sm"
                cacheBust={profile?.avatar_url ?? user.avatarUrl}
              />
              <NotificationBell />
              <Link
                href="/dashboard"
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Tableau de bord
              </Link>
              <span className="text-sm font-bold text-primary-dk">
                Hello, {displayFirstName(user, profile)}
              </span>
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-sm"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-outline btn-sm">
              Connexion
            </Link>
          )}
          <Link href="/demander" className="btn btn-primary btn-sm">
            Demander une intervention
          </Link>
        </div>

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

      {menuOpen && (
        <div className="site-header__mobile">
          {[
            { href: "/", label: "Accueil" },
            { href: "/about", label: "À propos" },
            { href: "/blog", label: "Blog" },
            { href: "/contact-us", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                color: "var(--primary-dk)",
                fontSize: "0.9rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {item.label}
            </Link>
          ))}

          <div
            style={{
              padding: "0.5rem 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
                marginTop: "0.25rem",
              }}
            >
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "0.5rem 0 0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                }}
              >
                {s.label}
              </Link>
            ))}
          </div>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                color: "var(--primary-dk)",
                fontWeight: 700,
              }}
            >
              Tableau de bord
            </Link>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.25rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 w-full">
                  <UserAvatar
                user={user}
                profile={profile}
                size="sm"
                cacheBust={profile?.avatar_url ?? user.avatarUrl}
              />
                  <span className="text-sm font-bold text-primary-dk">
                    Hello, {displayFirstName(user, profile)}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline btn-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn btn-outline btn-sm"
              >
                Connexion
              </Link>
            )}
            <Link
              href="/demander"
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary btn-sm"
            >
              Demander une intervention
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
