import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TickerTape({ stocks = [], selectedTicker, onSelectStock }) {
  if (!stocks || stocks.length === 0) return null;

  // Duplicate list for infinite scrolling marquee
  const displayStocks = [...stocks, ...stocks];

  return (
    <div className="glass-panel py-2.5 px-4 mb-4 rounded-xl overflow-hidden border border-white/10 relative shadow-glass">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#080A11] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#080A11] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center space-x-8">
        {displayStocks.map((stock, index) => {
          const isPositive = stock.changePercent >= 0;
          const isSelected = selectedTicker === stock.ticker;

          return (
            <div
              key={`${stock.ticker}-${index}`}
              onClick={() => onSelectStock(stock.ticker)}
              className={`flex items-center space-x-3 px-3 py-1 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#00F0FF]/20 border border-[#00F0FF]/50 shadow-cyan-glow'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="font-mono font-bold text-xs text-white">{stock.ticker}</span>
              <span className="font-mono text-xs text-slate-300">${stock.currentPrice.toFixed(2)}</span>
              <span
                className={`flex items-center space-x-0.5 font-mono text-xs font-semibold ${
                  isPositive ? 'text-[#00FF87]' : 'text-[#FF1E56]'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-[#00FF87]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-[#FF1E56]" />
                )}
                <span>{isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
