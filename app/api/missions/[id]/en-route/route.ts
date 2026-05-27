import { proxyMissionAction } from "@/lib/api/mission-action-route";



type Params = { params: Promise<{ id: string }> };



export async function POST(_request: Request, { params }: Params) {

  const { id } = await params;

  return proxyMissionAction(id, "en-route");

}

