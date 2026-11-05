import Link from "next/link";
import { activeTicket, pastTickets } from "../lib/tickets";
import { Promotion } from "./promotion";
import { TicketCard } from "./ticket-card";

export function TicketList() {
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
        <Link href="/ticket" scroll={false} className="ticket-open" aria-label={`Открыть билет ${activeTicket.route}`}>
          <TicketCard ticket={activeTicket} active />
        </Link>
      </section>

      <section className="support" aria-labelledby="support-heading">
        <h2 id="support-heading">Нужна помощь?</h2>
        <p>Напишите нам, мы доступны 24/7</p>
        <span className="support-action">Написать в поддержку</span>
      </section>

      <section className="tickets-section past-tickets" aria-labelledby="past-heading">
        <h2 id="past-heading">Прошедшие</h2>
        {pastTickets.map((ticket) => <TicketCard key={ticket.number} ticket={ticket} />)}
      </section>
    </div>
  );
}
