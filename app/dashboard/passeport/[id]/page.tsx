import { redirect } from "next/navigation";

import { PassportDetailClient } from "@/components/passport/PassportDetailClient";
import { getSession } from "@/lib/auth/session";

export default async function PassportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  return <PassportDetailClient buildingId={id} />;
}
