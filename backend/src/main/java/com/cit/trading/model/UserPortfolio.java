package com.cit.trading.model;

import java.util.HashMap;
import java.util.Map;

public class UserPortfolio {
    public static final double DEFAULT_BALANCE = 100000.00;
    
    private double cashBalance;
    private final Map<String, Integer> holdings;
    private final Map<String, Double> avgBuyPrices;

    public UserPortfolio() {
        this.cashBalance = DEFAULT_BALANCE;
        this.holdings = new HashMap<>();
        this.avgBuyPrices = new HashMap<>();
    }

    public synchronized double getCashBalance() {
        return cashBalance;
    }

    public synchronized void setCashBalance(double cashBalance) {
        this.cashBalance = Math.round(cashBalance * 100.0) / 100.0;
    }

    public synchronized Map<String, Integer> getHoldings() {
        return new HashMap<>(holdings);
    }

    public synchronized Map<String, Double> getAvgBuyPrices() {
        return new HashMap<>(avgBuyPrices);
    }

    public synchronized void addHolding(String ticker, int qty, double price) {
        int currentQty = holdings.getOrDefault(ticker, 0);
        double currentAvg = avgBuyPrices.getOrDefault(ticker, 0.0);
        
        int newQty = currentQty + qty;
        double newAvg = ((currentQty * currentAvg) + (qty * price)) / newQty;
        
        holdings.put(ticker, newQty);
        avgBuyPrices.put(ticker, Math.round(newAvg * 100.0) / 100.0);
    }

    public synchronized boolean removeHolding(String ticker, int qty) {
        int currentQty = holdings.getOrDefault(ticker, 0);
        if (currentQty < qty) {
            return false;
        }
        int newQty = currentQty - qty;
        if (newQty == 0) {
            holdings.remove(ticker);
            avgBuyPrices.remove(ticker);
        } else {
            holdings.put(ticker, newQty);
        }
        return true;
    }

    public synchronized int getHoldingQuantity(String ticker) {
        return holdings.getOrDefault(ticker, 0);
    }
}
