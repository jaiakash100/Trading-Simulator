package com.cit.trading.util;

public class InsufficientFundsException extends Exception {
    private final double requiredAmount;
    private final double availableBalance;

    public InsufficientFundsException(String message, double requiredAmount, double availableBalance) {
        super(message);
        this.requiredAmount = requiredAmount;
        this.availableBalance = availableBalance;
    }

    public double getRequiredAmount() {
        return requiredAmount;
    }

    public double getAvailableBalance() {
        return availableBalance;
    }
}
