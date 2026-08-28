package com.cit.trading.service;

import com.cit.trading.model.Stock;
import java.util.List;

public interface MarketService {
    Stock getStock(String ticker);
    List<Stock> getAllStocks();
    void updatePrice(String ticker, double newPrice);
}
