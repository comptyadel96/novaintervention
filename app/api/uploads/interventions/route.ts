import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/session";
import { uploadsApi } from "@/services/api/uploads";
import { ApiError } from "@/lib/api/errors";

export async function POST(request: Request) {
  const token = await getAccessToken();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Fichier requis" }, { status: 400 });
    }

    const result = await uploadsApi.uploadInterventionPhoto(token, file);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload impossible.";
    const status = error instanceof ApiError ? error.status : 500;
    const code = error instanceof ApiError ? error.code : undefined;
    return NextResponse.json({ message, code }, { status });
  }
}
