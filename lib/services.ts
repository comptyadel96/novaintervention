import type { InterventionType } from "@/lib/types";

export const serviceList: Record<
  InterventionType,
  { title: string; description: string; icon: string }
> = {
  services__emergency: {
    title: "Dépannage d'urgence",
    description:
      "Interventions immédiates pour les fuites, défaillances de chauffe-eau et urgences plomberie.",
    icon: "🚨",
  },
  services__residential: {
    title: "Réparation & fuite d'eau",
    description:
      "Diagnostic rapide et réparation des fuites d'eau, robinetterie et tuyauterie.",
    icon: "💧",
  },
  services__commercial: {
    title: "Installation & remplacement",
    description:
      "Remplacement de chauffe-eau, radiateurs, tuyauteries et installation de nouveaux équipements.",
    icon: "🔧",
  },
  services__debouchage_conduites: {
    title: "Débouchage des conduites",
    description:
      "Débouchage rapide des éviers, douches, toilettes et canalisations principales.",
    icon: "💦",
  },
};

export const defaultFeatures = [
  {
    title: "Devis transparent",
    description:
      "Estimation claire avant intervention, aucune surprise à la fin.",
  },
  {
    title: "Suivi en temps réel",
    description:
      "Localisation de l'artisan et notification de son arrivée imminente.",
  },
  {
    title: "Historique centralisé",
    description:
      "Toutes les interventions sauvegardées dans votre carnet de suivi.",
  },
];
