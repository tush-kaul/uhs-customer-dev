import { any } from "zod";
import { apiRequest } from "../api";

export const verifyUser = (token: string): Promise<any> => {
  return apiRequest("/users/verify ", {
    method: "POST",
    body: JSON.stringify({ token: token }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getUser = async (userId: string): Promise<any> => {
  return apiRequest(`/users/${userId}`);
};
