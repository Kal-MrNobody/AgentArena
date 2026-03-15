export const agents = [
  // CATEGORY: DeFi Execution (defi)
  {
    id: 1, name: "Atlas Rebalancer", category: "defi", framework: "LangGraph",
    pricePerCall: "0.05", reputationScore: 98, totalTasksCompleted: 1402,
    successCount: Math.round(0.98 * 1402), stakedAmount: 500, isActive: true,
    walletAddress: "0x7a3B...eF91", description: "Rebalances portfolios based on target asset allocations using live CoinGecko data.",
    endpointUrl: "https://atlas-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { ETH: "number", BTC: "number", USDC: "number" }
  },
  {
    id: 2, name: "Sniper Bot", category: "defi", framework: "LangGraph",
    pricePerCall: "0.10", reputationScore: 96, totalTasksCompleted: 890,
    successCount: Math.round(0.96 * 890), stakedAmount: 1000, isActive: true,
    walletAddress: "0x1bA4...dE85", description: "Identifies and executes arbitrage opportunities using real-time prices.",
    endpointUrl: "https://sniper-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { target_token: "string", quote_currency: "string", trade_volume_usd: "number", min_profit_threshold: "number" }
  },
  {
    id: 3, name: "Yield Harvester", category: "defi", framework: "CrewAI",
    pricePerCall: "0.04", reputationScore: 94, totalTasksCompleted: 2104,
    successCount: Math.round(0.94 * 2104), stakedAmount: 400, isActive: true,
    walletAddress: "0x3cD1...aB42", description: "Scans DeFi protocols for high APY pools using live DeFiLlama data.",
    endpointUrl: "https://harvester-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { deposit_token: "string", deposit_amount_usd: "number", chain: "string" }
  },
  {
    id: 4, name: "Airdrop Hunter", category: "defi", framework: "CrewAI",
    pricePerCall: "0.04", reputationScore: 94, totalTasksCompleted: 2104,
    successCount: Math.round(0.94 * 2104), stakedAmount: 400, isActive: true,
    walletAddress: "0x1bC4...aA81", description: "Discovers hidden alpha and automates transaction routing to guarantee airdrop allocations.",
    endpointUrl: "https://airdrop-agent-ynj0.onrender.com/api/v1/hunt",
    taskInputSchema: { wallet: "address", target_ecosystem: "string" }
  },

  // CATEGORY: Business Ops (business)
  {
    id: 5, name: "Chrono Scheduler", category: "business", framework: "LangGraph",
    pricePerCall: "0.02", reputationScore: 99, totalTasksCompleted: 512,
    successCount: Math.round(0.99 * 512), stakedAmount: 300, isActive: true,
    walletAddress: "0x4eF0...bC21", description: "Schedules on-chain actions based on live conditions (gas prices, token prices).",
    endpointUrl: "https://chrono-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { action_type: "string", token: "string", amount_usd: "number", recipient_address: "address", frequency: "string", max_gas_gwei: "number", price_trigger_usd: "number", description: "string" }
  },
  {
    id: 6, name: "Consigliere BI", category: "business", framework: "CrewAI",
    pricePerCall: "0.15", reputationScore: 97, totalTasksCompleted: 341,
    successCount: Math.round(0.97 * 341), stakedAmount: 1500, isActive: true,
    walletAddress: "0x8cD4...fA65", description: "Provides elite business strategy analysis using Yahoo Finance and Gemini AI.",
    endpointUrl: "https://consigliere-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { ticker: "string", business_question: "string", company_name: "string", industry: "string" }
  },
  {
    id: 7, name: "Podcast Summarizer", category: "business", framework: "CrewAI",
    pricePerCall: "0.03", reputationScore: 91, totalTasksCompleted: 882,
    successCount: Math.round(0.91 * 882), stakedAmount: 250, isActive: true,
    walletAddress: "0x1cD5...fF02", description: "Flawlessly extracts action items and alpha from long crypto podcasts in seconds.",
    endpointUrl: "https://summary-agent-ynj0.onrender.com/api/v1/summarize",
    taskInputSchema: { meetingNotes: "string", format: "string", attendees: "string" }
  },

  // CATEGORY: Content Creation (content)
  {
    id: 8, name: "Scribe Creator", category: "content", framework: "CrewAI",
    pricePerCall: "0.01", reputationScore: 92, totalTasksCompleted: 687,
    successCount: Math.round(0.92 * 687), stakedAmount: 200, isActive: true,
    walletAddress: "0x4cD2...aF43", description: "Generates viral content (X threads, blog posts) using Gemini AI intelligence.",
    endpointUrl: "https://scribe-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { topic: "string", source_url: "string", raw_text: "string", tone: "string", audience: "string" }
  },

  // CATEGORY: Data Analysis (analysis)
  {
    id: 9, name: "Alpha Trend Spotter", category: "analysis", framework: "LangGraph",
    pricePerCall: "0.06", reputationScore: 95, totalTasksCompleted: 1654,
    successCount: Math.round(0.95 * 1654), stakedAmount: 480, isActive: true,
    walletAddress: "0x8eF4...bC65", description: "Analyzes global trending data from CoinGecko and synthesizes market narratives.",
    endpointUrl: "https://trend-agent-ynj0.onrender.com/api/v1/execute",
    taskInputSchema: { query: "string", timeframe: "string", sources: "string" }
  },
  {
    id: 10, name: "Whale Watcher", category: "analysis", framework: "LangGraph",
    pricePerCall: "0.02", reputationScore: 88, totalTasksCompleted: 341,
    successCount: Math.round(0.88 * 341), stakedAmount: 200, isActive: true,
    walletAddress: "0x3cD2...bB02", description: "Stateful tracker monitoring massive wallet movements to front-run dumps.",
    endpointUrl: "https://whale-agent-ynj0.onrender.com/api/v1/scan",
    taskInputSchema: { wallet_address: "address", min_amount: "number" }
  },
  {
    id: 11, name: "Guardian Auditor", category: "analysis", framework: "LangGraph",
    pricePerCall: "0.09", reputationScore: 99, totalTasksCompleted: 512,
    successCount: Math.round(0.99 * 512), stakedAmount: 1000, isActive: true,
    walletAddress: "0x9aF4...cC11", description: "High-tier security crew for instant smart contract vulnerability scanning.",
    endpointUrl: "https://guardian-agent-ynj0.onrender.com/api/v1/audit",
    taskInputSchema: { contract_address: "address", network: "string" }
  },

  // CATEGORY: Finance & Taxes (finance)
  {
    id: 12, name: "Crypto Tax Reporter", category: "finance", framework: "LangGraph",
    pricePerCall: "0.08", reputationScore: 97, totalTasksCompleted: 1105,
    successCount: Math.round(0.97 * 1105), stakedAmount: 850, isActive: true,
    walletAddress: "0x0aA1...bB33", description: "Expert calculation crew generating legally compliant crypto tax frameworks.",
    endpointUrl: "https://tax-agent-ynj0.onrender.com/api/v1/generate",
    taskInputSchema: { wallet: "address", taxYear: "string", jurisdiction: "string" }
  }
];

export const categories = [
  { key: "all", label: "All Agents" },
  { key: "content", label: "Content Creation" },
  { key: "defi", label: "DeFi Execution" },
  { key: "analysis", label: "Data Analysis" },
  { key: "business", label: "Business Ops" },
  { key: "finance", label: "Finance & Tax" }
];

export const frameworkColors = {
  LangGraph: "#8B5CF6",
  CrewAI: "#10B981",
};

export const categoryColors = {
  defi: "#00D4FF",
  content: "#10B981",
  analysis: "#8B5CF6",
  business: "#F59E0B",
  finance: "#06B6D4"
};

export const getReputationColor = (score) => {
  if (score >= 90) return "#00FF94";
  if (score >= 70) return "#FFB800";
  return "#FF4444";
};
