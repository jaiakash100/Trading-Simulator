import React from 'react';
import TickerTape from './TickerTape';
import ChartPanel from './ChartPanel';
import TradingTerminal from './TradingTerminal';

export default function LiveTerminal({
  stocks = [],
  selectedTicker,
  onSelectStock,
  onExecuteTrade,
  onCreateBot,
  isProcessing
}) {
  const selectedStock = stocks.find(s => s.ticker === selectedTicker) || stocks[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Ticker Tape */}
      <TickerTape
        stocks={stocks}
        selectedTicker={selectedTicker}
        onSelectStock={onSelectStock}
      />

      {/* Main Grid: Chart Panel & Order Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Telemetry Graph (7 cols) */}
        <div className="lg:col-span-7">
          <ChartPanel stock={selectedStock} />
        </div>

        {/* Order Terminal (5 cols) */}
        <div className="lg:col-span-5">
          <TradingTerminal
            stock={selectedStock}
            onExecuteTrade={onExecuteTrade}
            onCreateBot={onCreateBot}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
