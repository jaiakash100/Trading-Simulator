import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Bot, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function TradingTerminal({ stock, onExecuteTrade, onCreateBot, isProcessing }) {
  const [orderMode, setOrderMode] = useState('MARKET'); // MARKET vs BOT_LIMIT
  const [orderType, setOrderType] = useState('BUY'); // BUY vs SELL
  const [quantity, setQuantity] = useState(10);
  const [targetPrice, setTargetPrice] = useState(stock ? stock.currentPrice : 185.50);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (stock && orderMode === 'BOT_LIMIT') {
      setTargetPrice(stock.currentPrice);
    }
  }, [stock, orderMode]);

  if (!stock) {
    return (
      <div className="glass-panel p-6 rounded-2xl text-slate-400 font-mono text-sm">
        Select a ticker symbol to open terminal.
      </div>
    );
  }

  const estTotal = (quantity * (orderMode === 'BOT_LIMIT' ? targetPrice : stock.currentPrice)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than 0');
      return;
    }

    try {
      if (orderMode === 'MARKET') {
        const result = await onExecuteTrade(stock.ticker, quantity, orderType);
        if (result.error) {
          setErrorMsg(result.message || 'Trade execution failed.');
        } else {
          setSuccessMsg(`EXECUTED: ${orderType} ${quantity} ${stock.ticker} @ $${result.price.toFixed(2)}`);
        }
      } else {
        const result = await onCreateBot(stock.ticker, quantity, targetPrice, orderType);
        if (result.error) {
          setErrorMsg(result.message || 'Bot creation failed.');
        } else {
          setSuccessMsg(`BOT ARMED: Limit ${orderType} ${quantity} ${stock.ticker} @ $${targetPrice}`);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Execution exception occurred.');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-[440px] border border-white/10 shadow-glass">
      <div>
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="text-lg font-bold font-mono text-white">ORDER TERMINAL</h2>
          </div>
          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-1 rounded-full border border-white/10 font-mono text-xs">
            <button
              onClick={() => setOrderMode('MARKET')}
              className={`px-3 py-1 rounded-full transition-all ${
                orderMode === 'MARKET' ? 'bg-[#00F0FF] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              MARKET
            </button>
            <button
              onClick={() => setOrderMode('BOT_LIMIT')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                orderMode === 'BOT_LIMIT' ? 'bg-[#FF1E56] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3 h-3" />
              <span>AI BOT</span>
            </button>
          </div>
        </div>

        {/* Buy / Sell Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setOrderType('BUY')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-mono font-bold text-xs transition-all ${
              orderType === 'BUY'
                ? 'bg-gradient-to-r from-[#00FF87] to-emerald-500 text-black shadow-emerald-glow'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>BUY {stock.ticker}</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('SELL')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-mono font-bold text-xs transition-all ${
              orderType === 'SELL'
                ? 'bg-gradient-to-r from-[#FF1E56] to-rose-600 text-white shadow-crimson-glow'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>SELL {stock.ticker}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          {/* Quantity Slider */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>QUANTITY (SHARES)</span>
              <span className="text-white font-bold">{quantity} shares</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full accent-[#00F0FF] bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Target Price for Limit Order */}
          {orderMode === 'BOT_LIMIT' && (
            <div>
              <label className="block text-[#FF1E56] mb-1 font-bold">TARGET LIMIT TRIGGER PRICE ($)</label>
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                className="w-full glass-input border-[#FF1E56]/50 px-3 py-2 rounded-xl font-bold text-white"
              />
            </div>
          )}

          {/* Summary Row */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
            <span className="text-slate-400">ESTIMATED COST:</span>
            <span className="font-bold text-[#00F0FF] text-sm">${estTotal}</span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 rounded-xl font-mono font-bold text-xs tracking-wider transition-all shadow-glass active:scale-95 ${
              orderType === 'BUY'
                ? 'bg-[#00FF87] hover:bg-emerald-400 text-black shadow-emerald-glow'
                : 'bg-[#FF1E56] hover:bg-rose-600 text-white shadow-crimson-glow'
            }`}
          >
            {isProcessing ? 'PROCESSING TRANSACTION...' : `${orderType} NOW (${orderMode})`}
          </button>
        </form>
      </div>

      {/* Execution Feedback */}
      {errorMsg && (
        <div className="mt-2 p-2.5 bg-rose-950/90 border border-[#FF1E56] text-rose-300 font-mono text-[11px] rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF1E56]" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mt-2 p-2.5 bg-emerald-950/90 border border-[#00FF87] text-emerald-300 font-mono text-[11px] rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#00FF87]" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
