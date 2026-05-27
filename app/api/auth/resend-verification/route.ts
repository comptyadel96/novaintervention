import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";
import { ApiError } from "@/lib/api/errors";

export async function POST() {
  try {
    const data = await apiRequestWithAuth<{ message?: string }>(
      "/auth/resend-verification",
      { method: "POST" },
    );
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Envoi impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
