package com.cit.trading.service;

import com.cit.trading.model.Stock;
import com.cit.trading.model.Transaction;
import com.cit.trading.model.TradingBot;
import com.cit.trading.model.UserPortfolio;
import com.cit.trading.repository.MarketRepository;
import com.cit.trading.util.InsufficientFundsException;
import com.cit.trading.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ExecutionService {

    private final UserPortfolio portfolio = new UserPortfolio();
    private final List<Transaction> transactionHistory = Collections.synchronizedList(new ArrayList<>());
    private final MarketRepository marketRepository;

    @Autowired
    public ExecutionService(MarketRepository marketRepository) {
        this.marketRepository = marketRepository;
    }

    public synchronized UserPortfolio getPortfolio() {
        return portfolio;
    }

    public synchronized List<Transaction> getTransactionHistory() {
        return new ArrayList<>(transactionHistory);
    }

    // Method Overloading 1: Direct Trade Execution
    public synchronized Transaction executeTrade(String ticker, int quantity, String orderType) throws InsufficientFundsException, IllegalArgumentException {
        ValidationUtil.validateTradeRequest(ticker, quantity, orderType);
        
        Stock stock = marketRepository.findByTicker(ticker);
        if (stock == null) {
            throw new IllegalArgumentException("Invalid ticker symbol: " + ticker);
        }

        double currentPrice = stock.getCurrentPrice();
        double totalCost = Math.round((quantity * currentPrice) * 100.0) / 100.0;

        // Switch-case control statement requirement
        switch (orderType.toUpperCase()) {
            case "BUY":
                if (portfolio.getCashBalance() < totalCost) {
                    throw new InsufficientFundsException(
                        String.format("Insufficient funds! Required: $%.2f, Available: $%.2f", totalCost, portfolio.getCashBalance()),
                        totalCost,
                        portfolio.getCashBalance()
                    );
                }
                portfolio.setCashBalance(portfolio.getCashBalance() - totalCost);
                portfolio.addHolding(ticker, quantity, currentPrice);
                break;

            case "SELL":
                int ownedQty = portfolio.getHoldingQuantity(ticker);
                if (ownedQty < quantity) {
                    throw new IllegalArgumentException(
                        String.format("Insufficient shares of %s! Owned: %d, Requested Sell: %d", ticker, ownedQty, quantity)
                    );
                }
                portfolio.setCashBalance(portfolio.getCashBalance() + totalCost);
                portfolio.removeHolding(ticker, quantity);
                break;

            default:
                throw new IllegalArgumentException("Unsupported order type: " + orderType);
        }

        String txId = "TX-" + UUID.randomUUID().toString().substring(0, 8);
        Transaction tx = new Transaction(txId, orderType.toUpperCase(), ticker, quantity, currentPrice);
        transactionHistory.add(tx);
        return tx;
    }

    // Method Overloading 2: Automated Bot Limit Trade Execution
    public synchronized Transaction executeTrade(TradingBot bot, double executionPrice) throws InsufficientFundsException, IllegalArgumentException {
        String orderType = bot.getOrderType().toUpperCase();
        String ticker = bot.getTicker();
        int quantity = bot.getQuantity();
        double totalCost = Math.round((quantity * executionPrice) * 100.0) / 100.0;

        if ("BUY".equals(orderType)) {
            if (portfolio.getCashBalance() < totalCost) {
                throw new InsufficientFundsException(
                    "Bot Execution Failed: Insufficient balance.", totalCost, portfolio.getCashBalance()
                );
            }
            portfolio.setCashBalance(portfolio.getCashBalance() - totalCost);
            portfolio.addHolding(ticker, quantity, executionPrice);
        } else if ("SELL".equals(orderType)) {
            int ownedQty = portfolio.getHoldingQuantity(ticker);
            if (ownedQty < quantity) {
                throw new IllegalArgumentException("Bot Execution Failed: Insufficient stock shares.");
            }
            portfolio.setCashBalance(portfolio.getCashBalance() + totalCost);
            portfolio.removeHolding(ticker, quantity);
        }

        String txId = "BOT-TX-" + UUID.randomUUID().toString().substring(0, 8);
        Transaction tx = new Transaction(txId, "BOT_" + orderType, ticker, quantity, executionPrice);
        transactionHistory.add(tx);
        return tx;
    }
}
