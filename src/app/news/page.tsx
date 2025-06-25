'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  id: string;
  title: string;
  source: string;
  published_at: string;
  url: string;
  image?: string;
  description?: string;
  ticker?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  signal?: 'buy' | 'sell' | 'hold';
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news/stored');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error('Failed to load news:', err);
      }
    };
    fetchNews();
  }, []);

  const filtered = news.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.ticker?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query);

    const matchesSentiment =
      !sentimentFilter || item.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  return (
    <main className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📰 Market News</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search headlines or tickers"
          className="bg-zinc-800 p-2 rounded text-white w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
          className="bg-zinc-800 p-2 rounded text-white"
        >
          <option value="">All Sentiments</option>
          <option value="positive">👍 Positive</option>
          <option value="negative">👎 Negative</option>
          <option value="neutral">😐 Neutral</option>
        </select>
      </div>

      {/* News Items */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-zinc-400">No news found.</p>
        ) : (
          filtered.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 hover:bg-zinc-800 transition rounded-lg overflow-hidden shadow"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-zinc-400">
                  {item.source} •{' '}
                  {new Date(item.published_at).toLocaleString()}
                </p>
                {item.ticker && (
                  <p className="text-sm mt-1 text-zinc-300">
                    Ticker: <span className="font-mono">{item.ticker}</span>
                  </p>
                )}
                {item.sentiment && (
                  <p
                    className={`text-sm mt-1 font-semibold ${
                      item.sentiment === 'positive'
                        ? 'text-green-400'
                        : item.sentiment === 'negative'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    Sentiment: {item.sentiment}
                  </p>
                )}
                {item.signal && (
                  <p className="text-sm mt-1 font-semibold">
                    Signal:{' '}
                    <span
                      className={
                        item.signal === 'buy'
                          ? 'text-green-400'
                          : item.signal === 'sell'
                          ? 'text-red-400'
                          : 'text-orange-300'
                      }
                    >
                      {item.signal}
                    </span>
                  </p>
                )}
              </div>
            </a>
          ))
        )}
      </div>
    </main>
  );
}



