import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

function RecentTrades() {
  const { state } = useTradingContext();
  const recentTrades = state.trades.slice(-5).reverse();

  if (recentTrades.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Trades</h3>
        <div className="text-white text-opacity-70 text-center py-8">
          No trades yet. Start trading to see your history here!
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Trades</h3>
      <div className="space-y-3">
        {recentTrades.map((trade) => (
          <div key={trade.tradeId} className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded ${trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}>
                {trade.type === 'buy' ? (
                  <TrendingUp className="w-4 h-4 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <div className="text-white font-semibold">
                  {trade.type.toUpperCase()} {trade.symbol}
                </div>
                <div className="text-white text-opacity-70 text-sm">
                  {trade.quantity} @ ${trade.entryPrice.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm">
                ${(trade.quantity * trade.entryPrice).toFixed(2)}
              </div>
              <div className="text-white text-opacity-70 text-xs">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTrades;