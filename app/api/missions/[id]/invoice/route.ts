import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/config";
import { getAccessToken } from "@/lib/auth/session";
import { refreshAccessToken } from "@/lib/auth/refresh";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let token = await getAccessToken();

  async function fetchPdf(accessToken: string | null) {
    return fetch(`${getApiBaseUrl()}/missions/${id}/invoice.pdf`, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
      cache: "no-store",
    });
  }

  let res = await fetchPdf(token);
  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetchPdf(token);
  }

  if (!res.ok) {
    return NextResponse.json(
      { message: "Facture indisponible" },
      { status: res.status },
    );
  }

  const blob = await res.arrayBuffer();
  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${id.slice(0, 8)}.pdf"`,
    },
  });
}
