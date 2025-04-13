/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

async function reschedule(data: any) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/schedules/reschedule`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch reschedule timeslots");
	}
	const responseData = await response.json();
	return responseData || [];
}

export async function POST(req: NextRequest) {
	try {
		const { teamAvailabilityId, scheduleId, startTime, endTime } =
			await req.json();

		if (!teamAvailabilityId || !scheduleId || !startTime || !endTime) {
			return NextResponse.json(
				{
					success: false,
					message: "Missing required fields in the request body",
				},
				{ status: 400 }
			);
		}
		const data = {
			teamAvailabilityId,
			scheduleId,
			startTime,
			endTime,
			status: "rescheduled",
		};
		const rescheduleRes = await reschedule(data);

		return NextResponse.json({
			success: true,
			message: "Rescheduled successfully",
			data: rescheduleRes.data,
		});
	} catch (error: any) {
		console.error("Error rescheduling:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
