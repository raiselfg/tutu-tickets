"use client";

import { useSearchParams } from "next/navigation";
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
  const number = useSearchParams().get("number") ?? "";
  const result = useTicket(number);
  const ticket = result?.ticket;
  const now = useTicketTime(ticket?.expiresAt);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (result && !result.error && (!ticket || (now > 0 && ticket.expiresAt <= now))) {
      window.location.replace("/");
    }
  }, [result, ticket, now]);

  return (
    <div
      className={`detail-screen${closing ? " detail-closing" : ""}`}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget) {
          window.location.replace("/");
        }
      }}
      onKeyDown={(event) => { if (event.key === "Escape") setClosing(true); }}
    >
      <ScreenHeader>
        <a href="/" className="back-button" onClick={(event) => { event.preventDefault(); setClosing(true); }}>
          <svg viewBox="0 0 12 22" aria-hidden="true"><path d="M10 2 1 11l9 9" /></svg>
          Мои билеты
        </a>
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
