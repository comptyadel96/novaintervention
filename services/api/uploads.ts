import { apiRequest } from "@/lib/api/client";

export const uploadsApi = {
  uploadInterventionPhoto(token: string | null, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<{ url: string }>("/uploads/interventions", {
      method: "POST",
      token,
      body: formData,
      isFormData: true,
    });
  },
};
