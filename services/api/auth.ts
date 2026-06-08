import type {
  LoginInput,
  RegisterInput,
  Session,
  AuthUser,
  SmsVerifyInput,
} from "@/types/domain";
import { bffFetch } from "@/lib/api/bff-client";

type AuthTokensResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export const authApi = {
  login(input: LoginInput) {
    return bffFetch<AuthTokensResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  register(input: RegisterInput) {
    return bffFetch<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  logout() {
    return bffFetch<void>("/api/auth/logout", { method: "POST" });
  },

  getSession() {
    return bffFetch<Session>("/api/auth/me");
  },

  forgotPassword(email: string) {
    return bffFetch<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(password: string, token?: string) {
    return bffFetch<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ password, token }),
    });
  },

  updatePassword(currentPassword: string, newPassword: string) {
    return bffFetch<{ message: string }>("/api/auth/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  verifyEmail(input: { token: string; password?: string }) {
    return bffFetch<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  resendVerification() {
    return bffFetch<{ message: string }>("/api/auth/resend-verification", {
      method: "POST",
    });
  },

  sendSmsCode(phone: string) {
    return bffFetch<{ message?: string }>("/api/auth/sms/send-code", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  verifySms(input: SmsVerifyInput) {
    return bffFetch<Session>("/api/auth/sms/verify", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  linkPhone(phone: string, code: string) {
    return bffFetch<Session>("/api/auth/sms/link-phone", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    });
  },

  getGoogleStatus() {
    return bffFetch<{ enabled: boolean; clientId?: string }>(
      "/api/auth/google/status",
    );
  },

  signInWithGoogle(idToken: string, options?: { role?: AuthUser["role"] }) {
    return bffFetch<Session>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({
        idToken,
        ...(options?.role ? { role: options.role } : {}),
      }),
    });
  },

  linkGoogle(idToken: string) {
    return bffFetch<Session>("/api/auth/google/link", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },
};
