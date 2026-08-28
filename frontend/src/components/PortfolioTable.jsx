import React from 'react';
import { Wallet, DollarSign, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

export default function PortfolioTable({ portfolio, stocks = [] }) {
  const cash = portfolio?.cashBalance || 100000;
  const holdingsMap = portfolio?.holdings || {};
  const avgPricesMap = portfolio?.avgBuyPrices || {};

  // Build stock map for quick O(1) lookup
  const stockMap = {};
  stocks.forEach((s) => {
    stockMap[s.ticker] = s;
  });

  // Calculate totals and positions
  let totalHoldingsValue = 0;
  let totalUnrealizedPnL = 0;

  const positions = Object.keys(holdingsMap).map((ticker) => {
    const qty = holdingsMap[ticker];
    const avgBuyPrice = avgPricesMap[ticker] || 0;
    const currentStock = stockMap[ticker];
    const currentPrice = currentStock ? currentStock.currentPrice : avgBuyPrice;

    const marketValue = qty * currentPrice;
    const costBasis = qty * avgBuyPrice;
    const pnl = marketValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    totalHoldingsValue += marketValue;
    totalUnrealizedPnL += pnl;

    return {
      ticker,
      qty,
      avgBuyPrice,
      currentPrice,
      marketValue,
      pnl,
      pnlPercent,
    };
  });

  const netWorth = cash + totalHoldingsValue;

  return (
    <div className="glass-panel p-6 rounded-xl space-y-4">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-[#00F0FF] rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-xs">CASH BALANCE</div>
            <div className="text-xl font-bold text-white">${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-xs">HOLDINGS VALUE</div>
            <div className="text-xl font-bold text-white">${totalHoldingsValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-xs">TOTAL NET WORTH</div>
            <div className="text-xl font-bold text-[#00F0FF]">${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center space-x-3">
          <div className={`p-3 rounded-lg border ${totalUnrealizedPnL >= 0 ? 'bg-cyan-500/10 border-cyan-500/30 text-[#00F0FF]' : 'bg-rose-500/10 border-rose-500/30 text-[#FF0055]'}`}>
            {totalUnrealizedPnL >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-slate-400 text-xs">UNREALIZED P&L</div>
            <div className={`text-xl font-bold ${totalUnrealizedPnL >= 0 ? 'text-[#00F0FF]' : 'text-[#FF0055]'}`}>
              {totalUnrealizedPnL >= 0 ? `+$${totalUnrealizedPnL.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnL).toFixed(2)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full font-mono text-xs text-left">
          <thead className="bg-white/5 text-slate-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-4">TICKER</th>
              <th className="py-3 px-4">SHARES</th>
              <th className="py-3 px-4">AVG BUY PRICE</th>
              <th className="py-3 px-4">MARKET PRICE</th>
              <th className="py-3 px-4">MARKET VALUE</th>
              <th className="py-3 px-4">UNREALIZED P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {positions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  No active stock positions. Execute trades in the terminal above.
                </td>
              </tr>
            ) : (
              positions.map((pos) => {
                const isPos = pos.pnl >= 0;
                return (
                  <tr key={pos.ticker} className="hover:bg-white/5 transition-all">
                    <td className="py-3.5 px-4 font-bold text-white">{pos.ticker}</td>
                    <td className="py-3.5 px-4">{pos.qty}</td>
                    <td className="py-3.5 px-4">${pos.avgBuyPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4">${pos.currentPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">${pos.marketValue.toFixed(2)}</td>
                    <td className={`py-3.5 px-4 font-bold ${isPos ? 'text-[#00F0FF]' : 'text-[#FF0055]'}`}>
                      {isPos ? `+$${pos.pnl.toFixed(2)} (+${pos.pnlPercent.toFixed(2)}%)` : `-$${Math.abs(pos.pnl).toFixed(2)} (${pos.pnlPercent.toFixed(2)}%)`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
