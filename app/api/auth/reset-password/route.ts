import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const { password, token } = (await request.json()) as {
      password: string;
      token: string;
    };

    if (!token) {
      return NextResponse.json(
        { message: "Lien de réinitialisation invalide." },
        { status: 400 },
      );
    }

    const data = await apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: { password, token },
    });

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Réinitialisation impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json({ message }, { status });
  }
}
