import { NextResponse } from "next/server";
import { mapMissionFromApiSingle } from "@/lib/api/mappers";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const data = await apiRequestWithAuth<unknown>(
      `/missions/${id}/complete-work`,
      {
        method: "POST",
        body: {
          photoAfterUrl: body.photoAfterUrl ?? body.photo_after,
          priceFinal: body.priceFinal ?? body.price,
        },
      },
    );
    return NextResponse.json(mapMissionFromApiSingle(data));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Clôture impossible.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
