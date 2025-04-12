"use server";

import { getPricings } from "@/lib/service/pricing";

export default async function PricingAction(body: {
  serviceId: string;
  residenceTypeId: string;
}) {
  const pricing = await getPricings(body);

  return pricing.data;
}
