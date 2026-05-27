import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  try {
    const data = await apiRequestWithAuth<unknown>(
      `/notifications${query ? `?${query}` : ""}`,
    );
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Notifications inaccessibles.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
