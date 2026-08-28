import React from 'react';
import { History, FileText } from 'lucide-react';

export default function TransactionHistory({ transactions = [] }) {
  // Sort descending by timestamp / order
  const reversedTx = [...transactions].reverse();

  return (
    <div className="glass-panel p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-[#00F0FF]" />
          <h2 className="text-lg font-bold font-mono text-white">TRANSACTION AUDIT LOG</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>RECORD COUNT: {transactions.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs text-left">
          <thead className="bg-white/5 text-slate-400 border-b border-white/10">
            <tr>
              <th className="py-3 px-4">TX ID</th>
              <th className="py-3 px-4">TIMESTAMP</th>
              <th className="py-3 px-4">ORDER TYPE</th>
              <th className="py-3 px-4">TICKER</th>
              <th className="py-3 px-4">QTY</th>
              <th className="py-3 px-4">EXECUTION PRICE</th>
              <th className="py-3 px-4">TOTAL AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reversedTx.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
                  No execution transactions recorded yet.
                </td>
              </tr>
            ) : (
              reversedTx.map((tx) => {
                const isBuy = tx.type.includes('BUY');
                return (
                  <tr key={tx.transactionId} className="hover:bg-white/5 transition-all">
                    <td className="py-3 px-4 text-slate-400 font-bold">{tx.transactionId}</td>
                    <td className="py-3 px-4 text-slate-400">{tx.timestamp}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy
                            ? 'bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/40'
                            : 'bg-rose-500/20 text-[#FF0055] border border-rose-500/40'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{tx.ticker}</td>
                    <td className="py-3 px-4">{tx.quantity}</td>
                    <td className="py-3 px-4">${tx.price.toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-white">${tx.totalAmount.toFixed(2)}</td>
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
