package com.cit.trading.util;

import com.cit.trading.model.Transaction;
import com.cit.trading.model.UserPortfolio;
import com.cit.trading.service.ExecutionService;
import com.cit.trading.service.AiAgentService;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

public class FileManager {

    public static String exportTradingReport(ExecutionService executionService, AiAgentService aiAgentService) throws IOException {
        UserPortfolio portfolio = executionService.getPortfolio();
        List<Transaction> transactions = executionService.getTransactionHistory();
        Map<String, Object> riskAnalysis = aiAgentService.getAgentBetaRiskAnalysis();
        Map<String, Object> sentiment = aiAgentService.getAgentAlphaSentiment();

        // Mandatory Java requirement: heavy use of StringBuilder
        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================\n");
        sb.append("      REAL-TIME ALGORITHMIC TRADING & PORTFOLIO SIMULATOR REPORT       \n");
        sb.append("========================================================================\n");
        sb.append("Course: CS5305 - Java Programming (Review II Module 1)\n");
        sb.append("Institution: Chennai Institute of Technology, Department of CSE\n");
        sb.append("Team Members: Jai Akash K P (2104251040323) | Prabanjan V (2104251040690)\n");
        sb.append("Generated At: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        sb.append("========================================================================\n\n");

        sb.append("--- 1. PORTFOLIO SUMMARY ---\n");
        sb.append(String.format("Cash Balance:          $%.2f\n", portfolio.getCashBalance()));
        sb.append(String.format("Total Holdings Value:  $%.2f\n", riskAnalysis.get("totalHoldingsValue")));
        sb.append(String.format("Net Worth:             $%.2f\n\n", riskAnalysis.get("netWorth")));

        sb.append("--- 2. CURRENT HOLDINGS ---\n");
        Map<String, Integer> holdings = portfolio.getHoldings();
        Map<String, Double> avgPrices = portfolio.getAvgBuyPrices();
        if (holdings.isEmpty()) {
            sb.append("No active stock holdings in portfolio.\n\n");
        } else {
            for (Map.Entry<String, Integer> entry : holdings.entrySet()) {
                String ticker = entry.getKey();
                int qty = entry.getValue();
                double avgPrice = avgPrices.getOrDefault(ticker, 0.0);
                sb.append(String.format("Ticker: %-8s | Quantity: %-5d | Avg Buy Price: $%.2f\n", ticker, qty, avgPrice));
            }
            sb.append("\n");
        }

        sb.append("--- 3. AI MULTI-AGENT INSIGHTS ---\n");
        sb.append("Agent Alpha (Sentiment Score): ").append(sentiment.get("sentimentScore")).append("% [").append(sentiment.get("trend")).append("]\n");
        sb.append("Agent Alpha Summary:           ").append(sentiment.get("summary")).append("\n");
        sb.append("Agent Beta Risk Status:        ").append(riskAnalysis.get("riskStatus")).append("\n");
        sb.append("Agent Beta Risk Warning:       ").append(riskAnalysis.get("riskMessage")).append("\n\n");

        sb.append("--- 4. AUDIT LOG (TRANSACTION HISTORY) ---\n");
        if (transactions.isEmpty()) {
            sb.append("No transactions recorded during this session.\n");
        } else {
            sb.append(String.format("%-14s | %-19s | %-8s | %-6s | %-5s | %-9s | %-10s\n",
                    "ID", "Timestamp", "Type", "Ticker", "Qty", "Price", "Total"));
            sb.append("------------------------------------------------------------------------\n");
            for (Transaction tx : transactions) {
                sb.append(String.format("%-14s | %-19s | %-8s | %-6s | %-5d | $%-8.2f | $%-9.2f\n",
                        tx.getTransactionId(), tx.getTimestamp(), tx.getType(), tx.getTicker(),
                        tx.getQuantity(), tx.getPrice(), tx.getTotalAmount()));
            }
        }
        sb.append("========================================================================\n");

        // Save report to data/trading_report.txt using try-catch-finally and PrintWriter
        File dataDir = new File("data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        File reportFile = new File(dataDir, "trading_report.txt");

        PrintWriter writer = null;
        try {
            writer = new PrintWriter(new FileWriter(reportFile));
            writer.print(sb.toString());
            writer.flush();
        } finally {
            if (writer != null) {
                writer.close();
            }
        }

        return reportFile.getAbsolutePath();
    }
}
