"use server";

import { verifyUser } from "@/lib/service/user";

export default async function VerifyTokenAction(token: string) {
  const userData = await verifyUser(token);

  return userData;
}
