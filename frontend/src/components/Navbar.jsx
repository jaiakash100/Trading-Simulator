import React from 'react';
import { Cpu, Download, Zap, LayoutDashboard, LineChart, Bot, Briefcase } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onExportReport, isExporting, isBackendLive }) {
  const navTabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'terminal', label: 'Live Terminal', icon: LineChart },
    { id: 'copilot', label: 'AI Copilot Hub', icon: Bot },
    { id: 'portfolio', label: 'Portfolio & Audit', icon: Briefcase },
  ];

  return (
    <nav className="glass-panel border-b border-white/10 px-6 py-3 mb-6 rounded-2xl sticky top-2 z-50 shadow-glass">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500/30 via-rose-500/20 to-purple-600/30 border border-cyan-500/50 rounded-xl shadow-cyan-glow">
            <Cpu className="w-6 h-6 text-[#00F0FF] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-widest text-white font-mono">
                AEON<span className="text-[#FF1E56]">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-full">
                PRO EDITION
              </span>
            </div>
          </div>
        </div>

        {/* Center Pill Tabs Navigation */}
        <div className="flex items-center bg-black/40 p-1.5 rounded-full border border-white/10 font-mono text-xs shadow-inner">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF1E56] to-rose-600 text-white shadow-crimson-glow scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status & Export */}
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-[#00FF87] px-3 py-1.5 rounded-full text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-ping" />
            <span>{isBackendLive ? '3s Java Engine Live' : 'Client AI Mock Active'}</span>
          </div>

          {/* Export Report CTA */}
          <button
            onClick={onExportReport}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#00F0FF] to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold font-mono px-4 py-2 rounded-xl text-xs transition-all duration-200 shadow-cyan-glow active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'EXPORTING...' : 'EXPORT REPORT'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
