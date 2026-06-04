"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getWsUrl } from "@/lib/api/config";
import { tryRefreshSession } from "@/lib/api/bff-client";
import type { Mission } from "@/types/domain";

type WsHandler = (payload: unknown) => void;

type UseNovaWebSocketOptions = {
  enabled?: boolean;
  onNotification?: WsHandler;
  onMissionOffer?: (mission: Mission) => void;
  onMissionAccepted?: WsHandler;
  onMissionStatusChanged?: WsHandler;
};

async function fetchWsToken(): Promise<string | null> {
  try {
    let res = await fetch("/api/auth/ws-token", { credentials: "include" });
    if (res.status === 401) {
      const refreshed = await tryRefreshSession();
      if (!refreshed) return null;
      res = await fetch("/api/auth/ws-token", { credentials: "include" });
    }
    if (!res.ok) return null;
    const data = await res.json();
    return (data as { token?: string }).token ?? null;
  } catch {
    return null;
  }
}

export function useNovaWebSocket(options: UseNovaWebSocketOptions = {}) {
  const { enabled = true } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handlersRef = useRef(options);
  handlersRef.current = options;
  const [connected, setConnected] = useState(false);

  const disconnect = useCallback(() => {
    if (pingRef.current) clearInterval(pingRef.current);
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  const connect = useCallback(async () => {
    if (!enabled) return;
    disconnect();

    const token = await fetchWsToken();
    if (!token) return;

    const ws = new WebSocket(`${getWsUrl()}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      pingRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "ping" }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as {
          event: string;
          payload?: unknown;
        };
        const h = handlersRef.current;
        switch (msg.event) {
          case "notification":
            h.onNotification?.(msg.payload);
            break;
          case "mission.offer": {
            const p = msg.payload as { mission?: Mission };
            if (p?.mission) h.onMissionOffer?.(p.mission);
            break;
          }
          case "mission.accepted":
            h.onMissionAccepted?.(msg.payload);
            break;
          case "mission.status.changed":
            h.onMissionStatusChanged?.(msg.payload);
            break;
          default:
            break;
        }
      } catch {
        // ignore malformed
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (pingRef.current) clearInterval(pingRef.current);
      window.setTimeout(() => {
        if (!enabled) return;
        void (async () => {
          if (await tryRefreshSession()) {
            connect();
          }
        })();
      }, 2500);
    };
  }, [enabled, disconnect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connected, reconnect: connect, disconnect };
}
