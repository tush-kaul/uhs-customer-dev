/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "../api";

export const getPricings = async (body: {
  serviceId: string;
  residenceTypeId: string;
}) => {
  return apiRequest<any>("/pricing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
