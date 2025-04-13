/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/utils/base-api";
import { NextResponse } from "next/server";

async function fetchResidence() {
	const response = await api(`/residences`);

	return response.data || [];
}

export async function GET() {
	try {
		const residences = await fetchResidence();

		return NextResponse.json({
			success: true,
			message: "residences fetched and transformed successfully",
			data: residences,
		});
	} catch (error: any) {
		console.error("Error fetching or transforming bookings:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
