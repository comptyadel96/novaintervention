import type {
  LoginInput,
  RegisterInput,
  Session,
  AuthUser,
  SmsVerifyInput,
} from "@/types/domain";
import { ApiError } from "@/lib/api/errors";

type AuthTokensResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

async function bffRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(
      (payload as { message?: string }).message ??
        "Une erreur est survenue.",
      response.status,
      (payload as { code?: string }).code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  login(input: LoginInput) {
    return bffRequest<AuthTokensResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  register(input: RegisterInput) {
    return bffRequest<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  logout() {
    return bffRequest<void>("/api/auth/logout", { method: "POST" });
  },

  getSession() {
    return bffRequest<Session>("/api/auth/me");
  },

  forgotPassword(email: string) {
    return bffRequest<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(password: string, token?: string) {
    return bffRequest<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ password, token }),
    });
  },

  updatePassword(currentPassword: string, newPassword: string) {
    return bffRequest<{ message: string }>("/api/auth/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  verifyEmail(token: string) {
    return bffRequest<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  resendVerification() {
    return bffRequest<{ message: string }>("/api/auth/resend-verification", {
      method: "POST",
    });
  },

  sendSmsCode(phone: string) {
    return bffRequest<{ message?: string }>("/api/auth/sms/send-code", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  verifySms(input: SmsVerifyInput) {
    return bffRequest<Session>("/api/auth/sms/verify", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  linkPhone(phone: string, code: string) {
    return bffRequest<Session>("/api/auth/sms/link-phone", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    });
  },

  getGoogleStatus() {
    return bffRequest<{ enabled: boolean; clientId?: string }>(
      "/api/auth/google/status",
    );
  },

  signInWithGoogle(idToken: string, options?: { role?: AuthUser["role"] }) {
    return bffRequest<Session>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({
        idToken,
        ...(options?.role ? { role: options.role } : {}),
      }),
    });
  },

  linkGoogle(idToken: string) {
    return bffRequest<Session>("/api/auth/google/link", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },
};
