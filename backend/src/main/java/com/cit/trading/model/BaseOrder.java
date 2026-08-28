package com.cit.trading.model;

import java.util.UUID;

public abstract class BaseOrder {
    private String orderId;
    private String ticker;
    private String orderType; // BUY or SELL
    private int quantity;
    private double targetPrice;
    private boolean executed;

    public BaseOrder() {
        this.orderId = UUID.randomUUID().toString().substring(0, 8);
    }

    public BaseOrder(String ticker, String orderType, int quantity, double targetPrice) {
        this.orderId = UUID.randomUUID().toString().substring(0, 8);
        this.ticker = ticker;
        this.orderType = orderType;
        this.quantity = quantity;
        this.targetPrice = targetPrice;
        this.executed = false;
    }

    // Abstract method to be overridden by subclasses (Polymorphism)
    public abstract boolean checkAndExecute(double currentPrice);

    public String getOrderId() {
        return orderId;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTargetPrice() {
        return targetPrice;
    }

    public void setTargetPrice(double targetPrice) {
        this.targetPrice = targetPrice;
    }

    public boolean isExecuted() {
        return executed;
    }

    public void setExecuted(boolean executed) {
        this.executed = executed;
    }
}
