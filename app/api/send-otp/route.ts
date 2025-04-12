export async function POST(req: Request) {
  const { phone } = await req.json();
  console.log(`Sending OTP to ${phone}`);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}