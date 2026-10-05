import { redirect } from "next/navigation";

import { PassportBuildingsClient } from "@/components/passport/PassportBuildingsClient";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Passeport Nova | Nova Intervention",
  description:
    "La mémoire de votre bâtiment : équipements, documents, historique d'interventions et prochaines actions utiles.",
};

export default async function PassportPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <PassportBuildingsClient />;
}
