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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap"
          rel="stylesheet"
        />
        {/* CSS files migrated to Tailwind v4, removing hardcoded static links to avoid conflicts */}
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
