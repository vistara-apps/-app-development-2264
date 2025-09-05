import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTradingContext } from '../context/TradingContext';
import { baseAPI } from '../services/api';
import { format } from 'date-fns';

function PriceChart() {
  const { state } = useTradingContext();
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1d');

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        // In production, this would use real token addresses
        const mockAddress = '0x4200000000000000000000000000000000000006'; // ETH on Base
        const historicalData = await baseAPI.getHistoricalPrices(mockAddress, timeframe);
        
        const formattedData = historicalData.map(point => ({
          timestamp: point.timestamp,
          time: format(new Date(point.timestamp), timeframe === '1d' ? 'HH:mm' : 'MM/dd'),
          price: point.price,
          volume: point.volume,
        }));
        
        setPriceHistory(formattedData);
      } catch (error) {
        console.error('Failed to fetch price history:', error);
        // Fallback to mock data
        generateMockPriceHistory();
      } finally {
        setLoading(false);
      }
    };

    const generateMockPriceHistory = () => {
      const asset = state.assets[state.selectedAsset];
      const history = [];
      let currentPrice = asset.price;
      const points = timeframe === '1d' ? 24 : timeframe === '7d' ? 168 : 720; // 1d, 7d, 30d
      
      for (let i = points - 1; i >= 0; i--) {
        const change = (Math.random() - 0.5) * currentPrice * 0.02;
        currentPrice = Math.max(0.01, currentPrice + change);
        const timestamp = Date.now() - i * (timeframe === '1d' ? 3600000 : timeframe === '7d' ? 3600000 : 3600000);
        
        history.push({
          timestamp,
          time: format(new Date(timestamp), timeframe === '1d' ? 'HH:mm' : 'MM/dd'),
          price: currentPrice,
          volume: Math.random() * 1000000,
        });
      }
      
      setPriceHistory(history);
    };

    fetchPriceHistory();
  }, [state.selectedAsset, state.assets, timeframe]);

  const currentPrice = state.assets[state.selectedAsset]?.price || 0;
  const firstPrice = priceHistory[0]?.price || currentPrice;
  const priceChange = currentPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white border-opacity-20">
          <p className="text-gray-800 font-semibold">{`Time: ${label}`}</p>
          <p className="text-blue-600">
            {`Price: $${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
          {payload[0].payload.volume && (
            <p className="text-gray-600 text-sm">
              {`Volume: $${payload[0].payload.volume.toLocaleString()}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {state.selectedAsset} Price Chart
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white text-lg font-bold">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {['1d', '7d', '30d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-white text-opacity-60 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceHistory}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#667eea"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-white text-opacity-60 text-xs">
        <span>
          {timeframe === '1d' ? '24 hours ago' : timeframe === '7d' ? '7 days ago' : '30 days ago'}
        </span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default PriceChart;
