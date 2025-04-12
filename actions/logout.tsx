"use server";
import { cookies } from "next/headers";

export default async function LogoutAction() {
  const logout = (await cookies()).delete("auth_token");
  return true;
}
