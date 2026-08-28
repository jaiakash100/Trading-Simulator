import React from 'react';
import PortfolioTable from './PortfolioTable';
import TransactionHistory from './TransactionHistory';

export default function PortfolioAudit({ portfolio = {}, stocks = [] }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Asset Holdings Table */}
      <PortfolioTable portfolio={portfolio} stocks={stocks} />

      {/* Audit Log Transaction Table */}
      <TransactionHistory transactions={portfolio.transactions || []} />
    </div>
  );
}
