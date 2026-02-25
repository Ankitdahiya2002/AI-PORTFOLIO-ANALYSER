# 📊 Portfolio Analyzer - Complete Prompts & Metrics Guide

## 🤖 AI PROMPT (Gemini 2.0 Flash)

### **System Prompt:**

```
const prompt = `You are the Super Portfolio Analyzer — an advanced Portfolio Structural Analyst + Human Translator. 
Your job is to audit portfolios with institutional PMS rigor while explaining findings in clear, relatable language.

🏁 MANDATORY START:
"Note: To give you a clear and honest starting point, I’m assuming a long-term investment horizon with a low risk tolerance. If that’s not you, just tell me — I’ll recalibrate the lens."

🚫 HARD GUARDRAILS:
- NO ADVICE: Never say BUY, SELL, TARGET, or PRICE.
- NO PROMISES: Never promise future returns.
- ACCURACY ONLY: Admit gaps if data is missing.
- TONE: Friendly, calm, professional, confident.

DATASET:
- Auditor Score: ${metrics.health}/100
- Alpha (Progress): ${metrics.alpha}%
- Beta (Volatility): ${metrics.beta}
- Institutional PE (Local Cache): ${metrics.localPE || 'NOT FOUND'}
- Security Flags (Audit Core): ${metrics.localFlags || '0'}
- DOMINANT PERSONA: ${metrics.dominantStyle || 'Mixed/Diversified'}
- Allocation: ${summary}

🧠 PERSONA LENS (For 'personaAnalysis'):
Analyze if the portfolio fits these legends:
1. Buffett (Value, Moat, Quality)
2. Lynch (GARP, Mid-Cap, Growth)
3. 100-Bagger (Micro-Cap, High Growth)
4. Jhunjhunwala (Indian Bull, Value+Growth)

🏁 LIVE AUDIT MANDATE:
- Real-Time Fundamentals: You MUST use Google Search to find the CURRENT PE Ratio, Beta, and Surveillance Status (ASM/GSM/Risk) for each major holding.
- Symbols to Research: ${summary}
- Source Priority: Screener.in, Moneycontrol, Tickertape.
- Return these in the 'researchedHoldings' object below with specific values so I can update the dashboard live.

OUTPUT STRICT JSON ONLY:
{ 
  "title": "Super Portfolio Audit", 
  "researcherDiagnostic": "Main executive summary (STRICTLY NO MATHEMATICS. Use easy-to-understand human language to describe the behavior and health of the system.)",
  "personaAnalysis": "Analyze the portfolio through the lens of the Dominant Persona identified above. Does it truly fit? If mixed, explain why.",
  "institutionalAudit": "The structural audit text (START with 'Institutional Architecture Audit...' and include the specific Alpha/Beta numbers here.)", 
  "performanceSeesaw": "Human explanation (Lead with 'Structural drag: X%...' or 'Alpha generation: X%...')",
  "concentrationSafety": "Concentration & Safety Check (HHI index, overlap risk, key Action Flags)",
  "sectorStory": "Where the money lives and what themes are driving the system",
  "actionFlagsSummary": "Justified Action Flags (EXIT/REDUCE/MONITOR/CORE/GAP) with simple 'why'",
  "scorecard": {
    "healthScore": "${metrics.health}",
    "riskGrade": "Risk Grade (Aggressive/Balanced/Conservative)",
    "qualityGrade": "Star/Steady/Fragile", 
    "suitabilityStatus": "e.g. High Growth",
    "weightedPE": "Current Industry Weighted PE",
    "redflagCount": "Confirmed via research",
    "researchedHoldings": { 
       "SYMBOL": { "ltp": 123.4, "pe": 25.1, "beta": 1.1, "risk": 0 } 
    }
  },
  "simpleNarrative": "Simplified version for a normal person (Use analogies: basket of fruit, steady boat, etc.)",
  "verdict": "Status (Strong, Steady, or Risky)"
}`;
```

---

## 📐 METRICS & FORMULAS

### **1. Portfolio Beta (β)**

**Formula:**
```
Portfolio Beta = Σ(Stock Beta × Weight)

Where:
- Weight = Stock Market Value / Total Portfolio Value
- Stock Beta = Individual stock's beta coefficient
```

**Code:**
```javascript
let betaSum = 0;
let betaWeight = 0;
holdings.forEach(h => {
    if (h.beta && h.beta > 0) {
        const weight = h.val / totalVal;
        betaSum += h.beta * weight;
        betaWeight += weight;
    }
});
const beta = betaWeight > 0.5 ? betaSum : 1.0; // Default to market neutral if no data
```

**Interpretation:**
- **β < 0.8**: Low volatility (defensive portfolio)
- **β = 0.8-1.2**: Medium volatility (balanced portfolio)
- **β > 1.2**: High volatility (aggressive portfolio)

**Data Source:** Institutional database (hardcoded for major stocks)

---

### **2. Jensen's Alpha (α)**

**Formula:**
```
Jensen's Alpha = Portfolio Return - Expected Return

Where:
Expected Return = Risk-Free Rate + β × (Market Return - Risk-Free Rate)

Constants (India):
- Risk-Free Rate = 7.0% (10-year G-Sec)
- Market Return = 12.0% (Nifty 50 long-term average)
```

**Code:**
```javascript
const totalVal = holdings.reduce((s, h) => s + h.val, 0) || 0;
const totalPnl = holdings.reduce((s, h) => s + h.pnl, 0) || 0;
const totalCost = totalVal - totalPnl;
const portfolioReturn = (totalCost > 0) ? (totalPnl / totalCost) * 100 : 0;

const riskFreeRate = 7.0;
const marketReturn = 12.0;
const expectedReturn = riskFreeRate + (beta * (marketReturn - riskFreeRate));
const alpha = (portfolioReturn - expectedReturn).toFixed(1);
```

**Interpretation:**
- **α > +2%**: Beating market (Smart Investor 🎯)
- **α = -2% to +2%**: Matching market (Index Follower 📊)
- **α < -2%**: Below market (Needs Improvement ⚠️)

---

### **3. Portfolio PE Ratio**

**Formula:**
```
Portfolio PE = Total Market Value / Total Earnings

Where:
Total Earnings = Σ(Market Value / Stock PE)
```

**Code:**
```javascript
let totalEarnings = 0;
let validPECount = 0;
holdings.forEach(h => {
    if (h.pe && h.pe > 0 && h.val > 0) {
        totalEarnings += h.val / h.pe;
        validPECount++;
    }
});
const portfolioPE = totalEarnings > 0 ? (totalVal / totalEarnings).toFixed(1) : null;
```

**Interpretation:**
- **PE < 15**: Undervalued/Value stocks
- **PE = 15-25**: Fair value
- **PE > 25**: Growth stocks/Overvalued

**Data Source:** Alpha Vantage API (real-time) + Institutional database (fallback)

---

### **4. HHI (Herfindahl-Hirschman Index)**

**Formula:**
```
HHI = Σ(Market Share²)

Where:
Market Share = (Stock Value / Total Portfolio Value) × 100
```

**Code:**
```javascript
const hhi = totalVal > 0 ? holdings.reduce((sum, h) => sum + Math.pow((h.val / totalVal) * 100, 2), 0) : 0;
```

**Interpretation:**
- **HHI < 1500**: Well diversified
- **HHI = 1500-2500**: Moderately concentrated
- **HHI > 2500**: Highly concentrated

**Usage:** Measures portfolio concentration risk

---

### **5. Health Score**

**Formula:**
```
Health Score = Diversification Score - Volatility Penalty + Risk-Adjusted Return Bonus

Where:
- Diversification Score = 100 - (HHI / 100)
- Volatility Penalty = |Beta - 1.0| × 10
- Risk-Adjusted Bonus = min(Alpha, 10) if Alpha > 0, else max(Alpha/2, -10)

Final Score = min(100, max(0, Health Score))
```

**Code:**
```javascript
const diversificationScore = 100 - (hhi / 100);
const volatilityPenalty = Math.abs(betaNum - 1.0) * 10;
const riskAdjustedBonus = parseFloat(alpha) > 0 ? Math.min(parseFloat(alpha), 10) : Math.max(parseFloat(alpha) / 2, -10);
const rawHealth = diversificationScore - volatilityPenalty + riskAdjustedBonus;
const health = Math.round(Math.min(100, Math.max(0, rawHealth)));
```

**Interpretation:**
- **Health > 75**: Professional Grade ⭐ (Institutional quality)
- **Health < 75**: Beginner Level (Needs improvement)

---

### **6. Persona Scoring Engine (Buffett, Lynch, etc.)**

**Concept:**
Assigns specific "Investment Styles" to the portfolio by scoring each holding against rules modeled after famous investors.

**Scoring Models:**

#### **A. Warren Buffett (Value + Moat)**
- **PE Ratio:** Bonus if PE < 20 (+40 pts) or PE < 25 (+20 pts).
- **Market Cap:** Huge Bonus if > ₹10 Trillion (+30 pts) or > ₹5 Trillion (+15 pts).
- **Volatility:** Bonus if Beta < 1.0 (+30 pts).
- **Base Quality:** Any stock with valid PE gets +10 pts.

#### **B. Peter Lynch (GARP - Growth at Reasonable Price)**
- **PE Ratio:** Sweet spot PE 15-25 (+40 pts). Penalty if PE < 15 (+20 only).
- **Market Cap:** Favors Mid-Caps (< ₹500 Billion) (+40 pts).
- **Volatility:** Favors moderate moves (Beta 0.8-1.2) (+20 pts).

#### **C. 100-Bagger (High Growth/Micro Cap)**
- **Market Cap:** Huge Bonus if Micro-Cap (< ₹100 Billion) (+50 pts).
- **Volatility:** Rewards high beta (> 1.2) (+30 pts).
- **Valuation:** Accepts high PE (> 30) (+20 pts).

#### **D. Rakesh Jhunjhunwala (Indian Bull)**
- **Market Cap:** Favors Large/Mid Caps (> ₹500 Billion) (+30 pts).
- **Valuation:** Tolerates higher PE (< 35) (+30 pts).
- **Bullishness:** Rewards High Beta (> 1.0) (+40 pts).

**Dominant Persona Logic:**
The system sums the scores for all holdings and identifies the "Winning Persona". This persona is then fed into the AI Prompt to customize the narrative.

---

### **7. Time-Weighted Return (TWR)**

**Formula:**
```
TWR = (Ending Value / Beginning Value) - 1

For single period:
TWR = (Current Value / Invested Value - 1) × 100%
```

**Code:**
```javascript
const twr = totalCost > 0 ? ((totalVal / totalCost) - 1) * 100 : 0;
```

**Interpretation:**
- **TWR > 0%**: Portfolio gained value
- **TWR = 0%**: Break-even
- **TWR < 0%**: Portfolio lost value

**Purpose:** Measures **portfolio manager skill** by eliminating the impact of cash flow timing

**Data Limitation:** Current implementation assumes single-period investment. Accurate multi-period TWR requires transaction history with dates.

---

### **8. Internal Rate of Return (IRR / Money-Weighted Return)**

**Formula:**
```
For single period:
IRR = TWR (same as holding period return)

For multi-period with cash flows:
IRR = rate where NPV of all cash flows = 0
(Requires XIRR calculation with transaction dates)
```

**Code:**
```javascript
const irr = twr; // Simplified for single period
```

**Interpretation:**
- **IRR > 0%**: Positive return on your investment timing
- **IRR = 0%**: Break-even
- **IRR < 0%**: Negative return

**Purpose:** Measures **investor results** by reflecting the impact of cash flow timing

**Data Limitation:** Current implementation assumes single-period investment. Accurate IRR requires transaction history with dates and amounts.

**Difference from TWR:**
- **TWR**: Manager skill (ignores when you invested)
- **IRR**: Your results (includes when you invested)

---

### **9. Market Cap Weight Distribution**

**Categories:**
```
High Conviction = Top 3 largest positions
Strategic Core = Next 7-10 positions
Tail Positions = All remaining positions
```

**Code:**
```javascript
const sorted = [...holdings].sort((a, b) => b.val - a.val);
const top3 = sorted.slice(0, 3).reduce((s, h) => s + h.val, 0);
const next10 = sorted.slice(3, 13).reduce((s, h) => s + h.val, 0);
const tail = sorted.slice(13).reduce((s, h) => s + h.val, 0);

const highConviction = (top3 / totalVal) * 100;
const strategicCore = (next10 / totalVal) * 100;
const tailPositions = (tail / totalVal) * 100;
```

**Ideal Distribution:**
- High Conviction: 30-50%
- Strategic Core: 30-40%
- Tail Positions: 10-30%

---

### **7. Sector & Asset Distribution**

**Categories:**
- **Sectors:** IT Services, Banking, FMCG, Healthcare, etc.
- **Assets:** Equity, Debt, Commodity, Real Estate

**Code:**
```javascript
const rawSectors = {};
const rawAssets = {};

holdings.forEach(h => {
    const sector = h.sector || 'Uncategorized';
    const asset = h.asset || 'Equity';
    
    rawSectors[sector] = (rawSectors[sector] || 0) + h.val;
    rawAssets[asset] = (rawAssets[asset] || 0) + h.val;
});
```

**Data Source:** Institutional database (hardcoded mappings)

---

### **8. Red Flags / Risk Indicators**

**Types:**
- **ASM (Additional Surveillance Measure)**: High volatility stocks
- **GSM (Graded Surveillance Measure)**: Price manipulation concerns
- **Risk Flag**: General risk indicator

**Code:**
```javascript
const redflags = holdings.filter(h => h.risk && h.risk > 0).length;
```

**Data Source:** Institutional database + Alpha Vantage API

---

## 🔄 DATA SOURCES

### **1. CSV Upload (User Portfolio)**
- Symbol
- Quantity
- Average Price
- LTP (Last Traded Price)
- Buy Value
- Current Value
- P&L

### **2. Institutional Database (Hardcoded)**
```javascript
const INSTITUTIONAL_DATABASE = {
    'RELIANCE': { pe: 28.5, risk: 0, beta: 1.15, sector: 'Energy', asset: 'Equity' },
    'TCS': { pe: 32.1, risk: 0, beta: 0.85, sector: 'IT Services', asset: 'Equity' },
    'HDFCBANK': { pe: 19.2, risk: 0, beta: 1.05, sector: 'Banking', asset: 'Equity' },
    // ... 50+ stocks
};
```

### **3. Alpha Vantage API (Real-Time)**
- PE Ratio
- Beta
- 52-week high/low
- Market cap

**API Endpoint:**
```
https://www.alphavantage.co/query?function=OVERVIEW&symbol={SYMBOL}.BSE&apikey={KEY}
```

### **4. Gemini API (AI Analysis)**
- Model: `gemini-2.0-flash`
- Tools: `google_search_retrieval` (for real-time stock data)

**API Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

---

## 📊 CALCULATED METRICS SUMMARY

| Metric | Formula | Range | Interpretation |
|--------|---------|-------|----------------|
| **Portfolio Beta** | Σ(Stock Beta × Weight) | 0.5 - 2.0 | Market sensitivity |
| **Jensen's Alpha** | Return - Expected Return | -10% to +10% | Excess returns |
| **Portfolio PE** | Market Value / Earnings | 10 - 40 | Valuation level |
| **HHI** | Σ(Market Share²) | 0 - 10000 | Concentration |
| **Health Score** | Diversification - Volatility + Alpha | 0 - 100 | Overall quality |
| **Total Value** | Σ(Quantity × LTP) | ₹0+ | Portfolio size |
| **Total P&L** | Current Value - Invested Value | ₹ any | Profit/Loss |
| **Portfolio Return** | (P&L / Invested) × 100 | % any | Return % |

---

## 🎯 DISPLAY LABELS (Grandmother-Friendly)

| Technical Term | Simple Label | Values |
|----------------|--------------|--------|
| Risk Grade | **How Risky?** | High Risk (Fast moves), Medium Risk (Balanced), Low Risk (Slow & steady) |
| Quality Grade | **Portfolio Quality** | Professional Grade ⭐, Beginner Level |
| Suitability | **Strategy Type** | Smart Investor 🎯, Index Follower 📊, Needs Improvement ⚠️ |
| Volatility Model | **Price Movement** | How much your portfolio value jumps up and down |
| Portfolio Alpha | **Extra Returns (vs Market)** | +X% more than Nifty 50 |

---

## 🔧 CONSTANTS USED

```javascript
// India Market Constants
const RISK_FREE_RATE = 7.0;      // 10-year G-Sec rate
const MARKET_RETURN = 12.0;      // Nifty 50 long-term average
const MARKET_BETA = 1.0;         // Nifty 50 baseline

// Thresholds
const ALPHA_THRESHOLD_HIGH = 2.0;    // Smart Investor
const ALPHA_THRESHOLD_LOW = -2.0;    // Needs Improvement
const HEALTH_THRESHOLD = 75;         // Professional Grade
const BETA_HIGH = 1.2;               // High volatility
const BETA_LOW = 0.8;                // Low volatility
```

---

## 📝 VERDICT LOGIC

```javascript
if (health >= 80 && alpha > 3) {
    verdict = "Strong";
    title = "Institutional Audit: Your companies are currently working in perfect harmony";
} else if (health >= 60 && alpha > 0) {
    verdict = "Steady";
    title = "Balanced Audit: Solid foundation with room for optimization";
} else {
    verdict = "Risky";
    title = "Caution Audit: Portfolio needs attention";
}
```

---

## 🎨 COLOR CODING

| Metric | Green (Good) | Amber (Neutral) | Red (Bad) |
|--------|--------------|-----------------|-----------|
| **Alpha** | > +2% | -2% to +2% | < -2% |
| **Health** | > 75 | 50-75 | < 50 |
| **Beta** | 0.8-1.2 | 0.6-0.8 or 1.2-1.5 | < 0.6 or > 1.5 |
| **HHI** | < 1500 | 1500-2500 | > 2500 |
| **P&L** | > 0 | - | < 0 |

---

## 🚀 API KEYS REQUIRED

```env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyDjtiGBiPZHBxF6XtA-eLm1Y3ibeAfSCoI
ALPHA_VANTAGE_API_KEY=DIX5W4U2T2050FIF
```

**Note:** Keys are currently hardcoded in HTML for simplicity.

---

## 📚 SUPPORTED BROKERS (11+)

1. Zerodha (Kite)
2. Groww
3. Kotak Neo
4. ICICI Direct
5. Upstox
6. Angel One
7. 5paisa
8. HDFC Securities
9. Dhan
10. IIFL Securities
11. Fyers
12. Geojit Financial
13. Paytm Money

---

## ✅ COMPLETE WORKFLOW

```
1. User uploads CSV from broker
   ↓
2. Parse CSV (auto-detect broker format)
   ↓
3. Enrich with institutional database
   ↓
4. Fetch real-time data from Alpha Vantage
   ↓
5. Calculate all metrics (Beta, Alpha, PE, HHI, Health)
   ↓
6. Send to Gemini API for AI analysis
   ↓
7. Display results with charts & insights
```

---

**This document contains ALL prompts, formulas, and metrics used in the Portfolio Analyzer!** 📊✨
