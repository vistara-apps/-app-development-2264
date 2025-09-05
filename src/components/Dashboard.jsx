import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import Sidebar from './Sidebar';
import TradingInterface from './TradingInterface';
import Analytics from './Analytics';
import LearningModules from './LearningModules';

function Dashboard() {
  const { state } = useTradingContext();

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'trading':
        return <TradingInterface />;
      case 'analytics':
        return <Analytics />;
      case 'learning':
        return <LearningModules />;
      default:
        return <TradingInterface />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;