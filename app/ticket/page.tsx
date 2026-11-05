"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenHeader } from "../components/app-shell";
import { Barcode, TicketSummary } from "../components/ticket-card";
import { activeTicket } from "../lib/tickets";

export default function TicketPage() {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

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
        <article className="ticket-detail-card">
          <TicketSummary ticket={activeTicket} />
          <div className="ticket-divider" />
          <Barcode interactive />
          <p className="barcode-instructions">Просканируйте этот штрихкод на турникете. Если возникли проблемы, обратитесь к работнику станции.</p>
        </article>
        <section className="ticket-features">
          <h3>Особенности билета</h3>
          <p>Билет действителен до 01:00 следующего дня.</p>
          <div className="ticket-purchase">
            <p>Куплен 5 ноября · № ПД {activeTicket.number}</p>
            <p>Перевозчик: АО &quot;СЗППК&quot;</p>
          </div>
        </section>
      </main>
    </div>
  );
}
