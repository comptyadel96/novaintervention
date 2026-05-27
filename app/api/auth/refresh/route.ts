import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/auth/refresh";

export async function POST() {
  const accessToken = await refreshAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Session expirée" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
