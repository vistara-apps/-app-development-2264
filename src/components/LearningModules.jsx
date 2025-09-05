import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import LearningModuleCard from './LearningModuleCard';
import { BookOpen, Video, FileText } from 'lucide-react';

function LearningModules() {
  const { state } = useTradingContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Learning Center</h2>
        <div className="text-white text-opacity-80">
          Master trading strategies
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.learningModules.map((module) => (
          <LearningModuleCard
            key={module.moduleId}
            module={module}
            variant={module.completed ? 'completed' : 'default'}
          />
        ))}
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Trading Tips</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h4 className="text-white font-semibold">Risk Management</h4>
              </div>
              <p className="text-white text-opacity-80 text-sm">
                Never risk more than 2% of your capital on a single trade. Use stop-losses to protect your downside.
              </p>
            </div>
            
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Video className="w-5 h-5 text-green-400" />
                <h4 className="text-white font-semibold">Technical Analysis</h4>
              </div>
              <p className="text-white text-opacity-80 text-sm">
                Learn to read charts, identify trends, and use indicators like RSI, MACD, and moving averages.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h4 className="text-white font-semibold">Psychology</h4>
              </div>
              <p className="text-white text-opacity-80 text-sm">
                Control emotions like fear and greed. Stick to your trading plan and don't chase losses.
              </p>
            </div>
            
            <div className="p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-orange-400" />
                <h4 className="text-white font-semibold">Practice</h4>
              </div>
              <p className="text-white text-opacity-80 text-sm">
                Use this simulator to practice strategies without risking real money. Track your performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningModules;