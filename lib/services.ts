import type { InterventionType } from "@/types";

export const serviceList: Partial<Record<
  InterventionType,
  { title: string; description: string; image: string }
>> = {
  services__emergency: {
    title: "Dépannage d'urgence",
    description:
      "Interventions immédiates pour les fuites, défaillances de chauffe-eau et urgences plomberie.",
    image: "/images/services/1.jpeg",
  },
  services__residential: {
    title: "Réparation & fuite d'eau",
    description:
      "Diagnostic rapide et réparation des fuites d'eau, robinetterie et tuyauterie.",
    image: "/images/services/2.jpeg",
  },
  services__commercial: {
    title: "Installation & remplacement",
    description:
      "Remplacement de chauffe-eau, radiateurs, tuyauteries et installation de nouveaux équipements.",
    image: "/images/services/3.jpeg",
  },
  services__debouchage_conduites: {
    title: "Débouchage des conduites",
    description:
      "Débouchage rapide des éviers, douches, toilettes et canalisations principales.",
    image: "/images/services/4.jpeg",
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
