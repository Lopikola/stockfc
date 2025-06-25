'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    headline: '',
    ticker: '',
    sentiment: '',
    signal: '',
  })

  useEffect(() => {
    fetchNews()
  }, [])

  async function fetchNews() {
    setLoading(true)
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Failed to load news:', error)
    } else {
      setNewsItems(data || [])
    }

    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('news_items').insert([
      {
        headline: form.headline,
        ticker: form.ticker,
        sentiment: form.sentiment,
        signal: form.signal,
      },
    ])

    if (error) {
      console.error('Insert error:', error)
    } else {
      setForm({ headline: '', ticker: '', sentiment: '', signal: '' })
      fetchNews()
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('news_items').delete().eq('id', id)
    if (error) {
      console.error('Delete error:', error)
    } else {
      fetchNews()
    }
  }

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🛠 Admin Panel</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Headline"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ticker (e.g., AAPL)"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={form.ticker}
          onChange={(e) => setForm({ ...form, ticker: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sentiment (bullish / bearish / neutral)"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={form.sentiment}
          onChange={(e) => setForm({ ...form, sentiment: e.target.value })}
        />
        <input
          type="text"
          placeholder="Signal (buy / sell / hold)"
          className="w-full p-2 rounded bg-zinc-800 text-white"
          value={form.signal}
          onChange={(e) => setForm({ ...form, signal: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded font-semibold"
        >
          Add News
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">📰 Current News</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-zinc-900 rounded border border-zinc-700"
            >
              <p className="text-zinc-400 text-sm">{item.published_at}</p>
              <h3 className="text-lg font-semibold">{item.headline}</h3>
              <p className="text-sm">Ticker: {item.ticker}</p>
              <p className="text-sm">Sentiment: {item.sentiment}</p>
              <p className="text-sm">Signal: {item.signal}</p>
              <button
                className="mt-2 text-red-400 text-sm"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
