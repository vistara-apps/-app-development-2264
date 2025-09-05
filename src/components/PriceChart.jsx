import React from 'react';
import { useTradingContext } from '../context/TradingContext';

function PriceChart() {
  const { state } = useTradingContext();
  const selectedAsset = state.assets[state.selectedAsset];

  // Generate mock chart data points
  const generateChartPoints = () => {
    const points = [];
    let price = selectedAsset.price;
    
    for (let i = 0; i < 30; i++) {
      const variance = (Math.random() - 0.5) * price * 0.05;
      price = Math.max(price * 0.8, price + variance);
      points.push({
        x: (i / 29) * 100,
        y: 100 - ((price - selectedAsset.price * 0.8) / (selectedAsset.price * 0.4)) * 80
      });
    }
    return points;
  };

  const chartPoints = generateChartPoints();
  const pathData = chartPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">
          {selectedAsset.symbol} Price Chart
        </h3>
        <div className="text-white text-right">
          <div className="text-2xl font-bold">${selectedAsset.price.toLocaleString()}</div>
          <div className={`text-sm ${selectedAsset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative h-64 chart-gradient rounded-lg overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(102, 126, 234, 0.8)" />
              <stop offset="100%" stopColor="rgba(102, 126, 234, 0.1)" />
            </linearGradient>
          </defs>
          
          {/* Chart line */}
          <path
            d={pathData}
            stroke="#667eea"
            strokeWidth="0.5"
            fill="none"
          />
          
          {/* Fill area under curve */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#chartGradient)"
          />
          
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.2"
            />
          ))}
        </svg>

        {/* Chart points */}
        {chartPoints.slice(-5).map((point, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-white rounded-full transform -translate-x-1 -translate-y-1"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4 text-sm text-white text-opacity-70">
        <span>24h Low: ${(selectedAsset.price * 0.95).toLocaleString()}</span>
        <span>24h High: ${(selectedAsset.price * 1.08).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default PriceChart;