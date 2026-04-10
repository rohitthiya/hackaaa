// src/pages/NewsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Search, Newspaper, ExternalLink, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getTopHeadlines, searchNews } from '../api/news';

const CATEGORIES = ['business', 'technology', 'health', 'science', 'entertainment'];

const SENTIMENT_MAP = {
  positive: { label: 'Bullish', color: 'var(--accent-emerald)', Icon: TrendingUp },
  negative: { label: 'Bearish', color: 'var(--accent-rose)', Icon: TrendingDown },
  neutral:  { label: 'Neutral', color: 'var(--text-muted)',   Icon: Minus },
};

// Fallback client-side sentiment if backend doesn't provide it
function guessSentiment(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  const pos = (text.match(/surge|rally|gain|growth|record|high|profit|strong|rise|up \d|outperform/g) || []).length;
  const neg = (text.match(/fall|drop|decline|loss|concern|headwind|weak|pressure|plunge|bearish|crash/g) || []).length;
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

function guessSector(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (text.match(/bank|nbfc|hdfc|icici|sbi|loan|credit/)) return 'Banking';
  if (text.match(/infosys|tcs|wipro|tech mahindra|hcl|software|tech/)) return 'Technology';
  if (text.match(/oil|gas|reliance|petroleum|energy|solar|adani/)) return 'Energy';
  if (text.match(/gold|silver|metal|steel|commodity/)) return 'Commodities';
  if (text.match(/real estate|realty|dlf|housing/)) return 'Real Estate';
  if (text.match(/rbi|inflation|gdp|economy|rupee|rate|cpi|policy/)) return 'Economy';
  if (text.match(/sensex|nifty|market|rally|bse|nse/)) return 'Markets';
  if (text.match(/pharma|health|medicine|drug/)) return 'Healthcare';
  return 'Finance';
}

function enrichArticle(article, index) {
  return {
    ...article,
    sector: article.sector || guessSector(article.title, article.description),
    sentiment: article.sentiment || guessSentiment(article.title, article.description),
    _key: article.url || index,
  };
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('business');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const fetchHeadlines = useCallback(async (cat) => {
    setLoading(true);
    setError('');
    try {
      const r = await getTopHeadlines({ country: 'in', category: cat });
      const raw = r.data || r || [];
      const arr = Array.isArray(raw) ? raw : [];
      setArticles(arr.map(enrichArticle));
    } catch (e) {
      setError('Could not load news. Is the backend running?');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load top headlines immediately on mount and when category changes
  useEffect(() => {
    fetchHeadlines(category);
  }, [category, fetchHeadlines]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      // Empty search → reload top headlines
      fetchHeadlines(category);
      return;
    }
    setSearching(true);
    setError('');
    try {
      const r = await searchNews(query.trim());
      const raw = r.data || r || [];
      const arr = Array.isArray(raw) ? raw : [];
      setArticles(arr.map(enrichArticle));
    } catch {
      setError('Search failed. Please try again.');
      setArticles([]);
    } finally {
      setSearching(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setQuery('');
  };

  const handleClearSearch = () => {
    setQuery('');
    fetchHeadlines(category);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Market News</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Real-time financial news and market intelligence</p>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 8, minWidth: 260 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              className="input-field"
              placeholder="Search stocks, sectors, companies…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
            />
          </div>
          <button type="submit" disabled={searching || loading} className="btn-primary" style={{ padding: '0 16px', height: 38, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} style={{ animation: (searching || loading) ? 'spin 1s linear infinite' : 'none' }} />
            {searching ? 'Searching…' : 'Search'}
          </button>
          {query && (
            <button type="button" onClick={handleClearSearch} style={{ padding: '0 12px', height: 38, fontSize: 13, borderRadius: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border-card)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </form>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              textTransform: 'capitalize', transition: 'all 0.15s',
              background: category === cat ? 'rgba(99,102,241,0.12)' : 'var(--bg-tertiary)',
              border: `1px solid ${category === cat ? 'var(--accent-indigo)' : 'var(--border-card)'}`,
              color: category === cat ? 'var(--accent-indigo)' : 'var(--text-secondary)',
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading || searching ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card" style={{ padding: 18 }}>
              <div className="skeleton" style={{ height: 160, borderRadius: 10, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <Newspaper size={40} style={{ color: 'var(--text-muted)', marginBottom: 14 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>News unavailable</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <Newspaper size={40} style={{ color: 'var(--text-muted)', marginBottom: 14 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>No articles found</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Try searching for a different keyword</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {articles.map((article, i) => {
            const sm = SENTIMENT_MAP[article.sentiment] || SENTIMENT_MAP.neutral;
            const SIcon = sm.Icon;
            return (
              <a key={article._key || i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div
                  className="card"
                  style={{ padding: 18, height: '100%', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                >
                  {article.urlToImage && (
                    <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 14, height: 160, background: 'var(--bg-tertiary)', flexShrink: 0 }}>
                      <img
                        src={article.urlToImage}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.parentNode.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-card)',
                      color: 'var(--text-muted)', textTransform: 'capitalize',
                    }}>
                      {article.sector || category}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      display: 'flex', alignItems: 'center', gap: 3,
                      color: sm.color,
                      background: `${sm.color}15`,
                    }}>
                      <SIcon size={10} /> {sm.label}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5,
                    marginBottom: 10, flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {article.title}
                  </h3>
                  {article.description && (
                    <p style={{
                      fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {article.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{article.source?.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {article.publishedAt && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
