// src/app/api/news/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function GET(): Promise<NextResponse> {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('Missing NEWS_API_KEY in environment variables');
    }

    const query = [
      'stocks',
      'market',
      'earnings',
      'shares',
      'IPO',
      'NASDAQ',
      'NYSE',
      'inflation',
      'Federal Reserve',
      'interest rates',
      'S&P',
      'Dow',
      'analyst rating',
      'quarterly results',
      'dividends'
    ].join(' OR ');

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', query);
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '50');
    url.searchParams.set('apiKey', NEWS_API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`NewsAPI fetch failed: ${res.statusText}`);

    const { articles } = await res.json();

    const parsed = articles.map((a: any) => ({
      id: a.url,
      title: a.title || 'No title available',
      description: a.description || '',
      url: a.url,
      image: a.urlToImage || null,
      source: a.source?.name || 'Unknown source',
      published_at: a.publishedAt || new Date().toISOString()
    }));

    for (const article of parsed) {
      await supabase
        .from('news_items')
        .upsert(article, { onConflict: 'id' }); // avoid duplicates
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Error fetching or storing news:', err);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}





