// app/api/token/route.ts
import Ably from "ably";
import { NextRequest, NextResponse } from "next/server";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";

export async function GET(request: NextRequest) {
  const client = new Ably.Rest(process.env.ABLY_CLIENT_API_KEY as string);
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals, colors], length: 2 });
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: randomName });
  return NextResponse.json(tokenRequestData);
}


