import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/utils/base-api";

// POST create a new ticket
export async function POST(request: NextRequest) {
  try {
    const headerReq = await headers();
    const token = headerReq.get("Authorization");

    // Check for token
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Validate request body
    if (!body.subject || !body.description) {
      return NextResponse.json(
        { error: "Subject and description are required" },
        { status: 400 }
      );
    }

    // Set up the request configuration with auth header
    const requestConfig = {
      headers: {
        Authorization: token,
      },
    };

    // Prepare the ticket data payload
    const ticketData = {
      subject: body.subject,
      description: body.description,
      userId: body.userId,
    };

    // Make request to backend API using axios
    const response = await api.post("/tickets", ticketData, requestConfig);

    // Return success response - with Axios, we can directly use response.data
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      // Get detailed error information
      const status = error.response?.status || 500;
      const errorData = error.response?.data || null;
      const message = error.response?.data?.message || error.message;

      console.error(`Ticket creation failed (${status}): ${message}`);

      return NextResponse.json(
        {
          error: `Failed to create ticket: ${message}`,
          details: errorData,
        },
        { status }
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error creating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
