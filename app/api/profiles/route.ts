import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { mapProfileFromApi } from "@/lib/api/mappers";

export async function GET() {
  try {
    const data = await apiRequestWithAuth<unknown[]>("/profiles");
    const list = Array.isArray(data) ? data : [];
    return NextResponse.json(
      list.map((p) => mapProfileFromApi(p as Record<string, unknown>)),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Liste inaccessible.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
