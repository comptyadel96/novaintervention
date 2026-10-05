import { NextResponse } from "next/server";

import { apiErrorJson } from "@/lib/api/errors";
import { isBackendMissing } from "@/lib/api/passport-route";
import { apiRequestWithAuthBuffer } from "@/lib/auth/refresh";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const format = new URL(request.url).searchParams.get("format") ?? "json";

  if (format !== "json" && format !== "pdf") {
    return NextResponse.json(
      { message: "Format d'export invalide.", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  try {
    const result = await apiRequestWithAuthBuffer(
      `/passport/buildings/${id}/export?format=${format}`,
    );
    const headers = new Headers();
    headers.set("Content-Type", result.contentType);
    if (result.contentDisposition) {
      headers.set("Content-Disposition", result.contentDisposition);
    }
    return new NextResponse(result.body, { status: 200, headers });
  } catch (error) {
    if (isBackendMissing(error)) {
      return NextResponse.json(
        { message: "Export indisponible pour le moment.", backendReady: false },
        { status: 503 },
      );
    }
    const { message, status, code } = apiErrorJson(
      error,
      "Export du passeport impossible.",
    );
    return NextResponse.json({ message, code }, { status });
  }
}
