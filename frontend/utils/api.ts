export const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
export const COLORS = ["#ff7959", "#e5b85e", "#73b6a2", "#829cff", "#d784b6", "#aebf65"];

export function apiError(payload: unknown, fallback: string): string {
  return typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
    ? payload.message
    : fallback;
}

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  accessToken: string | null = null,
  onUnauthorized?: () => void
) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401) {
    if (!path.startsWith("/api/auth/")) {
      if (onUnauthorized) onUnauthorized();
      throw new Error("Session expired. Please sign in again.");
    }
  }
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(apiError(payload, `Request failed (${response.status})`));
  }
  return payload;
}
