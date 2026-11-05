export type Ticket = {
  number: string;
  departure: string;
  arrival: string;
  travelDate: string;
  createdAt: number;
  expiresAt: number;
};

export function getTicketRoute(ticket: Ticket) {
  return `${ticket.departure} — ${ticket.arrival}`;
}

export function getTicketDate(ticket: Ticket) {
  const [year, month, day] = ticket.travelDate.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(year, month - 1, day));
}

export function getTicketDates(now: Date) {
  return {
    travelDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
    createdAt: now.getTime(),
    expiresAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1).getTime(),
  };
}
