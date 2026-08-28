import React, { useState } from 'react';
import { Cpu, Compass, ShieldAlert, Bot, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AiCopilotHub({ insights = {}, activeBots = [] }) {
  const agentAlpha = insights?.agentAlpha || { sentimentScore: 68, trend: 'BULLISH', summary: 'Agent Alpha detects strong upside momentum with high buy-side volume.' };
  const agentBeta = insights?.agentBeta || { riskStatus: 'OPTIMAL_CYAN', riskMessage: 'PORTFOLIO STABLE: Asset concentration is well-diversified below 50% limit.', highRiskAlert: false };

  const [botToggles, setBotToggles] = useState({});

  const toggleBot = (botId) => {
    setBotToggles(prev => ({
      ...prev,
      [botId]: prev[botId] === undefined ? false : !prev[botId]
    }));
  };

  const isHighRisk = agentBeta.highRiskAlert;
  const score = agentAlpha.sentimentScore || 68;

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Hub Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500/30 to-[#00F0FF]/30 border border-purple-500/50 rounded-xl">
            <Cpu className="w-8 h-8 text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI MULTI-AGENT COPILOT HUB</h2>
            <p className="text-xs text-slate-400">Autonomous market analysis, risk controls, and automated order triggers.</p>
          </div>
        </div>
        <div className="flex space-x-2 text-xs">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-[#00F0FF] rounded-full">
            Agent Alpha: SENTIMENT
          </span>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full">
            Agent Beta: RISK
          </span>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-[#00FF87] rounded-full">
            Agent Gamma: EXECUTION
          </span>
        </div>
      </div>

      {/* Grid: Agent Alpha & Agent Beta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AGENT ALPHA: Market Sentiment */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Compass className="w-5 h-5 text-[#00F0FF]" />
              <span>AGENT ALPHA (MARKET SENTIMENT)</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                agentAlpha.trend === 'BULLISH'
                  ? 'bg-emerald-500/20 text-[#00FF87] border border-emerald-500/40'
                  : agentAlpha.trend === 'BEARISH'
                  ? 'bg-[#FF1E56]/20 text-[#FF1E56] border border-[#FF1E56]/40'
                  : 'bg-slate-500/20 text-slate-300'
              }`}
            >
              {agentAlpha.trend}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>BEARISH SPECTRUM</span>
              <span className="text-[#00F0FF] font-bold text-sm">{score}%</span>
              <span>BULLISH SPECTRUM</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-[#FF1E56] via-amber-400 to-[#00FF87] h-full rounded-full transition-all duration-500 shadow-cyan-glow"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold">LIVE AGENT ALPHA SUMMARY</div>
            <p className="text-xs text-slate-200 leading-relaxed">
              "{agentAlpha.summary}"
            </p>
          </div>
        </div>

        {/* AGENT BETA: Risk Copilot */}
        <div className={`glass-panel p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
          isHighRisk ? 'border-[#FF1E56] bg-[#FF1E56]/10 shadow-crimson-glow' : 'border-white/10'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2 text-white font-bold">
              <ShieldAlert className={`w-5 h-5 ${isHighRisk ? 'text-[#FF1E56]' : 'text-[#00F0FF]'}`} />
              <span>AGENT BETA (RISK COPILOT)</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isHighRisk ? 'bg-[#FF1E56] text-white animate-bounce' : 'bg-emerald-500/20 text-[#00FF87]'
            }`}>
              {isHighRisk ? 'CRITICAL RISK (>50%)' : 'NOMINAL STABLE'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold">PORTFOLIO RISK STATUS</div>
              <p className={`text-xs font-bold leading-relaxed ${isHighRisk ? 'text-[#FF1E56]' : 'text-[#00FF87]'}`}>
                {agentBeta.riskMessage}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-slate-400 text-[10px]">DOMINANT HOLDING</div>
                <div className="font-bold text-white text-sm mt-0.5">{agentBeta.dominantAsset || 'AAPL'}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-slate-400 text-[10px]">MAX CONCENTRATION</div>
                <div className="font-bold text-white text-sm mt-0.5">{agentBeta.maxConcentrationPercent || '35.5'}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AGENT GAMMA: Limit Bot Auto-Execution Rules */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Bot className="w-5 h-5 text-[#00FF87]" />
            <span>AGENT GAMMA (AUTOMATED LIMIT BOTS)</span>
          </div>
          <span className="text-xs text-slate-400">Total Active: {activeBots.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">BOT ID</th>
                <th className="py-3 px-4">STRATEGY</th>
                <th className="py-3 px-4">ORDER TYPE</th>
                <th className="py-3 px-4">TICKER</th>
                <th className="py-3 px-4">QTY</th>
                <th className="py-3 px-4">TARGET PRICE</th>
                <th className="py-3 px-4">TOGGLE RULE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeBots.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-500">
                    No active limit bots armed. Create one in the Live Terminal!
                  </td>
                </tr>
              ) : (
                activeBots.map((bot) => {
                  const isEnabled = botToggles[bot.orderId] !== false;
                  return (
                    <tr key={bot.orderId} className="hover:bg-white/5 transition-all">
                      <td className="py-3.5 px-4 font-bold text-white">{bot.orderId}</td>
                      <td className="py-3.5 px-4 text-purple-300">{bot.strategyName || 'LimitTriggerBot'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bot.orderType === 'BUY' ? 'bg-cyan-500/20 text-[#00F0FF]' : 'bg-rose-500/20 text-[#FF1E56]'
                        }`}>
                          {bot.orderType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{bot.ticker}</td>
                      <td className="py-3.5 px-4">{bot.quantity}</td>
                      <td className="py-3.5 px-4 font-bold text-[#00FF87]">${bot.targetPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleBot(bot.orderId)}
                          className="flex items-center space-x-1.5 focus:outline-none"
                        >
                          {isEnabled ? (
                            <ToggleRight className="w-6 h-6 text-[#00FF87]" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-slate-500" />
                          )}
                          <span className={isEnabled ? 'text-[#00FF87]' : 'text-slate-500'}>
                            {isEnabled ? 'ARMED' : 'PAUSED'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
