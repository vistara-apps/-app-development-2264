import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { TrendingUp, BarChart3, BookOpen, Wallet } from 'lucide-react';

function Sidebar() {
  const { state, dispatch } = useTradingContext();

  const menuItems = [
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'learning', label: 'Learn', icon: BookOpen },
  ];

  return (
    <div className="w-64 glass-effect text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">FlashTrade Sim</h1>
        <p className="text-sm opacity-80">Practice Trading Risk-Free</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4" />
          <span className="text-sm">Virtual Balance</span>
        </div>
        <div className="text-xl font-semibold text-green-400">
          ${state.user.virtualBalance.toLocaleString()}
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: item.id })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                state.activeTab === item.id
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Quick Stats</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total P&L:</span>
            <span className={state.user.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
              ${state.user.totalPnL.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Win Rate:</span>
            <span>{state.user.winRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Trades:</span>
            <span>{state.user.totalTrades}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;