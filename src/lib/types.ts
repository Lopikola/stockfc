export interface NewsItem {
  id: string;
  headline: string;
  ticker: string;
  sentiment: string;
  signal: string;
  published_at: string;
}

export interface NewsFormData {
  headline: string;
  ticker: string;
  sentiment: string;
  signal: string;
}