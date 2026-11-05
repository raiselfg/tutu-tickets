export type Ticket = {
  route: string;
  date: string;
  number: string;
};

export const activeTicket: Ticket = {
  route: "Ручеёк (36 км) — Санкт-Петербург-Витеб.",
  date: "5 ноября",
  number: "411000014",
};

export const pastTickets: Ticket[] = [
  { route: "Проспект Славы — Павловск", date: "4 ноября", number: "410959916" },
  { route: "Новолисино — Царское Село", date: "4 ноября", number: "410930700" },
  { route: "Санкт-Петербург-Витеб. — Новолисино", date: "3 ноября", number: "410741391" },
];
