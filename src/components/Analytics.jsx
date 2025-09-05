import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';

function Analytics() {
  const { state } = useTradingContext();

  const completedTrades = state.trades.filter(trade => trade.exitPrice);
  const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0);
  const losingTrades = completedTrades.filter(trade => (trade.pnl || 0) < 0);

  const avgWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length 
    : 0;
  
  const avgLoss = losingTrades.length > 0 
    ? losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
        <div className="text-white text-opacity-80">
          Track your trading progress
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          variant="pnl"
          title="Total P&L"
          value={`$${state.user.totalPnL.toFixed(2)}`}
          change={state.user.totalPnL >= 0 ? '+' : ''}
          icon={DollarSign}
          positive={state.user.totalPnL >= 0}
        />
        
        <AnalyticsCard
          variant="winRate"
          title="Win Rate"
          value={`${state.user.winRate.toFixed(1)}%`}
          change={state.user.winRate >= 50 ? 'Above 50%' : 'Below 50%'}
          icon={Target}
          positive={state.user.winRate >= 50}
        />
        
        <AnalyticsCard
          variant="trades"
          title="Total Trades"
          value={state.user.totalTrades.toString()}
          change={`${winningTrades.length}W / ${losingTrades.length}L`}
          icon={TrendingUp}
          positive={true}
        />
        
        <AnalyticsCard
          variant="trades"
          title="Virtual Balance"
          value={`$${state.user.virtualBalance.toLocaleString()}`}
          change={state.user.virtualBalance >= 10000 ? 'Profitable' : 'At Loss'}
          icon={DollarSign}
          positive={state.user.virtualBalance >= 10000}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Trade History</h3>
          
          {state.trades.length === 0 ? (
            <div className="text-white text-opacity-70 text-center py-8">
              No trades yet. Start trading to build your history!
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {state.trades.slice().reverse().map((trade) => (
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
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Performance Insights</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="text-white text-sm mb-1">Average Win</div>
              <div className="text-green-400 text-lg font-semibold">
                ${avgWin.toFixed(2)}
              </div>
            </div>
            
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="text-white text-sm mb-1">Average Loss</div>
              <div className="text-red-400 text-lg font-semibold">
                ${avgLoss.toFixed(2)}
              </div>
            </div>
            
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="text-white text-sm mb-1">Risk/Reward Ratio</div>
              <div className="text-white text-lg font-semibold">
                {avgLoss !== 0 ? `1:${Math.abs(avgWin / avgLoss).toFixed(2)}` : 'N/A'}
              </div>
            </div>
            
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="text-white text-sm mb-1">Most Traded Asset</div>
              <div className="text-white text-lg font-semibold">
                {state.trades.length > 0 
                  ? state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})[Object.keys(state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})).reduce((a, b) => state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})[a] > state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})[b] ? a : b)] ? Object.keys(state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})).reduce((a, b) => state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})[a] > state.trades.reduce((acc, trade) => {
                      acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
                      return acc;
                    }, {})[b] ? a : b) : 'N/A'
                  : 'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;