// app/api/token/route.ts
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
import Ably from "ably";

export async function GET(request: NextRequest) {
  return handleTokenRequest(request);
}

export async function POST(request: NextRequest) {
  return handleTokenRequest(request);
}

async function handleTokenRequest(request: NextRequest) {
  const client = new Ably.Rest(process.env.ABLY_API_KEY as string);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: "ably-nextjs-demo" });
  return NextResponse.json(tokenRequestData);
}
