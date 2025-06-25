// src/app/api/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing FINNHUB_API_KEY' }, { status: 500 });
  }
  // Optionally, test a simple Finnhub endpoint
  const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`);
  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid or expired FINNHUB_API_KEY' }, { status: 500 });
  }
  return NextResponse.json({ message: 'API key is valid!' });
}
