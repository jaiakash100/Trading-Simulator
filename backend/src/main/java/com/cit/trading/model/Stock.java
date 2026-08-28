package com.cit.trading.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Stock {
    private String ticker;
    private String name;
    private double currentPrice;
    private double initialPrice;
    private double changePercent;
    private double high;
    private double low;
    private final List<Double> priceHistory;

    public Stock() {
        this.priceHistory = Collections.synchronizedList(new ArrayList<>());
    }

    public Stock(String ticker, String name, double initialPrice) {
        this.ticker = ticker;
        this.name = name;
        this.currentPrice = initialPrice;
        this.initialPrice = initialPrice;
        this.changePercent = 0.0;
        this.high = initialPrice;
        this.low = initialPrice;
        this.priceHistory = Collections.synchronizedList(new ArrayList<>());
        this.priceHistory.add(initialPrice);
    }

    public synchronized void updatePrice(double newPrice) {
        this.currentPrice = Math.round(newPrice * 100.0) / 100.0;
        this.changePercent = Math.round(((this.currentPrice - this.initialPrice) / this.initialPrice) * 10000.0) / 100.0;
        if (this.currentPrice > this.high) {
            this.high = this.currentPrice;
        }
        if (this.currentPrice < this.low) {
            this.low = this.currentPrice;
        }
        this.priceHistory.add(this.currentPrice);
        if (this.priceHistory.size() > 30) {
            this.priceHistory.remove(0);
        }
    }

    public synchronized String getTicker() {
        return ticker;
    }

    public synchronized void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public synchronized String getName() {
        return name;
    }

    public synchronized void setName(String name) {
        this.name = name;
    }

    public synchronized double getCurrentPrice() {
        return currentPrice;
    }

    public synchronized void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public synchronized double getInitialPrice() {
        return initialPrice;
    }

    public synchronized void setInitialPrice(double initialPrice) {
        this.initialPrice = initialPrice;
    }

    public synchronized double getChangePercent() {
        return changePercent;
    }

    public synchronized void setChangePercent(double changePercent) {
        this.changePercent = changePercent;
    }

    public synchronized double getHigh() {
        return high;
    }

    public synchronized double getLow() {
        return low;
    }

    public synchronized List<Double> getPriceHistory() {
        return new ArrayList<>(priceHistory);
    }
}
