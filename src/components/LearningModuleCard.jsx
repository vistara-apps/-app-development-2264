import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { Check, Play, FileText } from 'lucide-react';

function LearningModuleCard({ module, variant }) {
  const { dispatch } = useTradingContext();

  const handleComplete = () => {
    if (!module.completed) {
      dispatch({ type: 'COMPLETE_MODULE', payload: module.moduleId });
    }
  };

  const getIcon = () => {
    if (module.completed) return Check;
    if (module.type === 'video') return Play;
    return FileText;
  };

  const Icon = getIcon();

  return (
    <div className={`glass-effect rounded-xl p-6 cursor-pointer transition-all hover:bg-white hover:bg-opacity-15 ${
      variant === 'completed' ? 'ring-2 ring-green-400 ring-opacity-50' : ''
    }`} onClick={handleComplete}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${
          variant === 'completed' 
            ? 'bg-green-500' 
            : module.type === 'video' 
            ? 'bg-red-500' 
            : 'bg-blue-500'
        }`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        {variant === 'completed' && (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Completed
          </div>
        )}
      </div>
      
      <h3 className="text-white text-lg font-semibold mb-2">{module.title}</h3>
      <p className="text-white text-opacity-80 text-sm mb-4">{module.content}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-white text-opacity-60 text-xs uppercase">
          {module.type}
        </span>
        
        {!module.completed && (
          <button className="text-blue-400 text-sm hover:text-blue-300">
            Start Learning →
          </button>
        )}
      </div>
    </div>
  );
}

export default LearningModuleCard;