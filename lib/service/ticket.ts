import { getCurrentUser } from "@/utils/user";
import { apiRequest } from "../api";

export const getTickets = async (page: number, limit: number) => {
  const user = await getCurrentUser();
  return apiRequest<any>(`/tickets/${user.id}?page=${page}&limit=${limit}`);
};

export const createTickets = async (subject: string, description: string) => {
  const user = await getCurrentUser();
  return apiRequest<any>(`/tickets`, {
    method: "POST",
    body: JSON.stringify({ subject, description, userId: user.id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
