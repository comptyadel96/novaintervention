import { apiRequest } from "@/lib/api/client";
import type { Profile, UpdateProfileInput } from "@/types/domain";

export const profilesApi = {
  getMe(token: string) {
    return apiRequest<Profile>("/profiles/me", { token });
  },

  updateMe(token: string, data: UpdateProfileInput) {
    return apiRequest<Profile>("/profiles/me", {
      method: "PATCH",
      token,
      body: data,
    });
  },

  listAll(token: string) {
    return apiRequest<Profile[]>("/profiles", { token });
  },

  setVerification(token: string, profileId: string, isVerified: boolean) {
    return apiRequest<Profile>(`/profiles/${profileId}/verification`, {
      method: "PATCH",
      token,
      body: { is_verified: isVerified },
    });
  },
};
