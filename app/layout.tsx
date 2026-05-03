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
        {/* CSS files from original site */}
        <link rel="stylesheet" href="/03b6a958d4229a19.css" />
        <link rel="stylesheet" href="/225941dd88a68361.css" />
        <link rel="stylesheet" href="/23a4b30361a142c2.css" />
        <link rel="stylesheet" href="/3752d801fce1e31b.css" />
        <link rel="stylesheet" href="/5bdc809c507329ee.css" />
        <link rel="stylesheet" href="/5cb0b25965524b45.css" />
        <link rel="stylesheet" href="/62954dfb0983aa00.css" />
        <link rel="stylesheet" href="/6ebbfea6e4f80f7b.css" />
        <link rel="stylesheet" href="/772212e1b434c642.css" />
        <link rel="stylesheet" href="/e6c6a2c2edb139a4.css" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
