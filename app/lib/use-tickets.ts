"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { ticketDb } from "./ticket-db";
import type { Ticket } from "./tickets";

export function useTickets() {
  return useLiveQuery(async () => {
    try {
      return { tickets: await ticketDb.tickets.orderBy("createdAt").reverse().toArray(), error: null };
    } catch {
      return { tickets: [] as Ticket[], error: "Не удалось загрузить билеты. Попробуйте открыть приложение снова." };
    }
  });
}

export function useTicket(number: string) {
  return useLiveQuery(async () => {
    try {
      return { ticket: await ticketDb.tickets.get(number), error: null };
    } catch {
      return { ticket: undefined, error: "Не удалось загрузить билет. Попробуйте открыть приложение снова." };
    }
  }, [number]);
}

export function useTicketTime(expiresAt?: number) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    function update() {
      const current = Date.now();
      setNow(current);
      clearTimeout(timer);
      if (expiresAt && expiresAt > current) {
        timer = setTimeout(update, Math.min(expiresAt - current, 2_147_483_647));
      }
    }
    function onVisibilityChange() {
      if (document.visibilityState === "visible") update();
    }
    update();
    window.addEventListener("focus", update);
    window.addEventListener("pageshow", update);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", update);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [expiresAt]);

  return now;
}
