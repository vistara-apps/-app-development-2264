import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TradingContext = createContext();

// Mock market data for simulation
const MOCK_ASSETS = {
  'ETH': { symbol: 'ETH', name: 'Ethereum', price: 2300, change: 2.5 },
  'BTC': { symbol: 'BTC', name: 'Bitcoin', price: 45000, change: -1.2 },
  'USDC': { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.1 },
  'LINK': { symbol: 'LINK', name: 'Chainlink', price: 15.50, change: 3.8 },
  'UNI': { symbol: 'UNI', name: 'Uniswap', price: 8.75, change: -0.5 },
};

const initialState = {
  user: {
    userId: 'demo-user',
    virtualBalance: 10000,
    totalPnL: 0,
    winRate: 0,
    totalTrades: 0,
  },
  trades: [],
  assets: MOCK_ASSETS,
  selectedAsset: 'ETH',
  activeTab: 'trading',
  learningModules: [
    {
      moduleId: 1,
      title: 'Technical Analysis Basics',
      content: 'Learn to read charts and identify patterns',
      type: 'text',
      completed: false,
    },
    {
      moduleId: 2,
      title: 'Risk Management',
      content: 'Master position sizing and stop losses',
      type: 'video',
      completed: false,
    },
    {
      moduleId: 3,
      title: 'Market Psychology',
      content: 'Understanding emotions in trading',
      type: 'text',
      completed: false,
    },
  ],
};

function tradingReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_SELECTED_ASSET':
      return { ...state, selectedAsset: action.payload };
    
    case 'EXECUTE_TRADE':
      const trade = action.payload;
      const newTrades = [...state.trades, trade];
      const newBalance = state.user.virtualBalance - (trade.type === 'buy' ? trade.quantity * trade.entryPrice : -(trade.quantity * trade.entryPrice));
      
      // Calculate new stats
      const completedTrades = newTrades.filter(t => t.exitPrice);
      const totalPnL = completedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const winningTrades = completedTrades.filter(t => (t.pnl || 0) > 0);
      const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0;
      
      return {
        ...state,
        trades: newTrades,
        user: {
          ...state.user,
          virtualBalance: newBalance,
          totalPnL,
          winRate,
          totalTrades: newTrades.length,
        },
      };
    
    case 'UPDATE_ASSET_PRICES':
      const updatedAssets = { ...state.assets };
      Object.keys(updatedAssets).forEach(symbol => {
        const asset = updatedAssets[symbol];
        const priceChange = (Math.random() - 0.5) * asset.price * 0.02; // ±2% random change
        asset.price = Math.max(0.01, asset.price + priceChange);
        asset.change = (priceChange / asset.price) * 100;
      });
      return { ...state, assets: updatedAssets };
    
    case 'COMPLETE_MODULE':
      return {
        ...state,
        learningModules: state.learningModules.map(module =>
          module.moduleId === action.payload
            ? { ...module, completed: true }
            : module
        ),
      };
    
    default:
      return state;
  }
}

export function TradingProvider({ children }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_ASSET_PRICES' });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load persisted data
  useEffect(() => {
    const savedTrades = localStorage.getItem('flashtrade-trades');
    if (savedTrades) {
      JSON.parse(savedTrades).forEach(trade => {
        dispatch({ type: 'EXECUTE_TRADE', payload: trade });
      });
    }
  }, []);

  // Persist trades
  useEffect(() => {
    localStorage.setItem('flashtrade-trades', JSON.stringify(state.trades));
  }, [state.trades]);

  return (
    <TradingContext.Provider value={{ state, dispatch }}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTradingContext() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
}