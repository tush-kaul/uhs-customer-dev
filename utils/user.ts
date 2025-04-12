/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { getUser, verifyUser } from "@/lib/service/user";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  // Get token from cookies
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify and decode token
    const jwtData = await verifyUser(token);
    const decoded = jwtData.data.data;

    const userData = await getUser(decoded.userId);

    const user = userData.data;
    if (!user) {
      return null;
    }

    // Return user data without sensitive fields
    return user;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  // Remove authentication cookie
  (await cookies()).delete("access_token");
}
