package com.cit.trading.repository;

import com.cit.trading.model.Stock;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class MarketRepository {
    private final Map<String, Stock> stockMap = new ConcurrentHashMap<>();

    public MarketRepository() {
        // Seed initial market stocks
        seedStock("AAPL", "Apple Inc.", 185.50);
        seedStock("NVDA", "NVIDIA Corp.", 128.40);
        seedStock("TSLA", "Tesla Inc.", 215.20);
        seedStock("GOOGL", "Alphabet Inc.", 174.80);
        seedStock("BTC-USD", "Bitcoin", 64500.00);
    }

    private void seedStock(String ticker, String name, double initialPrice) {
        stockMap.put(ticker, new Stock(ticker, name, initialPrice));
    }

    public Stock findByTicker(String ticker) {
        return stockMap.get(ticker.toUpperCase());
    }

    public List<Stock> findAll() {
        return new ArrayList<>(stockMap.values());
    }

    public void save(Stock stock) {
        stockMap.put(stock.getTicker().toUpperCase(), stock);
    }
}
