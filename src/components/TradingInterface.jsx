import React, { useState } from 'react';
import { useTradingContext } from '../context/TradingContext';
import MarketDataDisplay from './MarketDataDisplay';
import TradeInputForm from './TradeInputForm';
import RecentTrades from './RecentTrades';
import PriceChart from './PriceChart';

function TradingInterface() {
  const { state } = useTradingContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Trading Dashboard</h2>
        <div className="text-white text-opacity-80">
          Live Simulation Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart />
          <MarketDataDisplay />
        </div>
        
        <div className="space-y-6">
          <TradeInputForm />
          <RecentTrades />
        </div>
      </div>
    </div>
  );
}

export default TradingInterface;