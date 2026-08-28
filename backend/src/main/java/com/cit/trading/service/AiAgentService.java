package com.cit.trading.service;

import com.cit.trading.model.Stock;
import com.cit.trading.model.TradingBot;
import com.cit.trading.model.UserPortfolio;
import com.cit.trading.repository.MarketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AiAgentService {

    public static final double MAX_CONCENTRATION_THRESHOLD = 0.50; // 50% max concentration limit

    private final MarketRepository marketRepository;
    private final ExecutionService executionService;
    private final List<TradingBot> activeBots = new CopyOnWriteArrayList<>();

    @Autowired
    public AiAgentService(MarketRepository marketRepository, ExecutionService executionService) {
        this.marketRepository = marketRepository;
        this.executionService = executionService;
    }

    public TradingBot registerBot(String ticker, String orderType, int quantity, double targetPrice, String strategyName) {
        TradingBot bot = new TradingBot(ticker, orderType, quantity, targetPrice, strategyName);
        activeBots.add(bot);
        return bot;
    }

    public List<TradingBot> getActiveBots() {
        List<TradingBot> pending = new ArrayList<>();
        for (TradingBot bot : activeBots) {
            if (!bot.isExecuted()) {
                pending.add(bot);
            }
        }
        return pending;
    }

    // Agent Gamma: Algorithmic Execution Engine
    public void processAgentGammaBots(String ticker, double currentPrice) {
        for (TradingBot bot : activeBots) {
            if (!bot.isExecuted() && bot.getTicker().equalsIgnoreCase(ticker)) {
                if (bot.checkAndExecute(currentPrice)) {
                    try {
                        executionService.executeTrade(bot, currentPrice);
                        System.out.println("AGENT GAMMA: Successfully executed limit order " + bot.getOrderId() + " for " + ticker + " @ $" + currentPrice);
                    } catch (Exception e) {
                        System.err.println("AGENT GAMMA ERROR: " + e.getMessage());
                        bot.setExecuted(false); // reset if execution failed due to funds/holdings
                    }
                }
            }
        }
    }

    // Agent Alpha: Market Sentiment Analyzer
    public Map<String, Object> getAgentAlphaSentiment() {
        List<Stock> stocks = marketRepository.findAll();
        if (stocks.isEmpty()) {
            return Map.of("sentimentScore", 50, "trend", "NEUTRAL", "summary", "Market data calibrating...");
        }

        double totalChange = 0.0;
        int positiveCount = 0;
        for (Stock s : stocks) {
            totalChange += s.getChangePercent();
            if (s.getChangePercent() >= 0) {
                positiveCount++;
            }
        }

        double avgChange = totalChange / stocks.size();
        int sentimentScore = (int) Math.min(100, Math.max(0, 50 + (avgChange * 10) + (positiveCount * 5)));
        
        String trend;
        String summary;
        if (sentimentScore >= 65) {
            trend = "BULLISH";
            summary = String.format("Agent Alpha detects strong upside momentum (+%.2f%% avg). High buy-volume probability.", avgChange);
        } else if (sentimentScore <= 35) {
            trend = "BEARISH";
            summary = String.format("Agent Alpha signals macroeconomic resistance (-%.2f%% avg). Consider defensive hedging.", Math.abs(avgChange));
        } else {
            trend = "NEUTRAL";
            summary = String.format("Agent Alpha reports balanced market consolidation (%.2f%% avg). Market awaiting catalysts.", avgChange);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sentimentScore", sentimentScore);
        result.put("trend", trend);
        result.put("summary", summary);
        result.put("positiveAssets", positiveCount);
        result.put("totalAssets", stocks.size());
        return result;
    }

    // Agent Beta: Portfolio Risk Copilot
    public Map<String, Object> getAgentBetaRiskAnalysis() {
        UserPortfolio portfolio = executionService.getPortfolio();
        double cash = portfolio.getCashBalance();
        Map<String, Integer> holdings = portfolio.getHoldings();

        double totalHoldingsValue = 0.0;
        Map<String, Double> assetValues = new HashMap<>();

        for (Map.Entry<String, Integer> entry : holdings.entrySet()) {
            String ticker = entry.getKey();
            int qty = entry.getValue();
            Stock stock = marketRepository.findByTicker(ticker);
            double price = (stock != null) ? stock.getCurrentPrice() : 0.0;
            double value = qty * price;
            assetValues.put(ticker, value);
            totalHoldingsValue += value;
        }

        double netWorth = cash + totalHoldingsValue;
        boolean highRiskAlert = false;
        String dominantAsset = "NONE";
        double maxConcentration = 0.0;

        for (Map.Entry<String, Double> entry : assetValues.entrySet()) {
            double concentration = netWorth > 0 ? (entry.getValue() / netWorth) : 0.0;
            if (concentration > maxConcentration) {
                maxConcentration = concentration;
                dominantAsset = entry.getKey();
            }
            if (concentration > MAX_CONCENTRATION_THRESHOLD) {
                highRiskAlert = true;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("netWorth", Math.round(netWorth * 100.0) / 100.0);
        response.put("cashBalance", cash);
        response.put("totalHoldingsValue", Math.round(totalHoldingsValue * 100.0) / 100.0);
        response.put("highRiskAlert", highRiskAlert);
        response.put("dominantAsset", dominantAsset);
        response.put("maxConcentrationPercent", Math.round(maxConcentration * 10000.0) / 100.0);
        
        if (highRiskAlert) {
            response.put("riskMessage", String.format("CRITICAL WARNING: %s accounts for %.1f%% of your net worth! Over-concentrated portfolio.", dominantAsset, maxConcentration * 100));
            response.put("riskStatus", "HIGH_RISK_PLASMA_MAGENTA");
        } else {
            response.put("riskMessage", "PORTFOLIO STABLE: Asset concentration is well-diversified below 50% limit.");
            response.put("riskStatus", "OPTIMAL_CYAN");
        }

        return response;
    }
}
