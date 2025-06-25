// src/app/api/news/stored/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Normalize shape to match frontend expectations
    const parsed = data.map((item) => ({
      id: item.id || item.uuid || item.url, // fallback options
      title: item.title || item.headline || 'No title',
      source: item.source || 'Unknown',
      published_at: item.published_at || new Date().toISOString(),
      url: item.url,
      image: item.image || null,
      description: item.description || '',
      ticker: item.ticker || '',
      sentiment: item.sentiment?.toLowerCase?.() || '',
      signal: item.signal?.toLowerCase?.() || '',
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Error loading stored news:', err);
    return NextResponse.json(
      { error: 'Failed to load stored news' },
      { status: 500 }
    );
  }
}


