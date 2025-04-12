import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const apiResponse = await axios.post(
      "http://ec2-3-28-58-24.me-central-1.compute.amazonaws.com/api/v1/auth/verify-otp",
      body
    );
    return NextResponse.json(
      { success: true, data: apiResponse.data },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const errResponse = error as {
        response?: { data?: JSON; status?: number };
      };

      return NextResponse.json(
        {
          message: errResponse.response?.data || "Login failed",
          code: errResponse.response?.status || 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "An unknown error occurred",
        code: 500,
      },
      { status: 500 }
    );
  }
}
