import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { mapProfileFromApi } from "@/lib/api/mappers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const isVerified =
      body.status === "approved" ||
      body.is_verified === true ||
      body.isVerified === true;

    const data = await apiRequestWithAuth<Record<string, unknown>>(
      `/profiles/${id}/verification`,
      {
        method: "PATCH",
        body: body.status
          ? { status: body.status }
          : { isVerified, is_verified: isVerified },
      },
    );
    return NextResponse.json(mapProfileFromApi(data));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Mise à jour impossible.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
