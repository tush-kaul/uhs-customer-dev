/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/utils/user";
import { apiRequest } from "../api";
import { cookies } from "next/headers";

export const getBookings = async (recurrencePlan?: string, status?: string) => {
	const queryParams = new URLSearchParams();
	const user = await getCurrentUser();
	if (status) {
		queryParams.append("status", status);
	}
	if (user) queryParams.append("user_id", user.id);

	return apiRequest<any>(
		`/bookings?${queryParams.toString()}&${recurrencePlan}`
	);
};

export const getBookingById = async (id: string) => {
	return apiRequest<any>(`/bookings/${id}`);
};

export const getAllServiceBookings = async () => {
	return apiRequest<any>(`/bookings/all`);
};

export const getStats = async (serviceName: string) => {
	return apiRequest<any>(`/bookings/stats?service_name=${serviceName}`);
};
