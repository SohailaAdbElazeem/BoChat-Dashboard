// utils/auth.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DecodedJWT = { exp?: number; iat?: number; [k: string]: any };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

export function decodeJwt(token: string): DecodedJWT | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSec = 30): boolean {
  const d = decodeJwt(token);
  if (!d?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return d.exp - skewSec <= now;
}

export function secondsToExpiry(token: string): number {
  const d = decodeJwt(token);
  const now = Math.floor(Date.now() / 1000);
  return (d?.exp ?? now) - now;
}
