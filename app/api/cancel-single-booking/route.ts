/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

async function cancelAll(bookingId: string) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/cancel`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ teamAvailabilityId: bookingId }), // Properly passing bookingId
			}
		);

		const responseText = await response.text(); // Helps debug API response
		console.log("Response Text:", responseText);

		if (!response.ok) {
			throw new Error(
				`Failed to cancel bookings: ${response.status} ${response.statusText}`
			);
		}

		const data = JSON.parse(responseText); // Convert text response to JSON
		return data.data || [];
	} catch (error) {
		console.error("Error cancelling bookings:", error);
		throw error;
	}
}

export async function POST(req: NextRequest) {
	try {
		const { bookingId } = await req.json();
		const cancelAllRes = await cancelAll(bookingId);

		return NextResponse.json({
			success: true,
			message: "Bookings cancelled successfully",
			data: cancelAllRes,
		});
	} catch (error: any) {
		console.error("Error fetching or transforming bookings:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
