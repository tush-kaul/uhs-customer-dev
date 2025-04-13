/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { cookies, headers } from "next/headers";

interface ResidenceDurationMap {
	[key: string]: number;
}

const residenceDurationMap: ResidenceDurationMap = {
	Studio: 45,
	"1BHK Apartment": 60,
	"1BHK + Study Room": 90,
	"2BHK Apartment": 120,
	"2BHK Townhouse": 150,
	"3BHK Apartment": 150,
	"3BHK Townhouse": 180,
	"3BHK Villa": 210,
	"4BHK Apartment": 210,
	"4BHK Villa": 240,
	"5BHK Apartment": 300,
	"5BHK Villa": 300,
};

async function fetchBookingStats(token: string, serviceName: string) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/service-stats?service_name=${serviceName}`,
		{
			headers: {
				authorization: token,
			},
		}
	);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch bookings: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();

	return data.data || [];
}

export async function GET(req: NextRequest) {
	try {
		const headerReq = await headers();

		const token = headerReq.get("Authorization");
		const { searchParams } = new URL(req.url);
		const serviceName = searchParams.get("service_name") || undefined;
		console.log("service name", serviceName);
		const bookingStat = await fetchBookingStats(
			token as string,
			serviceName as string
		);

		return NextResponse.json({
			success: true,
			message: "Bookings fetched and transformed successfully",
			data: bookingStat.stats,
		});
	} catch (error: any) {
		console.error("Error fetching or transforming bookings:", error);
		return NextResponse.json(
			{ success: false, message: error.message || "An error occurred" },
			{ status: 500 }
		);
	}
}
