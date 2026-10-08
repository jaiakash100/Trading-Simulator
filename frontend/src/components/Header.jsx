import React, { useState } from 'react';
import { Cpu, Download, Zap } from 'lucide-react';

export default function Header({ onExportReport, isExporting }) {
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async () => {
    const msg = await onExportReport();
    setExportMessage(msg);
    setTimeout(() => setExportMessage(''), 4000);
  };

  return (
    <header className="glass-panel border-b border-white/10 px-6 py-4 mb-4 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Branding */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 rounded-xl shadow-cyan-glow">
            <Cpu className="w-8 h-8 text-[#00F0FF] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-white">
                <span className="text-[#00F0FF]">HFT</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              High-Frequency Trading Simulator
            </p>
          </div>
        </div>

        {/* Platform Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Engine Status */}
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Zap className="w-3.5 h-3.5 animate-bounce" />
            <span>LIVE 3s TICK ENGINE</span>
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 shadow-cyan-glow active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'EXPORTING...' : 'EXPORT REPORT'}</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="mt-3 p-2 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-lg flex items-center justify-between animate-fade-in">
          <span>{exportMessage}</span>
          <span className="text-slate-400 text-[10px]">file: data/trading_report.txt</span>
        </div>
      )}
    </header>
  );
}
