import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/session";
import { refreshAccessToken } from "@/lib/auth/refresh";

/** Expose le JWT au client pour la connexion WebSocket (cookie httpOnly). */
export async function GET() {
  let token = await getAccessToken();
  if (!token) {
    token = await refreshAccessToken();
  }
  if (!token) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }
  return NextResponse.json({ token });
}
