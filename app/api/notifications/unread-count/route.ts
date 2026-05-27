import { NextResponse } from "next/server";
import { apiRequestWithAuth } from "@/lib/auth/refresh";

export async function GET() {
  try {
    const data = await apiRequestWithAuth<{ unreadCount: number }>(
      "/notifications/unread-count",
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ unreadCount: 0 });
  }
}
