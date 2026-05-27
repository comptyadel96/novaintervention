export const ACCESS_TOKEN_COOKIE = "nova_access_token";
export const REFRESH_TOKEN_COOKIE = "nova_refresh_token";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
