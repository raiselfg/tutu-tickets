"use client";

import { useState } from "react";
import { getTicketDate, getTicketRoute, type Ticket } from "../lib/tickets";

export function TicketSummary({ ticket }: { ticket: Ticket }) {
  return (
    <>
      <h3 className="ticket-route">{getTicketRoute(ticket)}</h3>
      <p className="ticket-description">Разовый билет в одну сторону на {getTicketDate(ticket)}</p>
      <div className="train-category">
        <img src="/images/standard-train.png" width="20" height="20" alt="" />
        <p>Билет подходит для поездов категории стандарт (обычный пригородный поезд)</p>
      </div>
    </>
  );
}

export function Barcode({ interactive = false }: { interactive?: boolean }) {
  const [turning, setTurning] = useState(false);
  const image = <img src="/images/ticket-barcode.png" width="1005" height="385" alt="Штрихкод билета" draggable="false" />;

  return interactive ? (
    <button
      type="button"
      className={`barcode barcode-interactive${turning ? " barcode-animated" : ""}`}
      aria-label="Повернуть штрихкод"
      onClick={() => setTurning(true)}
      onAnimationEnd={() => setTurning(false)}
    >
      {image}
    </button>
  ) : <div className="barcode">{image}</div>;
}

export function TicketCard({ ticket, active = false }: { ticket: Ticket; active?: boolean }) {
  return (
    <div className={`ticket-card${active ? " ticket-card-active" : ""}`}>
      <TicketSummary ticket={ticket} />
      {active && <Barcode />}
      <p className="ticket-number">№ ПД {ticket.number}</p>
    </div>
  );
}
