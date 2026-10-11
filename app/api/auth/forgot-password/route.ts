import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api/client";
import { apiErrorJson } from "@/lib/api/errors";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email: string };
    const data = await apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
    return NextResponse.json(data);
  } catch (error) {
    const { message, status, code } = apiErrorJson(error, "Envoi impossible.");
    return NextResponse.json({ message, code }, { status });
  }
}
