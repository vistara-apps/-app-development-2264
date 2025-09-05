import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

function MarketDataDisplay() {
  const { state, dispatch } = useTradingContext();

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Market Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(state.assets).map((asset) => (
          <div
            key={asset.symbol}
            onClick={() => dispatch({ type: 'SET_SELECTED_ASSET', payload: asset.symbol })}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              state.selectedAsset === asset.symbol
                ? 'bg-white bg-opacity-20 ring-2 ring-white ring-opacity-50'
                : 'bg-white bg-opacity-10 hover:bg-opacity-15'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-semibold">{asset.symbol}</div>
              <div className={`flex items-center gap-1 ${
                asset.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {asset.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm">{asset.change.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-white text-opacity-80 text-sm mb-1">{asset.name}</div>
            <div className="text-white text-lg font-bold">
              ${asset.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketDataDisplay;