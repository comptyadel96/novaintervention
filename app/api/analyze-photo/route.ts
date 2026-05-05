import { NextResponse } from "next/server";
import type { AnalyzePhotoResult } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Simulate OpenAI API Artificial Delay (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Defaulting to 0.85 but can be easily tweaked here.
    const mockConfidence = 0.85;

    const mockResponse: AnalyzePhotoResult = {
      type_intervention: "services__emergency",
      description_probleme: "Fuite sévère probable au niveau de la canalisation principale sous évier.",
      niveau_urgence: "urgent",
      estimation_prix_min: 150,
      estimation_prix_max: 250,
      pieces_recommandees: ["Joint de siphon 40mm", "Flexible d'évacuation"],
      duree_estimee_minutes: 45,
      confidence: mockConfidence,
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
