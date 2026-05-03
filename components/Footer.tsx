import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          {/* Navigation rapide */}
          <div>
            <p className="site-footer__heading">Navigation Rapide</p>
            <div className="site-footer__links">
              <Link href="/"           className="site-footer__link">Accueil</Link>
              <Link href="/about"      className="site-footer__link">À propos</Link>
              <Link href="/blog"       className="site-footer__link">Blog</Link>
              <Link href="/contact-us" className="site-footer__link">Contact</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="site-footer__heading">Services</p>
            <div className="site-footer__links">
              <Link href="/services/services__emergency"            className="site-footer__link">Dépannage d&apos;urgence</Link>
              <Link href="/services/services__residential"          className="site-footer__link">Réparation &amp; fuite d&apos;eau</Link>
              <Link href="/services/services__commercial"           className="site-footer__link">Installation &amp; remplacement</Link>
              <Link href="/services/services__debouchage_conduites" className="site-footer__link">Débouchage des conduites</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="site-footer__heading">Contact</p>
            <div className="site-footer__links">
              <Link href="tel:+33788209773"                 className="site-footer__link">07 88 20 97 73</Link>
              <Link href="mailto:contact@novaintervention.com" className="site-footer__link">contact@novaintervention.com</Link>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginTop: "0.75rem" }}>Service 24h/7j · Intervention rapide</p>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          © 2026 Nova Intervention. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
