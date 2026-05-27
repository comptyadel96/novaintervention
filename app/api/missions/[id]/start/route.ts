import { proxyMissionAction } from "@/lib/api/mission-action-route";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyMissionAction(id, "start");
}
