package com.cit.trading.service;

import com.cit.trading.model.Stock;
import com.cit.trading.repository.MarketRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class MarketEngineService implements MarketService, Runnable {

    public static final long TICK_RATE_MS = 3000L;
    
    private final MarketRepository marketRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();
    
    private Thread marketThread;
    private volatile boolean running = true;
    
    private AiAgentService aiAgentService;

    @Autowired
    public MarketEngineService(MarketRepository marketRepository, SimpMessagingTemplate messagingTemplate) {
        this.marketRepository = marketRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Autowired
    public void setAiAgentService(AiAgentService aiAgentService) {
        this.aiAgentService = aiAgentService;
    }

    @PostConstruct
    public void startEngine() {
        marketThread = new Thread(this, "MarketEngineThread");
        marketThread.setDaemon(true);
        marketThread.start();
    }

    @PreDestroy
    public void stopEngine() {
        this.running = false;
        if (marketThread != null) {
            marketThread.interrupt();
        }
    }

    @Override
    public void run() {
        // Mandatory Java requirement: while loop for background multithreading
        while (running) {
            try {
                Thread.sleep(TICK_RATE_MS);
                simulateMarketTick();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                System.err.println("Error in market tick cycle: " + e.getMessage());
            }
        }
    }

    private void simulateMarketTick() {
        List<Stock> stocks = marketRepository.findAll();
        // Enhanced for-each loop
        for (Stock stock : stocks) {
            double oldPrice = stock.getCurrentPrice();
            // Random fluctuation between -1.5% and +1.6%
            double deltaPercent = (-0.015 + (0.031 * random.nextDouble()));
            double newPrice = oldPrice * (1.0 + deltaPercent);
            
            stock.updatePrice(newPrice);
            
            // Trigger Agent Gamma limit order execution check
            if (aiAgentService != null) {
                aiAgentService.processAgentGammaBots(stock.getTicker(), stock.getCurrentPrice());
            }
        }
        
        // Broadcast market ticks via WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/market-ticks", getAllStocks());
        } catch (Exception ignored) {}
    }

    @Override
    public Stock getStock(String ticker) {
        return marketRepository.findByTicker(ticker);
    }

    @Override
    public List<Stock> getAllStocks() {
        return marketRepository.findAll();
    }

    @Override
    public void updatePrice(String ticker, double newPrice) {
        Stock stock = marketRepository.findByTicker(ticker);
        if (stock != null) {
            stock.updatePrice(newPrice);
        }
    }
}
