import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AnalyzePhotoResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const image = body.image as string | undefined;

  if (!image) {
    return NextResponse.json({ error: "Image missing" }, { status: 400 });
  }

  const result: AnalyzePhotoResult = {
    type_intervention: "services__emergency",
    description_probleme: "Fuite sur robinetterie, goutte-à-goutte sous évier.",
    niveau_urgence: "urgent",
    estimation_prix_min: 140,
    estimation_prix_max: 210,
    pieces_recommandees: ["joint", "raccord", "robinet"],
    duree_estimee_minutes: 45,
    confidence: 0.78,
  };

  return NextResponse.json(result);
}
