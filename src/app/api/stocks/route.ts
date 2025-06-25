import { NextResponse } from 'next/server';

const API_KEY = process.env.FINNHUB_API_KEY;
const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

// Company name + logo info
const companyInfo: Record<string, { name: string; logo: string }> = {
  AAPL: { name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com' },
  GOOGL: { name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com' },
  MSFT: { name: 'Microsoft Corp.', logo: 'https://logo.clearbit.com/microsoft.com' },
  AMZN: { name: 'Amazon.com Inc.', logo: 'https://logo.clearbit.com/amazon.com' },
  TSLA: { name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com' }
};

export async function GET(): Promise<NextResponse> {
  try {
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        if (!res.ok) throw new Error(`Error fetching ${symbol}`);
        const data = await res.json();

        // Basic history mock with minor fluctuations
        const history = Array.from({ length: 12 }, (_, i) => {
          const variance = 0.97 + Math.random() * 0.06; // ~ ±3%
          return +(data.c * variance).toFixed(2);
        });

        return {
          symbol,
          ...data,
          name: companyInfo[symbol]?.name ?? symbol,
          logo: companyInfo[symbol]?.logo ?? '',
          history
        };
      })
    );

    return NextResponse.json(quotes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}


