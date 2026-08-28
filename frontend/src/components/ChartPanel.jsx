import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ChartPanel({ stock }) {
  if (!stock) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-center text-slate-400 font-mono text-sm h-[420px]">
        Select a stock symbol to view live interactive telemetry chart.
      </div>
    );
  }

  const priceHistory = stock.priceHistory || [180, 182, 184, 183, 185.5];
  const chartData = priceHistory.map((price, idx) => ({
    tick: `T-${priceHistory.length - idx}`,
    price: price,
  }));

  const isPositive = stock.changePercent >= 0;
  const strokeColor = isPositive ? '#00FF87' : '#FF1E56';
  const fillColor = isPositive ? 'url(#emeraldGradient)' : 'url(#crimsonGradient)';

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-[440px] border border-white/10 shadow-glass">
      {/* Top Details */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black font-mono text-white tracking-wide">{stock.ticker}</span>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              {stock.name}
            </span>
          </div>
          <div className="flex items-baseline space-x-3 mt-1">
            <span className="text-3xl font-extrabold font-mono text-white">
              ${stock.currentPrice.toFixed(2)}
            </span>
            <span
              className={`flex items-center text-sm font-mono font-bold ${
                isPositive ? 'text-[#00FF87]' : 'text-[#FF1E56]'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
              {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
            </span>
          </div>
        </div>

        {/* High / Low Telemetry */}
        <div className="flex space-x-3 font-mono text-xs text-right">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px]">24H HIGH</div>
            <div className="text-[#00FF87] font-bold">${stock.high ? stock.high.toFixed(2) : stock.currentPrice.toFixed(2)}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="text-slate-400 text-[10px]">24H LOW</div>
            <div className="text-[#FF1E56] font-bold">${stock.low ? stock.low.toFixed(2) : stock.currentPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF87" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00FF87" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1E56" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF1E56" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="tick" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#64748B"
              tick={{ fontSize: 10, fill: '#64748B' }}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(18, 22, 34, 0.95)',
                borderColor: strokeColor,
                borderRadius: '12px',
                color: '#E2E8F0',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={fillColor}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
        <span className="flex items-center">
          <Activity className="w-3 h-3 mr-1 text-[#00F0FF]" /> Live Engine Tick Stream Active
        </span>
        <span>Recharts Telemetry Active</span>
      </div>
    </div>
  );
}
