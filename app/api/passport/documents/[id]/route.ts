import { NextResponse } from "next/server";

import { apiErrorJson } from "@/lib/api/errors";
import { passportRequest } from "@/lib/api/passport-route";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await passportRequest<void>(`/documents/${id}`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { message, status, code } = apiErrorJson(
      error,
      "Suppression impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
