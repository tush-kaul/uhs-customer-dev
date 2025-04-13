/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bundles/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
	"http://ec2-3-28-58-24.me-central-1.compute.amazonaws.com/api/v1";

async function fetchPricings(body: any) {
	try {
		const response = await axios.get(
			`${BASE_URL}/pricing?serviceId=${body.serviceId}&residenceTypeId=${body.residenceTypeId}`
		);
		const responseText = await response.data; // Helps debug API response

		if (!response) {
			throw new Error(`Failed to fetch bundles: ${response}`);
		}

		return responseText || [];
	} catch (error) {
		console.error("Error fetching bundles:", error);
		throw error;
	}
}

export async function POST(req: NextRequest) {
	try {
		// Parse the request body
		const body = await req.json();

		// Validate the required fields in the body
		if (!body.serviceId || !body.residenceTypeId) {
			return NextResponse.json(
				{
					success: false,
					message: "Missing required fields in the request body",
				},
				{ status: 400 }
			);
		}

		// Fetch bundles using the provided body
		const bundles = await fetchPricings(body);

		return NextResponse.json({
			success: true,
			message: "Bundles fetched successfully",
			data: bundles,
		});
	} catch (error: any) {
		console.error("Error fetching bundles:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
