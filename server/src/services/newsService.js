import { newsApi } from "../config/newsClient.js";

// ─── Curated fallback articles (shown when NewsAPI is unavailable) ──────────
const FALLBACK_ARTICLES = [
  {
    title: "Sensex surges 600 pts on FII buying; Nifty reclaims 22,500 level",
    description: "Indian equity markets rallied sharply on Thursday driven by strong foreign institutional investor inflows and positive global cues. Sensex gained over 600 points, with Nifty closing above the 22,500 mark.",
    url: "https://economictimes.indiatimes.com",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: { name: "Economic Times" },
    sector: "Markets",
    sentiment: "positive",
  },
  {
    title: "RBI holds repo rate steady at 6.5%; signals cautious monetary stance",
    description: "The Reserve Bank of India kept benchmark interest rates unchanged at 6.5% for the third consecutive meeting, maintaining its focus on withdrawing monetary accommodation to ensure inflation remains aligned with the target.",
    url: "https://www.livemint.com",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: { name: "Livemint" },
    sector: "Finance",
    sentiment: "neutral",
  },
  {
    title: "Reliance Industries posts record Q3 profit on Jio and Retail momentum",
    description: "Reliance Industries Ltd reported its highest ever quarterly net profit, buoyed by exceptional performance in its telecom arm Jio and a robust recovery in Retail. The green energy pivot continues to attract investor attention.",
    url: "https://www.moneycontrol.com",
    urlToImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: { name: "Moneycontrol" },
    sector: "Energy",
    sentiment: "positive",
  },
  {
    title: "IT sector faces headwinds as US client spending moderates",
    description: "India's top IT companies including Infosys, TCS, and Wipro are navigating a challenging environment as discretionary spending by US and European clients remains subdued. Analysts expect a gradual recovery in FY26.",
    url: "https://www.business-standard.com",
    urlToImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    source: { name: "Business Standard" },
    sector: "Technology",
    sentiment: "negative",
  },
  {
    title: "Gold prices hit all-time high at ₹73,000 per 10g amid global uncertainty",
    description: "Gold prices in India reached a record high as geopolitical tensions and a weakening dollar drove safe-haven demand. Experts suggest the rally may continue if global uncertainty persists through Q2.",
    url: "https://zeebiz.com",
    urlToImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    source: { name: "Zee Business" },
    sector: "Commodities",
    sentiment: "positive",
  },
  {
    title: "HDFC Bank Q4 results: Net profit up 15% YoY, NIM stable at 3.7%",
    description: "HDFC Bank reported a solid performance in the fourth quarter with net profit growing 15% year-on-year. The bank's net interest margin remained stable, allaying concerns about pressure on profitability post-merger integration.",
    url: "https://www.ndtvprofit.com",
    urlToImage: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    source: { name: "NDTV Profit" },
    sector: "Banking",
    sentiment: "positive",
  },
  {
    title: "Midcap and smallcap stocks outperform large-caps; index hits fresh highs",
    description: "The BSE Midcap and Smallcap indices outperformed benchmarks on strong domestic institutional buying. Analysts expect the broader market rally to sustain as corporate earnings momentum holds up.",
    url: "https://www.thehindu.com/business/",
    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
    source: { name: "The Hindu Business" },
    sector: "Markets",
    sentiment: "positive",
  },
  {
    title: "India's CPI inflation eases to 4.2% in March, within RBI target range",
    description: "Consumer price inflation in India cooled to 4.2% in March 2025, falling within the Reserve Bank's comfort band of 2–6%. Lower food prices, especially vegetables and pulses, drove the moderation.",
    url: "https://economictimes.indiatimes.com",
    urlToImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    source: { name: "Economic Times" },
    sector: "Economy",
    sentiment: "positive",
  },
  {
    title: "Adani Green Energy secures $1.36 bn refinancing deal for solar projects",
    description: "Adani Green Energy has successfully refinanced $1.36 billion worth of solar project debt at improved terms, reflecting growing international confidence in India's renewable energy sector and the Adani group's creditworthiness.",
    url: "https://www.financialexpress.com",
    urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
    source: { name: "Financial Express" },
    sector: "Energy",
    sentiment: "positive",
  },
  {
    title: "Rupee strengthens to 83.2 against dollar on FII inflows and trade data",
    description: "The Indian Rupee appreciated to 83.2 against the US Dollar, its strongest level in two months, supported by robust foreign portfolio investor inflows and a narrowing trade deficit in February.",
    url: "https://www.businesstoday.in",
    urlToImage: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
    source: { name: "Business Today" },
    sector: "Forex",
    sentiment: "positive",
  },
];

// ─── Keyword → sector detection ───────────────────────────────────────────────
function inferSector(title = "", description = "") {
  const text = (title + " " + description).toLowerCase();
  if (text.match(/bank|nbfc|hdfc|icici|sbi|finance|loan|credit/)) return "Banking";
  if (text.match(/it |infosys|tcs|wipro|tech mahindra|hcl|software|technology/)) return "Technology";
  if (text.match(/oil|gas|reliance|petroleum|ongc|energy|solar|wind|adani green/)) return "Energy";
  if (text.match(/gold|silver|metal|steel|commodity|crude/)) return "Commodities";
  if (text.match(/realty|real estate|dlf|housing|construction/)) return "Real Estate";
  if (text.match(/rbi|inflation|gdp|economy|rupee|rate|cpi|policy/)) return "Economy";
  if (text.match(/sensex|nifty|market|rally|bse|nse|stock|midcap/)) return "Markets";
  if (text.match(/pharma|dr\.reddy|sun pharma|cipla|health|medicine/)) return "Healthcare";
  if (text.match(/auto|maruti|tata motors|mahindra|ev|electric vehicle/)) return "Auto";
  return "Finance";
}

function inferSentiment(title = "", description = "") {
  const text = (title + " " + description).toLowerCase();
  const positive = (text.match(/surges?|rally|gains?|growth|record|high|profit|strong|rises?|up \d|outperform/g) || []).length;
  const negative = (text.match(/fall|drop|decline|loss|concern|headwind|weak|pressure|plunge|bearish|crash/g) || []).length;
  if (positive > negative) return "positive";
  if (negative > positive) return "negative";
  return "neutral";
}

function enrichArticles(articles) {
  return articles.map(a => ({
    ...a,
    sector: inferSector(a.title, a.description),
    sentiment: inferSentiment(a.title, a.description),
  }));
}

// ─── Service functions ────────────────────────────────────────────────────────
export const fetchTopHeadlines = async (country = "in", category) => {
  try {
    const params = { country };
    if (category) params.category = category;

    const { data } = await newsApi.get("/top-headlines", { params });

    if (data.status === "ok" && data.articles && data.articles.length > 0) {
      return enrichArticles(data.articles);
    }

    // NewsAPI returned OK but empty or non-ok — serve fallback
    return getFallback(category);
  } catch (err) {
    // NewsAPI blocked (free tier, 426, CORS, etc.) — serve fallback
    console.warn("[newsService] NewsAPI unavailable, using fallback:", err.message);
    return getFallback(category);
  }
};

export const searchNews = async (query) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  try {
    const { data } = await newsApi.get("/everything", {
      params: { q: query.trim(), sortBy: "publishedAt", language: "en" },
    });

    if (data.status === "ok" && data.articles && data.articles.length > 0) {
      return enrichArticles(data.articles);
    }
    return searchFallback(query);
  } catch (err) {
    console.warn("[newsService] NewsAPI search unavailable, using fallback:", err.message);
    return searchFallback(query);
  }
};

// ─── Fallback helpers ─────────────────────────────────────────────────────────
function getFallback(category) {
  if (!category) return FALLBACK_ARTICLES;
  const catLower = category.toLowerCase();
  // Try to match category to sector
  const sectorMap = {
    business: ["Markets", "Finance", "Economy", "Banking"],
    technology: ["Technology"],
    health: ["Healthcare"],
    science: ["Economy"],
    entertainment: ["Markets"],
  };
  const sectors = sectorMap[catLower];
  if (sectors) {
    const filtered = FALLBACK_ARTICLES.filter(a => sectors.includes(a.sector));
    return filtered.length > 0 ? filtered : FALLBACK_ARTICLES;
  }
  return FALLBACK_ARTICLES;
}

function searchFallback(query) {
  const q = query.toLowerCase();
  const scored = FALLBACK_ARTICLES.map(a => ({
    ...a,
    score: [a.title, a.description, a.sector].join(" ").toLowerCase().includes(q) ? 1 : 0,
  }));
  const matched = scored.filter(a => a.score > 0);
  return matched.length > 0 ? matched : FALLBACK_ARTICLES.slice(0, 5);
}
