import { NextResponse } from "next/server";

import { apiRequestWithAuth } from "@/lib/auth/refresh";

import { mapProfileFromApi } from "@/lib/api/mappers";

import { apiErrorJson } from "@/lib/api/errors";



export async function POST(request: Request) {

  try {

    const incoming = await request.formData();

    const file = incoming.get("file");

    if (!(file instanceof File)) {

      return NextResponse.json({ message: "Fichier requis" }, { status: 400 });

    }



    const formData = new FormData();

    formData.append("file", file);



    const data = await apiRequestWithAuth<Record<string, unknown>>(

      "/profiles/me/avatar",

      {

        method: "POST",

        body: formData,

        isFormData: true,

      },

    );



    return NextResponse.json(mapProfileFromApi(data));

  } catch (error) {

    const { message, status, code } = apiErrorJson(

      error,

      "Upload avatar impossible.",

    );

    return NextResponse.json({ message, code }, { status });

  }

}

