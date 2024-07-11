// app/api/token/route.ts
import * as Ably from "ably";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const client = new Ably.Rest(process.env.ABLY_API_KEY as string);
  const tokenParams = { clientId: "ably-nextjs-demo" };
  const tokenRequest = await client.auth.createTokenRequest(tokenParams);
  return NextResponse.json(tokenRequest);
}
