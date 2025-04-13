import { data } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();

	console.log(`${process.env.API_RESPONSE_URL}/auth/verify-token`);

	try {
		const apiResponse = await axios.post(
			`${process.env.API_RESPONSE_URL}/auth/verify-token`,
			body
		);
		return NextResponse.json({
			data: apiResponse.data,
			code: apiResponse.status,
		});
	} catch (error: unknown) {
		console.error("Verification error details:", error);
		if (
			typeof error === "object" &&
			error !== null &&
			"response" in error
		) {
			const errResponse = error as {
				response?: { data?: JSON; status?: number };
			};

			return NextResponse.json({
				message: errResponse.response?.data || "Verify failed",
				code: errResponse.response?.status || 500,
			});
		}

		return NextResponse.json({
			message: "An unknown error occurred",
			code: 500,
		});
	}
}
