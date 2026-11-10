"use client";

import { getTicketRoute } from "../lib/tickets";
import { useTickets, useTicketTime } from "../lib/use-tickets";
import { Promotion } from "./promotion";
import { TicketCard } from "./ticket-card";

export function TicketList() {
  const result = useTickets();
  const tickets = result?.tickets ?? [];
  const nextExpiry = tickets.reduce<number | undefined>((next, ticket) => (
    ticket.expiresAt > Date.now() && (next === undefined || ticket.expiresAt < next) ? ticket.expiresAt : next
  ), undefined);
  const now = useTicketTime(nextExpiry);
  const activeTickets = tickets.filter((ticket) => ticket.expiresAt > now);
  const pastTickets = tickets.filter((ticket) => ticket.expiresAt <= now);

  return (
    <div className="ticket-list">
      <Promotion spacedPrice />

      <aside className="ticket-notice">
        <h2>Билет может появиться не сразу</h2>
        <p>После оплаты оформление занимает <strong>до 1 минуты.</strong></p>
        <ul>
          <li>Не удаляйте приложение: билет привязан к этому устройству</li>
          <li>Передать билет на другое устройство не получится</li>
        </ul>
      </aside>

      <section className="tickets-section" aria-labelledby="active-heading">
        <h2 id="active-heading">Активированные</h2>
        {!result && <p className="ticket-list-state" role="status">Загрузка билетов…</p>}
        {result?.error && <p className="ticket-list-state" role="alert">{result.error}</p>}
        {result && !result.error && activeTickets.length === 0 && <p className="ticket-list-state">Нет активированных билетов</p>}
        {activeTickets.map((ticket) => (
          <a key={ticket.number} href={`/ticket?number=${ticket.number}`} className="ticket-open" aria-label={`Открыть билет ${getTicketRoute(ticket)}`}>
            <TicketCard ticket={ticket} active />
          </a>
        ))}
      </section>

      <section className="support" aria-labelledby="support-heading">
        <h2 id="support-heading">Нужна помощь?</h2>
        <p>Напишите нам, мы доступны 24/7</p>
        <span className="support-action">Написать в поддержку</span>
      </section>

      <section className="tickets-section past-tickets" aria-labelledby="past-heading">
        <h2 id="past-heading">Прошедшие</h2>
        {result && !result.error && pastTickets.length === 0 && <p className="ticket-list-state">Нет прошедших билетов</p>}
        {pastTickets.map((ticket) => <TicketCard key={ticket.number} ticket={ticket} />)}
      </section>
    </div>
  );
}
