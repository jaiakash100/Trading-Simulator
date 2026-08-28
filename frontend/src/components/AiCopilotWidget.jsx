import React from 'react';
import { Cpu, ShieldAlert, Bot, Compass } from 'lucide-react';

export default function AiCopilotWidget({ insights, activeBots = [] }) {
  const agentAlpha = insights?.agentAlpha || { sentimentScore: 50, trend: 'NEUTRAL', summary: 'Calibrating market sentiment...' };
  const agentBeta = insights?.agentBeta || { riskStatus: 'OPTIMAL_CYAN', riskMessage: 'Portfolio risk optimal', highRiskAlert: false };

  const isHighRisk = agentBeta.highRiskAlert;
  const score = agentAlpha.sentimentScore || 50;

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6 border border-white/10 flex flex-col justify-between h-[420px] overflow-y-auto">
      <div>
        {/* Widget Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="text-lg font-bold font-mono text-white">AI MULTI-AGENT COPILOT</h2>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
            3 ACTIVE AGENTS
          </span>
        </div>

        {/* AGENT ALPHA: Market Sentiment */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 mb-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
              <Compass className="w-4 h-4 text-[#00F0FF]" />
              <span>AGENT ALPHA (SENTIMENT)</span>
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                agentAlpha.trend === 'BULLISH'
                  ? 'bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/40'
                  : agentAlpha.trend === 'BEARISH'
                  ? 'bg-rose-500/20 text-[#FF0055] border border-rose-500/40'
                  : 'bg-slate-500/20 text-slate-300'
              }`}
            >
              {agentAlpha.trend}
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-1">
              <span>BEARISH (0%)</span>
              <span className="text-[#00F0FF] font-bold">{score}%</span>
              <span>BULLISH (100%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-400 to-[#00F0FF] h-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <p className="font-mono text-xs text-slate-300 leading-relaxed bg-black/30 p-2 rounded border border-white/5">
            "{agentAlpha.summary}"
          </p>
        </div>

        {/* AGENT BETA: Risk Copilot */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 mb-4 ${
            isHighRisk
              ? 'bg-rose-950/40 border-[#FF0055] shadow-magenta-glow animate-pulse'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between font-mono text-xs mb-2">
            <span className="flex items-center space-x-1.5 font-bold text-white">
              <ShieldAlert className={`w-4 h-4 ${isHighRisk ? 'text-[#FF0055]' : 'text-[#00F0FF]'}`} />
              <span>AGENT BETA (RISK COPILOT)</span>
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                isHighRisk
                  ? 'bg-[#FF0055] text-white animate-bounce'
                  : 'bg-cyan-500/20 text-[#00F0FF]'
              }`}
            >
              {isHighRisk ? 'RISK WARNING >50%' : 'NOMINAL'}
            </span>
          </div>

          <p className={`font-mono text-xs leading-relaxed ${isHighRisk ? 'text-[#FF0055] font-bold' : 'text-slate-300'}`}>
            {agentBeta.riskMessage}
          </p>
        </div>
      </div>

      {/* AGENT GAMMA: Algorithmic Bot Status */}
      <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Bot className="w-4 h-4 text-[#00F0FF]" />
          <span>AGENT GAMMA LIMIT BOTS:</span>
        </div>
        <span className="font-bold text-[#00F0FF] bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
          {activeBots.length} ACTIVE
        </span>
      </div>
    </div>
  );
}
