import { Dexie, type Table } from "dexie";
import { isValidRoute } from "./stations";
import { getTicketDates, type Ticket } from "./tickets";

export const ticketDb = new Dexie("jd-tickets") as Dexie & {
  tickets: Table<Ticket, string>;
};

ticketDb.version(1).stores({ tickets: "number, createdAt, expiresAt" });

export async function createTicket(departure: string, arrival: string) {
  if (!isValidRoute(departure, arrival)) {
    throw new Error("Выберите разные станции отправления и прибытия.");
  }

  const dates = getTicketDates(new Date());
  while (true) {
    let number = "41";
    for (let index = 0; index < 7; index++) {
      number += Math.floor(Math.random() * 10);
    }
    const ticket: Ticket = {
      number,
      departure,
      arrival,
      ...dates,
    };
    try {
      await ticketDb.tickets.add(ticket);
      return ticket;
    } catch (error) {
      if (!(error instanceof Dexie.ConstraintError)) throw error;
    }
  }
}
