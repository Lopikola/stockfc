'use client';

import { useEffect, useState } from 'react';

type StockQuote = {
  symbol: string;
  name: string;
  logo: string;
  c: number;
  h: number;
  l: number;
  dp: number;
  history: number[];
};

export default function StocksPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<StockQuote[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/stocks');
        if (!res.ok) throw new Error('Failed to fetch stocks');
        const data = await res.json();
        setStocks(data);
      } catch (error) {
        setError('Failed to fetch stocks. Please try again later.');
        setStocks(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = stocks?.filter((s) =>
    `${s.symbol} ${s.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📈 Live Stock Dashboard</h1>

      <input
        type="text"
        placeholder="Search by symbol or company..."
        className="mb-4 p-2 w-full bg-gray-800 text-white border border-gray-600 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!loading && error && (
        <div className="mb-4 p-4 bg-red-800 text-red-100 rounded">{error}</div>
      )}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-800 rounded-lg h-24 mb-4" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm uppercase text-gray-400 border-b border-gray-700">
                <th className="p-2">Company</th>
                <th className="p-2">Price</th>
                <th className="p-2">High</th>
                <th className="p-2">Low</th>
                <th className="p-2">% Change</th>
                <th className="p-2">Sparkline</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((stock) => {
                const max = Math.max(...stock.history);
                const min = Math.min(...stock.history);
                const normalizedPoints = stock.history.map((v, i) => {
                  const x = (i / (stock.history.length - 1)) * 80; // spread across width
                  const y = 20 - ((v - min) / (max - min)) * 20;   // fit in 0–20 height
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                });

                return (
                  <tr key={stock.symbol} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="p-2 flex items-center gap-2">
                      <img src={stock.logo} alt={stock.symbol} className="w-5 h-5 rounded-sm" />
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-xs text-gray-400">{stock.name}</div>
                      </div>
                    </td>
                    <td className={`p-2 font-semibold ${stock.dp > 0 ? 'text-green-400' : stock.dp < 0 ? 'text-red-400' : 'text-white'}`}>
                      ${stock.c.toFixed(2)}
                    </td>
                    <td className="p-2">${stock.h.toFixed(2)}</td>
                    <td className="p-2">${stock.l.toFixed(2)}</td>
                    <td className={`p-2 ${stock.dp > 0 ? 'text-green-400' : stock.dp < 0 ? 'text-red-400' : 'text-white'}`}>
                      {stock.dp.toFixed(2)}%
                    </td>
                    <td className="p-2">
                      <svg width="80" height="20" viewBox="0 0 80 20">
                        <polyline
                          fill="none"
                          stroke={stock.dp > 0 ? '#4ade80' : stock.dp < 0 ? '#f87171' : '#d1d5db'}
                          strokeWidth="2"
                          points={normalizedPoints.join(' ')}
                        />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}




