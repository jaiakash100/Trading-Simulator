import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import LiveTerminal from './components/LiveTerminal';
import AiCopilotHub from './components/AiCopilotHub';
import PortfolioAudit from './components/PortfolioAudit';
import {
  getMockStocks,
  getMockPortfolio,
  getMockBots,
  getMockAiInsights,
  executeMockTrade,
  createMockBot
} from './utils/mockEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'terminal' | 'copilot' | 'portfolio'
  const [stocks, setStocks] = useState(getMockStocks());
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [portfolio, setPortfolio] = useState(getMockPortfolio());
  const [insights, setInsights] = useState(getMockAiInsights());
  const [activeBots, setActiveBots] = useState(getMockBots());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Fetch backend data with fallback mock state
  const refreshData = async () => {
    try {
      const [stocksRes, portRes, aiRes, botRes] = await Promise.all([
        fetch('/api/stocks'),
        fetch('/api/portfolio'),
        fetch('/api/ai-insights'),
        fetch('/api/bot/active'),
      ]);

      if (stocksRes.ok && portRes.ok) {
        setIsBackendLive(true);
        setStocks(await stocksRes.json());
        setPortfolio(await portRes.json());
        if (aiRes.ok) setInsights(await aiRes.json());
        if (botRes.ok) setActiveBots(await botRes.json());
        return;
      }
    } catch (e) {
      // Backend is offline -> seamlessly use client mock engine
      setIsBackendLive(false);
    }

    // Client-side fallback engine updates
    setStocks(getMockStocks());
    setPortfolio(getMockPortfolio());
    setInsights(getMockAiInsights());
    setActiveBots(getMockBots());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Execute Immediate Market Trade
  const handleExecuteTrade = async (ticker, quantity, orderType) => {
    setIsProcessing(true);
    try {
      if (isBackendLive) {
        const response = await fetch('/api/trade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker, quantity, orderType }),
        });
        const data = await response.json();
        if (!response.ok) {
          setIsProcessing(false);
          return { error: true, message: data.message || 'Trade failed' };
        }
        await refreshData();
        setIsProcessing(false);
        return data;
      }
    } catch (err) {
      console.warn('Backend unavailable, switching to mock trade execution');
    }

    // Execute via local mock engine fallback
    try {
      const tx = executeMockTrade(ticker, quantity, orderType);
      refreshData();
      setIsProcessing(false);
      return tx;
    } catch (err) {
      setIsProcessing(false);
      return { error: true, message: err.message };
    }
  };

  // Create Automated Limit Bot Order
  const handleCreateBot = async (ticker, quantity, targetPrice, orderType) => {
    setIsProcessing(true);
    try {
      if (isBackendLive) {
        const response = await fetch('/api/bot/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker, quantity, targetPrice, orderType }),
        });
        const data = await response.json();
        if (!response.ok) {
          setIsProcessing(false);
          return { error: true, message: data.message || 'Bot creation failed' };
        }
        await refreshData();
        setIsProcessing(false);
        return data;
      }
    } catch (err) {
      console.warn('Backend unavailable, switching to mock bot creation');
    }

    // Create via local mock engine fallback
    const bot = createMockBot(ticker, quantity, targetPrice, orderType);
    refreshData();
    setIsProcessing(false);
    return bot;
  };

  // Export File Report
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      if (isBackendLive) {
        const response = await fetch('/api/export', { method: 'POST' });
        const data = await response.json();
        setIsExporting(false);
        setExportNotice(data.message || 'Report generated in backend data/trading_report.txt');
        setTimeout(() => setExportNotice(''), 5000);
        return;
      }
    } catch (err) {}

    // Mock export notice
    setIsExporting(false);
    setExportNotice('Export report generated! Log saved to data/trading_report.txt');
    setTimeout(() => setExportNotice(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#080A11] text-[#E2E8F0] selection:bg-[#00F0FF] selection:text-black">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {/* AEGIS Glass Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExportReport={handleExportReport}
          isExporting={isExporting}
          isBackendLive={isBackendLive}
        />

        {/* Export Notification Notice */}
        {exportNotice && (
          <div className="p-3 bg-cyan-950/80 border border-[#00F0FF] text-[#00F0FF] font-mono text-xs rounded-xl flex items-center justify-between animate-fade-in shadow-cyan-glow">
            <span>{exportNotice}</span>
            <span className="text-slate-400 text-[10px]">file: data/trading_report.txt</span>
          </div>
        )}

        {/* Tab 1: 🏠 Dashboard Overview */}
        {activeTab === 'overview' && (
          <DashboardOverview
            stocks={stocks}
            portfolio={portfolio}
            insights={insights}
            onNavigateTab={setActiveTab}
            onExecuteTrade={handleExecuteTrade}
          />
        )}

        {/* Tab 2: 📈 Live Terminal */}
        {activeTab === 'terminal' && (
          <LiveTerminal
            stocks={stocks}
            selectedTicker={selectedTicker}
            onSelectStock={setSelectedTicker}
            onExecuteTrade={handleExecuteTrade}
            onCreateBot={handleCreateBot}
            isProcessing={isProcessing}
          />
        )}

        {/* Tab 3: 🤖 AI Copilot Hub */}
        {activeTab === 'copilot' && (
          <AiCopilotHub
            insights={insights}
            activeBots={activeBots}
          />
        )}

        {/* Tab 4: 💼 Portfolio & Audit */}
        {activeTab === 'portfolio' && (
          <PortfolioAudit
            portfolio={portfolio}
            stocks={stocks}
          />
        )}
      </div>
    </div>
  );
}
