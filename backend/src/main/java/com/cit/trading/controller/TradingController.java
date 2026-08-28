package com.cit.trading.controller;

import com.cit.trading.model.Stock;
import com.cit.trading.model.TradingBot;
import com.cit.trading.model.Transaction;
import com.cit.trading.model.UserPortfolio;
import com.cit.trading.service.AiAgentService;
import com.cit.trading.service.ExecutionService;
import com.cit.trading.service.MarketService;
import com.cit.trading.util.FileManager;
import com.cit.trading.util.InsufficientFundsException;
import com.cit.trading.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TradingController {

    private final MarketService marketService;
    private final ExecutionService executionService;
    private final AiAgentService aiAgentService;

    @Autowired
    public TradingController(MarketService marketService, ExecutionService executionService, AiAgentService aiAgentService) {
        this.marketService = marketService;
        this.executionService = executionService;
        this.aiAgentService = aiAgentService;
    }

    @GetMapping("/stocks")
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(marketService.getAllStocks());
    }

    @GetMapping("/portfolio")
    public ResponseEntity<Map<String, Object>> getPortfolio() {
        UserPortfolio portfolio = executionService.getPortfolio();
        Map<String, Object> riskData = aiAgentService.getAgentBetaRiskAnalysis();
        
        Map<String, Object> response = new HashMap<>();
        response.put("cashBalance", portfolio.getCashBalance());
        response.put("holdings", portfolio.getHoldings());
        response.put("avgBuyPrices", portfolio.getAvgBuyPrices());
        response.put("netWorth", riskData.get("netWorth"));
        response.put("totalHoldingsValue", riskData.get("totalHoldingsValue"));
        response.put("riskAnalysis", riskData);
        response.put("transactions", executionService.getTransactionHistory());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/trade")
    public ResponseEntity<?> executeTrade(@RequestBody Map<String, Object> request) throws InsufficientFundsException {
        String ticker = (String) request.get("ticker");
        int quantity = Integer.parseInt(request.get("quantity").toString());
        String orderType = (String) request.get("orderType");

        Transaction tx = executionService.executeTrade(ticker, quantity, orderType);
        return ResponseEntity.ok(tx);
    }

    @PostMapping("/bot/create")
    public ResponseEntity<?> createTradingBot(@RequestBody Map<String, Object> request) {
        String ticker = (String) request.get("ticker");
        int quantity = Integer.parseInt(request.get("quantity").toString());
        double targetPrice = Double.parseDouble(request.get("targetPrice").toString());
        String orderType = (String) request.get("orderType");
        String strategyName = request.getOrDefault("strategyName", "AgentGammaLimitBot").toString();

        ValidationUtil.validateBotRequest(ticker, quantity, targetPrice, orderType);
        TradingBot bot = aiAgentService.registerBot(ticker, orderType, quantity, targetPrice, strategyName);
        return ResponseEntity.ok(bot);
    }

    @GetMapping("/bot/active")
    public ResponseEntity<List<TradingBot>> getActiveBots() {
        return ResponseEntity.ok(aiAgentService.getActiveBots());
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<Map<String, Object>> getAiInsights() {
        Map<String, Object> insights = new HashMap<>();
        insights.put("agentAlpha", aiAgentService.getAgentAlphaSentiment());
        insights.put("agentBeta", aiAgentService.getAgentBetaRiskAnalysis());
        insights.put("activeBots", aiAgentService.getActiveBots().size());
        return ResponseEntity.ok(insights);
    }

    @PostMapping("/export")
    public ResponseEntity<Map<String, String>> exportReport() {
        try {
            String filePath = FileManager.exportTradingReport(executionService, aiAgentService);
            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Trading report exported successfully!",
                "filePath", filePath
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "ERROR",
                "message", "Failed to export report: " + e.getMessage()
            ));
        }
    }
}
