"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ScreenHeader } from "../components/app-shell";
import { LoadingScreen } from "../components/loading-screen";
import { Barcode, TicketSummary } from "../components/ticket-card";
import { getTicketDate } from "../lib/tickets";
import { useTicket, useTicketTime } from "../lib/use-tickets";

export default function TicketPage() {
  return <Suspense fallback={<LoadingScreen />}><TicketContent /></Suspense>;
}

function TicketContent() {
  const router = useRouter();
  const number = useSearchParams().get("number") ?? "";
  const result = useTicket(number);
  const ticket = result?.ticket;
  const now = useTicketTime(ticket?.expiresAt);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (result && !result.error && (!ticket || (now > 0 && ticket.expiresAt <= now))) {
      router.replace("/", { scroll: false });
    }
  }, [result, ticket, now, router]);

  return (
    <div
      className={`detail-screen${closing ? " detail-closing" : ""}`}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget) {
          router.replace("/", { scroll: false });
        }
      }}
      onKeyDown={(event) => { if (event.key === "Escape") setClosing(true); }}
    >
      <ScreenHeader>
        <Link href="/" prefetch={false} className="back-button" onNavigate={(event) => { event.preventDefault(); setClosing(true); }}>
          <svg viewBox="0 0 12 22" aria-hidden="true"><path d="M10 2 1 11l9 9" /></svg>
          Мои билеты
        </Link>
        <h1>Билет</h1>
      </ScreenHeader>
      <main className="detail-content">
        {result?.error ? <p className="ticket-load-error" role="alert">{result.error}</p> : !ticket || ticket.expiresAt <= now ? <LoadingScreen /> : <>
        <article className="ticket-detail-card">
          <TicketSummary ticket={ticket} />
          <div className="ticket-divider" />
          <Barcode interactive />
          <p className="barcode-instructions">Просканируйте этот штрихкод на турникете. Если возникли проблемы, обратитесь к работнику станции.</p>
        </article>
        <section className="ticket-features">
          <h3>Особенности билета</h3>
          <p>Билет действителен до 01:00 следующего дня.</p>
          <div className="ticket-purchase">
            <p>Куплен {getTicketDate(ticket)} · № ПД {ticket.number}</p>
            <p>Перевозчик: АО &quot;СЗППК&quot;</p>
          </div>
        </section>
        </>}
      </main>
    </div>
  );
}
