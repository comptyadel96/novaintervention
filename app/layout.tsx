import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaIntervention - Plombier en urgence 24/7",
  description:
    "Service de plomberie d'urgence disponible 24h/24, 7j/7. Artisans certifiés, intervention rapide, devis transparent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://accounts.google.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* CSS files migrated to Tailwind v4, removing hardcoded static links to avoid conflicts */}
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
