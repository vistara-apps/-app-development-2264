import React, { useState } from 'react';
import { useTradingContext } from '../context/TradingContext';
import { ShoppingCart, TrendingDown } from 'lucide-react';

function TradeInputForm() {
  const { state, dispatch } = useTradingContext();
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');

  const selectedAsset = state.assets[state.selectedAsset];
  const maxQuantity = tradeType === 'buy' 
    ? Math.floor(state.user.virtualBalance / selectedAsset.price)
    : 0; // For sell, we'd need to track positions

  const handleTrade = (e) => {
    e.preventDefault();
    
    const tradeQuantity = parseFloat(quantity);
    const price = orderType === 'market' ? selectedAsset.price : parseFloat(limitPrice);
    const totalValue = tradeQuantity * price;

    if (tradeType === 'buy' && totalValue > state.user.virtualBalance) {
      alert('Insufficient balance!');
      return;
    }

    if (tradeQuantity <= 0) {
      alert('Invalid quantity!');
      return;
    }

    const trade = {
      tradeId: Date.now(),
      userId: state.user.userId,
      symbol: state.selectedAsset,
      type: tradeType,
      quantity: tradeQuantity,
      entryPrice: price,
      exitPrice: null,
      timestamp: new Date().toISOString(),
      pnl: 0,
      strategyUsed: 'Manual',
    };

    dispatch({ type: 'EXECUTE_TRADE', payload: trade });
    setQuantity('');
    setLimitPrice('');
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Place Order</h3>
      
      <div className="mb-4">
        <div className="text-white text-sm mb-2">Selected Asset</div>
        <div className="text-white font-semibold text-lg">
          {selectedAsset.symbol} - ${selectedAsset.price.toLocaleString()}
        </div>
      </div>

      <form onSubmit={handleTrade} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              tradeType === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Buy
          </button>
          <button
            type="button"
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              tradeType === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-2" />
            Sell
          </button>
        </div>

        <div>
          <label className="block text-white text-sm mb-2">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-white text-sm mb-2">Limit Price</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="Enter limit price"
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 placeholder-white placeholder-opacity-60"
              step="0.01"
            />
          </div>
        )}

        <div>
          <label className="block text-white text-sm mb-2">
            Quantity {tradeType === 'buy' && `(Max: ${maxQuantity})`}
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 placeholder-white placeholder-opacity-60"
            step="0.01"
            max={tradeType === 'buy' ? maxQuantity : undefined}
          />
        </div>

        <div className="text-white text-sm">
          <div className="flex justify-between">
            <span>Total Value:</span>
            <span>
              ${quantity && (orderType === 'market' ? selectedAsset.price : limitPrice) 
                ? (parseFloat(quantity) * (orderType === 'market' ? selectedAsset.price : parseFloat(limitPrice))).toLocaleString()
                : '0.00'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            tradeType === 'buy'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {state.selectedAsset}
        </button>
      </form>
    </div>
  );
}

export default TradeInputForm;