import React, { useState } from 'react';
import { Cpu, Download, ShieldCheck, Zap } from 'lucide-react';

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
                QUANTUM<span className="text-[#00F0FF]">FINTECH</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-[#00F0FF] rounded-full">
                AI-ENHANCED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              CS5305 – Java Programming (Review II Module 1) | Chennai Institute of Technology
            </p>
          </div>
        </div>

        {/* Team Metadata & Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Team Badge */}
          <div className="hidden xl:flex flex-col text-right font-mono text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <div className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Dept of Computer Science & Engineering</span>
            </div>
            <div className="text-[#E2E8F0] font-semibold">
              Jai Akash K P (2104251040323) | Prabanjan V (2104251040690)
            </div>
          </div>

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
