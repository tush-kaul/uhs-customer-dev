export async function POST(req: Request) {
  const { otp } = await req.json();
  if (otp === "123456") {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
}