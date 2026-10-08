import React from 'react';
import { Rocket, Bot, Zap, ArrowUpRight, ArrowDownRight, ShieldCheck, Wallet, DollarSign, Activity } from 'lucide-react';

export default function DashboardOverview({ stocks = [], portfolio = {}, insights = {}, onNavigateTab, onExecuteTrade }) {
  const netWorth = portfolio.netWorth || 100000;
  const cash = portfolio.cashBalance || 88450;
  const holdingsValue = portfolio.totalHoldingsValue || 11550;
  const pnl = netWorth - 100000;
  const activeBotsCount = insights.activeBots || 2;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AEGIS Hero Banner */}
      <div className="relative glass-panel rounded-3xl p-8 overflow-hidden border border-white/10 shadow-glass">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-bl from-[#FF1E56]/20 via-[#00F0FF]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF1E56]/10 border border-[#FF1E56]/30 text-[#FF1E56] font-mono text-xs font-bold">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>High Frequency Trading</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white leading-tight">
            Trade Smarter with <br />
            <span className="bg-gradient-to-r from-[#00F0FF] via-cyan-300 to-[#00FF87] bg-clip-text text-transparent">
              Real-Time Market Intelligence
            </span>
          </h1>
          <p className="text-slate-300 font-mono text-sm leading-relaxed">
            Monitor live market movements, manage risk, and test algorithmic trading strategies in a professional stock market simulation.
          </p>

          {/* Action Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono">
            <button
              onClick={() => onNavigateTab('terminal')}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#FF1E56] to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 shadow-crimson-glow active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>LAUNCH LIVE TERMINAL</span>
            </button>

            <button
              onClick={() => onNavigateTab('copilot')}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 backdrop-blur-md active:scale-95"
            >
              <Bot className="w-4 h-4 text-[#00F0FF]" />
              <span>VIEW AI COPILOT HUB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-hover flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-semibold">TOTAL NET WORTH</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#00FF87] mt-1 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Initial $100k Base
            </div>
          </div>
          <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-hover flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-semibold">CASH BALANCE</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              ${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Ready for execution</div>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-hover flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-semibold">NET REALIZED P&L</div>
            <div className={`text-2xl font-extrabold mt-1 ${pnl >= 0 ? 'text-[#00FF87]' : 'text-[#FF1E56]'}`}>
              {pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Session cumulative</div>
          </div>
          <div className={`p-3 rounded-xl border ${pnl >= 0 ? 'bg-[#00FF87]/10 border-[#00FF87]/30 text-[#00FF87]' : 'bg-[#FF1E56]/10 border-[#FF1E56]/30 text-[#FF1E56]'}`}>
            {pnl >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-hover flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-semibold">ACTIVE AI BOTS</div>
            <div className="text-2xl font-extrabold text-[#00F0FF] mt-1">
              {activeBotsCount} TRIGGERS
            </div>
            <div className="text-[11px] text-[#00F0FF] mt-1">Agent Gamma armed</div>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-[#00F0FF] rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Emergency 1-Click Action Cards */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
        <div className="flex items-center space-x-2 font-mono">
          <Zap className="w-5 h-5 text-[#FF1E56]" />
          <h3 className="text-lg font-bold text-white">QUICK EMERGENCY ACTION CARDS</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <button
            onClick={() => onExecuteTrade('AAPL', 10, 'BUY')}
            className="glass-panel p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-500 text-left transition-all group flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-[#00F0FF] text-sm group-hover:text-white">QUICK BUY 10 AAPL</div>
              <div className="text-slate-400 mt-1">Execute immediate market order @ live price</div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#00F0FF] group-hover:scale-125 transition-transform" />
          </button>

          <button
            onClick={() => onExecuteTrade('NVDA', 5, 'BUY')}
            className="glass-panel p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-500 text-left transition-all group flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-[#00FF87] text-sm group-hover:text-white">QUICK BUY 5 NVDA</div>
              <div className="text-slate-400 mt-1">Hedge semiconductor momentum position</div>
            </div>
            <Zap className="w-5 h-5 text-[#00FF87] group-hover:scale-125 transition-transform" />
          </button>

          <button
            onClick={() => onExecuteTrade('TSLA', 5, 'SELL')}
            className="glass-panel p-4 rounded-xl border border-[#FF1E56]/30 hover:border-[#FF1E56] text-left transition-all group flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-[#FF1E56] text-sm group-hover:text-white">EMERGENCY STOP LOSS TSLA</div>
              <div className="text-slate-400 mt-1">Liquidate 5 shares to protect cash balance</div>
            </div>
            <ArrowDownRight className="w-5 h-5 text-[#FF1E56] group-hover:scale-125 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stock Market Snapshot Grid */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-lg font-bold text-white">LIVE MARKET SNAPSHOT</h3>
          </div>
          <button
            onClick={() => onNavigateTab('terminal')}
            className="text-xs text-[#00F0FF] hover:underline"
          >
            Open Interactive Terminal →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
          {stocks.map((stock) => {
            const isPos = stock.changePercent >= 0;
            return (
              <div
                key={stock.ticker}
                onClick={() => onNavigateTab('terminal')}
                className="glass-panel p-4 rounded-xl border border-white/10 hover:border-[#00F0FF]/50 cursor-pointer glass-card-hover"
              >
                <div className="flex justify-between items-center font-bold text-white text-sm">
                  <span>{stock.ticker}</span>
                  <span className={isPos ? 'text-[#00FF87]' : 'text-[#FF1E56]'}>
                    {isPos ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                  </span>
                </div>
                <div className="text-slate-400 text-[10px] mt-0.5 truncate">{stock.name}</div>
                <div className="text-xl font-extrabold text-white mt-2">${stock.currentPrice.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
