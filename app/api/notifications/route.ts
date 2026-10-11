import { NextResponse } from "next/server";
import { apiErrorJson } from "@/lib/api/errors";
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
    const { message, status, code } = apiErrorJson(
      error,
      "Notifications inaccessibles.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
