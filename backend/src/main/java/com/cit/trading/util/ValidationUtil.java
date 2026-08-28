package com.cit.trading.util;

public class ValidationUtil {

    public static void validateTradeRequest(String ticker, int quantity, String orderType) throws IllegalArgumentException {
        if (ticker == null || ticker.trim().isEmpty()) {
            throw new IllegalArgumentException("Stock ticker symbol cannot be empty.");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive integer strictly greater than 0.");
        }
        if (orderType == null || (!orderType.equalsIgnoreCase("BUY") && !orderType.equalsIgnoreCase("SELL"))) {
            throw new IllegalArgumentException("Order type must be either 'BUY' or 'SELL'.");
        }
    }

    public static void validateBotRequest(String ticker, int quantity, double targetPrice, String orderType) throws IllegalArgumentException {
        validateTradeRequest(ticker, quantity, orderType);
        if (targetPrice <= 0.0) {
            throw new IllegalArgumentException("Target limit price must be strictly greater than $0.00.");
        }
    }
}
