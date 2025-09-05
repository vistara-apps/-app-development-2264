import React from 'react';
import { TradingProvider } from './context/TradingContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <TradingProvider>
      <div className="min-h-screen gradient-bg">
        <Dashboard />
      </div>
    </TradingProvider>
  );
}

export default App;