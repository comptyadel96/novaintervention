"use client";

import { Bell } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  clientNotificationsApi,
  type AppNotification,
} from "@/services/api/client";
import { useNovaWebSocket } from "@/hooks/useNovaWebSocket";

export function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);

  const load = useCallback(async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        clientNotificationsApi.unreadCount(),
        clientNotificationsApi.list({ unreadOnly: false, limit: 10 }),
      ]);
      setUnread(countRes.unreadCount ?? listRes.unreadCount ?? 0);
      setItems(listRes.items ?? []);
    } catch {
      setUnread(0);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useNovaWebSocket({
    enabled: true,
    onNotification: () => {
      load();
    },
    onMissionOffer: () => {
      load();
    },
  });

  const handleMarkRead = async (id: string) => {
    await clientNotificationsApi.markRead(id);
    load();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-bg-alt transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-primary-dk" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-auto bg-white border border-border rounded-2xl shadow-xl z-[500] p-2">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted px-3 py-2">
            Notifications
          </p>
          {items.length === 0 ? (
            <p className="text-sm text-text-muted px-3 py-4">Aucune notification</p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-colors ${
                  n.read ? "opacity-60" : "bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <p className="text-sm font-bold text-primary-dk">{n.title}</p>
                <p className="text-xs text-text-muted line-clamp-2">{n.body}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
