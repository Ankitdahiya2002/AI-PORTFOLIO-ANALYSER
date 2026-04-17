# AI Portfolio Analyzer

The **AI Portfolio Analyzer** is a high-performance, purely client-side web application designed for processing, enriching, and analyzing Indian stock market portfolios and broker statements. It performs instant forensic auditing and behavioral strategy modeling using advanced AI.

## 🚀 Features

- **Universal Broker Parsing**: Compatible with ICICI, Kotak, Zerodha, Groww, Angel One, IIFL, Dhan, Upstox, Paytm Money, etc.
- **Progressive Live Enrichment**: Fetches live quotes, PE, Beta, Market Cap data via **Financial Modeling Prep (FMP)** and **Alpha Vantage**.
- **Supabase Integration**: Automatically logs every uploaded portfolio and its enriched data to a secure Supabase backend via a secure Serverless Vercel function.
- **AI-Powered Diagnostics**: Utilizes **Google Gemini (AIza)** capabilities to synthesize behavioral reports, generate rebalancing plans, and flag structural risks.
- **Premium Noir Dashboard**: Sleek, fully responsive UI built using vanilla HTML, TailwindCSS, and Chart.js.

## ⚙️ How It Works

1. **Upload**: Drag/drop a `.csv` or `.xlsx` exported from any Indian Broker.
2. **Schema Engine**: Automatically extracts symbols, quantities, and execution prices using universal pattern matching.
3. **Data Fetching**: Pulls live data from FMP and Alpha Vantage APIs to backfill gaps dynamically.
4. **Scoring**: Calculates an overall Audit Score, Diversification Index, Risk Matrices arrayed against benchmarks.
5. **Secure Storage**: Offloads the parsed data payload securely to a `portfolio_uploads` Postgres table in Supabase via Vercel Edge functions.

## 🔒 Configuration & Deployment (Vercel)

This application is meant to be hosted on **Vercel** with zero-configuration deployments.

### Local Setup
Since this is a static single-page app, there's no complex build process:
```bash
# Optional: clone the repository, run local server
npm install -g serve
serve .
```

### Environment Variables
For secure data forwarding to Supabase, these exact keys must be configured in your **Vercel Project Settings -> Environment Variables**:
- `SUPABASE_URL`: Your Supabase Project URL (`https://xyz.supabase.co`)
- `SUPABASE_KEY`: Your Supabase **Service Role** key (Required for secure writing without RLS limits via API endpoints).

External AI & Financial Data keys are inherently pre-configured or handled by the user gracefully directly within the application context.

## 🗄️ Supabase Table Initialization
To ensure proper functionality, execute the following SQL in your Supabase project:
```sql
CREATE TABLE portfolio_uploads (
  id            BIGSERIAL PRIMARY KEY,
  upload_id     UUID NOT NULL,
  uploaded_at   TIMESTAMPTZ DEFAULT NOW(),
  file_name     TEXT,
  symbol        TEXT,
  quantity      NUMERIC,
  avg_price     NUMERIC,
  ltp           NUMERIC,
  current_value NUMERIC,
  pnl           NUMERIC,
  sector        TEXT,
  asset_class   TEXT,
  market_cap    NUMERIC,
  beta          NUMERIC,
  pe_ratio      NUMERIC,
  data_source   TEXT
);
```

## 🛠️ Stack
- HTML5, CSS3, JavaScript (Vanilla JS logic)
- TailwindCSS (Styling)
- SheetJS (XLSX parsing)
- Chart.js
- Lucide Icons
- Node.js (Vercel Serverless Function `/api/save-portfolio`)
