package com.cit.trading.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Transaction {
    private String transactionId;
    private String timestamp;
    private String type; // BUY, SELL, BOT_BUY, BOT_SELL
    private String ticker;
    private int quantity;
    private double price;
    private double totalAmount;

    public Transaction() {}

    public Transaction(String transactionId, String type, String ticker, int quantity, double price) {
        this.transactionId = transactionId;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.type = type;
        this.ticker = ticker;
        this.quantity = quantity;
        this.price = Math.round(price * 100.0) / 100.0;
        this.totalAmount = Math.round((quantity * price) * 100.0) / 100.0;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public String getType() {
        return type;
    }

    public String getTicker() {
        return ticker;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public double getTotalAmount() {
        return totalAmount;
    }
}
