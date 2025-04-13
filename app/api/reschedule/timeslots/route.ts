/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

async function fetchRescheduleTimeslots(
	teamId: string,
	date: string,
	minutes: number
) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/schedules/team-date?date=${date}&minutes=${minutes}&teamId=${teamId}`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch reschedule timeslots");
	}
	const data = await response.json();
	return data || [];
}

export async function POST(req: NextRequest) {
	try {
		const { teamId, date, minutes } = await req.json();
		if (!teamId || !date || !minutes) {
			return NextResponse.json(
				{
					success: false,
					message: "Missing required fields in the request body",
				},
				{ status: 400 }
			);
		}
		const timeslots = await fetchRescheduleTimeslots(teamId, date, minutes);

		return NextResponse.json({
			success: true,
			message:
				"Reschedule timeslots fetched and transformed successfully",
			data: timeslots.data,
		});
	} catch (error: any) {
		console.error("Error fetching timeslots:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
