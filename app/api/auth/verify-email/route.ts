import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token: string };
    const data = await apiRequest<{ message?: string }>("/auth/verify-email", {
      method: "POST",
      body: { token },
    });
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Confirmation impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
