export const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
export const COLORS = ["#ff7959", "#e5b85e", "#73b6a2", "#829cff", "#d784b6", "#aebf65"];

export function apiError(payload: unknown, fallback: string): string {
  return typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
    ? payload.message
    : fallback;
}
