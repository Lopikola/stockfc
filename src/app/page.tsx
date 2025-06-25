'use client';

import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { NewsItem } from '@/lib/types';

export default function Home(): JSX.Element {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const handleMagicLinkAndFetch = async () => {
      const supabase = createPagesBrowserClient();
      await supabase.auth.getSession();

      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        setError('Failed to fetch news items. Please try again later.');
        console.error('Failed to fetch news items:', error);
      } else {
        setNewsItems(data || []);
      }

      setLoading(false);
    };

    handleMagicLinkAndFetch();
    interval = setInterval(handleMagicLinkAndFetch, 5000); // live update every 5s
    return () => clearInterval(interval);
  }, [router]);

  return (
    <main className="p-8 text-white bg-black min-h-screen" aria-live="polite">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🚀 Stock News AI</h1>
        <div className="flex items-center gap-4">
          <a href="/stocks" className="text-sm hover:text-pink-400 transition">📈 Stocks</a>
          <a href="/" className="text-sm hover:text-pink-400 transition">📰 News</a>
          <a
            href="/signup"
            className="bg-white text-black px-3 py-1.5 rounded font-semibold text-sm hover:bg-zinc-200"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="border border-white text-white px-3 py-1.5 rounded font-semibold text-sm hover:bg-white hover:text-black"
          >
            Log In
          </a>
        </div>
      </header>

      <p className="text-lg mb-6">Live stock market headlines, AI-powered analysis, and trading signals.</p>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Stay Ahead of the Market</h2>
        <p className="mb-4 text-zinc-100">
          Create an account to receive real-time AI trading signals.
        </p>
        <div className="flex space-x-4">
          <a
            href="/signup"
            className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-zinc-200"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="border border-white text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-black"
          >
            Log In
          </a>
        </div>
      </section>

      {/* News Grid */}
      {error && (
        <div className="mt-6 p-4 bg-red-800 text-red-100 rounded-lg max-w-xl mx-auto" role="alert">
          {error}
        </div>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-800 rounded-lg h-24 mb-4" />
          ))
        ) : newsItems.length === 0 ? (
          <div className="col-span-full text-center text-zinc-400 text-lg">No news items found.</div>
        ) : (
          newsItems.map((item) => (
            <article
              key={item.id}
              className="p-4 border border-zinc-700 rounded-lg bg-zinc-900 shadow-md hover:shadow-xl transition-shadow duration-200 group"
              tabIndex={0}
            >
              <div className="text-sm text-zinc-400 mb-1">
                {new Date(item.published_at).toLocaleString()}
              </div>
              <div className="text-lg font-semibold group-hover:text-pink-400">{item.headline}</div>
              <div className="text-sm mt-1">Ticker: <span className="font-mono text-indigo-300">{item.ticker}</span></div>
              <div className="text-sm">Sentiment: <span className={
                item.sentiment === 'positive' ? 'text-green-400 font-semibold' :
                item.sentiment === 'negative' ? 'text-red-400 font-semibold' : 'text-zinc-300 font-semibold'
              }>{item.sentiment}</span></div>
              <div className="text-sm">Signal: <span className={
                item.signal === 'buy' ? 'text-green-400 font-semibold' :
                item.signal === 'sell' ? 'text-red-400 font-semibold' :
                item.signal === 'hold' ? 'text-orange-400 font-semibold' : 'text-zinc-300 font-semibold'
              }>{item.signal}</span></div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
















