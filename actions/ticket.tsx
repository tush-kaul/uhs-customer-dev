"use server";

import { createTickets, getTickets } from "@/lib/service/ticket";

export async function TicketsAction(page: number, limit: number) {
  const ticketsRes = await getTickets(page, limit);

  return ticketsRes;
}

export async function CreateTicketAction(subject: string, description: string) {
  const createTicketRes = await createTickets(subject, description);
  return createTicketRes;
}
