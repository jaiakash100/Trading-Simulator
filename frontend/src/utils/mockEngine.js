// Mock Market State Engine for Offline Mode & Fallback Data

let mockStocks = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 185.50,
    initialPrice: 185.50,
    changePercent: 1.45,
    high: 187.20,
    low: 183.10,
    priceHistory: [181.2, 182.5, 183.0, 184.1, 183.8, 185.0, 185.5]
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    currentPrice: 128.40,
    initialPrice: 128.40,
    changePercent: 3.82,
    high: 130.10,
    low: 125.00,
    priceHistory: [122.0, 123.5, 125.0, 126.2, 127.0, 128.4]
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 215.20,
    initialPrice: 215.20,
    changePercent: -2.15,
    high: 220.00,
    low: 212.50,
    priceHistory: [222.0, 220.5, 218.0, 216.5, 215.2]
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 174.80,
    initialPrice: 174.80,
    changePercent: 0.95,
    high: 176.00,
    low: 173.20,
    priceHistory: [172.5, 173.0, 173.8, 174.2, 174.8]
  },
  {
    ticker: 'BTC-USD',
    name: 'Bitcoin',
    currentPrice: 64500.00,
    initialPrice: 64500.00,
    changePercent: 4.12,
    high: 65200.00,
    low: 62800.00,
    priceHistory: [62000, 62800, 63500, 64100, 64500]
  }
];

let mockPortfolio = {
  cashBalance: 88450.00,
  holdings: { 'AAPL': 50, 'NVDA': 20 },
  avgBuyPrices: { 'AAPL': 180.00, 'NVDA': 120.00 },
  netWorth: 100318.00,
  totalHoldingsValue: 11868.00,
  transactions: [
    {
      transactionId: 'TX-INIT-01',
      timestamp: '2026-08-20 12:00:00',
      type: 'BUY',
      ticker: 'AAPL',
      quantity: 50,
      price: 180.00,
      totalAmount: 9000.00
    },
    {
      transactionId: 'TX-INIT-02',
      timestamp: '2026-08-20 12:05:00',
      type: 'BUY',
      ticker: 'NVDA',
      quantity: 20,
      price: 120.00,
      totalAmount: 2400.00
    }
  ]
};

let mockBots = [
  {
    orderId: 'BOT-101',
    ticker: 'TSLA',
    orderType: 'BUY',
    quantity: 15,
    targetPrice: 205.00,
    strategyName: 'DipBuyerBot',
    executed: false
  },
  {
    orderId: 'BOT-102',
    ticker: 'NVDA',
    orderType: 'SELL',
    quantity: 10,
    targetPrice: 135.00,
    strategyName: 'TakeProfitBot',
    executed: false
  }
];

export const getMockStocks = () => {
  mockStocks = mockStocks.map(s => {
    const delta = (-0.01 + Math.random() * 0.02);
    const newPrice = Math.round((s.currentPrice * (1 + delta)) * 100) / 100;
    const history = [...s.priceHistory, newPrice].slice(-30);
    const high = Math.max(s.high, newPrice);
    const low = Math.min(s.low, newPrice);
    const change = Math.round(((newPrice - s.initialPrice) / s.initialPrice) * 10000) / 100;

    return {
      ...s,
      currentPrice: newPrice,
      changePercent: change,
      high,
      low,
      priceHistory: history
    };
  });
  return mockStocks;
};

// Calculate holdings metrics directly without calling getMockAiInsights
export const getMockPortfolio = () => {
  let holdingsValue = 0;
  let maxConc = 0;
  let dominantAsset = 'NONE';

  Object.keys(mockPortfolio.holdings).forEach(ticker => {
    const stock = mockStocks.find(s => s.ticker === ticker);
    const price = stock ? stock.currentPrice : 100;
    const val = mockPortfolio.holdings[ticker] * price;
    holdingsValue += val;
  });

  const totalHoldingsValue = Math.round(holdingsValue * 100) / 100;
  const netWorth = Math.round((mockPortfolio.cashBalance + holdingsValue) * 100) / 100;

  mockPortfolio.totalHoldingsValue = totalHoldingsValue;
  mockPortfolio.netWorth = netWorth;

  // Calculate risk metrics inline without circular calls
  Object.keys(mockPortfolio.holdings).forEach(ticker => {
    const stock = mockStocks.find(s => s.ticker === ticker);
    const price = stock ? stock.currentPrice : 100;
    const val = mockPortfolio.holdings[ticker] * price;
    const conc = netWorth > 0 ? val / netWorth : 0;
    if (conc > maxConc) {
      maxConc = conc;
      dominantAsset = ticker;
    }
  });

  const highRiskAlert = maxConc > 0.50;

  const riskAnalysis = {
    netWorth,
    highRiskAlert,
    dominantAsset,
    maxConcentrationPercent: Math.round(maxConc * 10000) / 100,
    riskMessage: highRiskAlert
      ? `CRITICAL RISK WARNING: ${dominantAsset} accounts for ${(maxConc * 100).toFixed(1)}% of your net worth (>50% limit)!`
      : 'PORTFOLIO STABLE: Asset concentration is well-diversified below the 50% threshold.',
    riskStatus: highRiskAlert ? 'HIGH_RISK_PLASMA_MAGENTA' : 'OPTIMAL_CYAN'
  };

  return {
    ...mockPortfolio,
    riskAnalysis
  };
};

export const executeMockTrade = (ticker, quantity, orderType) => {
  const stock = mockStocks.find(s => s.ticker === ticker);
  const price = stock ? stock.currentPrice : 100;
  const cost = quantity * price;

  if (orderType === 'BUY') {
    if (mockPortfolio.cashBalance < cost) {
      throw new Error(`Insufficient Funds! Required: $${cost.toFixed(2)}, Available: $${mockPortfolio.cashBalance.toFixed(2)}`);
    }
    mockPortfolio.cashBalance -= cost;
    const currentQty = mockPortfolio.holdings[ticker] || 0;
    const currentAvg = mockPortfolio.avgBuyPrices[ticker] || 0;
    const newQty = currentQty + quantity;
    const newAvg = ((currentQty * currentAvg) + (quantity * price)) / newQty;

    mockPortfolio.holdings[ticker] = newQty;
    mockPortfolio.avgBuyPrices[ticker] = Math.round(newAvg * 100) / 100;
  } else {
    const currentQty = mockPortfolio.holdings[ticker] || 0;
    if (currentQty < quantity) {
      throw new Error(`Insufficient shares of ${ticker}! Owned: ${currentQty}`);
    }
    mockPortfolio.cashBalance += cost;
    if (currentQty === quantity) {
      delete mockPortfolio.holdings[ticker];
      delete mockPortfolio.avgBuyPrices[ticker];
    } else {
      mockPortfolio.holdings[ticker] = currentQty - quantity;
    }
  }

  const tx = {
    transactionId: 'TX-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    type: orderType,
    ticker,
    quantity,
    price,
    totalAmount: Math.round(cost * 100) / 100
  };

  mockPortfolio.transactions.push(tx);
  return tx;
};

export const createMockBot = (ticker, quantity, targetPrice, orderType) => {
  const bot = {
    orderId: 'BOT-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    ticker,
    orderType,
    quantity,
    targetPrice,
    strategyName: 'AgentGammaLimitBot',
    executed: false
  };
  mockBots.push(bot);
  return bot;
};

export const getMockBots = () => mockBots;

// Calculate AI Insights directly from internal data structures without calling getMockPortfolio()
export const getMockAiInsights = () => {
  const totalChange = mockStocks.reduce((acc, s) => acc + s.changePercent, 0);
  const avgChange = totalChange / mockStocks.length;
  const score = Math.min(100, Math.max(0, Math.round(50 + avgChange * 10)));
  const trend = score >= 65 ? 'BULLISH' : score <= 35 ? 'BEARISH' : 'NEUTRAL';

  let holdingsValue = 0;
  let maxConc = 0;
  let dominantAsset = 'NONE';

  Object.keys(mockPortfolio.holdings).forEach(ticker => {
    const stock = mockStocks.find(s => s.ticker === ticker);
    const price = stock ? stock.currentPrice : 100;
    const val = mockPortfolio.holdings[ticker] * price;
    holdingsValue += val;
  });

  const netWorth = Math.round((mockPortfolio.cashBalance + holdingsValue) * 100) / 100;

  Object.keys(mockPortfolio.holdings).forEach(ticker => {
    const stock = mockStocks.find(s => s.ticker === ticker);
    const price = stock ? stock.currentPrice : 100;
    const val = mockPortfolio.holdings[ticker] * price;
    const conc = netWorth > 0 ? val / netWorth : 0;
    if (conc > maxConc) {
      maxConc = conc;
      dominantAsset = ticker;
    }
  });

  const highRisk = maxConc > 0.50;

  return {
    agentAlpha: {
      sentimentScore: score,
      trend,
      summary: `Agent Alpha signals ${trend} market momentum across assets with avg change of ${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%.`
    },
    agentBeta: {
      netWorth,
      highRiskAlert: highRisk,
      dominantAsset,
      maxConcentrationPercent: Math.round(maxConc * 10000) / 100,
      riskMessage: highRisk
        ? `CRITICAL RISK WARNING: ${dominantAsset} accounts for ${(maxConc * 100).toFixed(1)}% of your net worth (>50% limit)!`
        : 'PORTFOLIO STABLE: Asset concentration is well-diversified below the 50% threshold.',
      riskStatus: highRisk ? 'HIGH_RISK_PLASMA_MAGENTA' : 'OPTIMAL_CYAN'
    },
    activeBots: mockBots.length
  };
};
