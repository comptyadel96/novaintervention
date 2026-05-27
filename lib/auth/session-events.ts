export const SESSION_REFRESH_EVENT = "nova:session-refresh";

export function notifySessionRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSION_REFRESH_EVENT));
  }
}
