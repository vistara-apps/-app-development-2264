import React from 'react';

function AnalyticsCard({ variant, title, value, change, icon: Icon, positive }) {
  const variantClasses = {
    pnl: 'bg-gradient-to-br from-green-500 to-green-600',
    winRate: 'bg-gradient-to-br from-blue-500 to-blue-600',
    trades: 'bg-gradient-to-br from-purple-500 to-purple-600',
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white text-opacity-70 text-sm">{title}</div>
        <div className={`p-2 rounded-lg ${variantClasses[variant] || 'bg-white bg-opacity-20'}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="text-white text-2xl font-bold mb-2">{value}</div>
      
      <div className={`text-sm ${
        positive ? 'text-green-400' : 'text-red-400'
      }`}>
        {change}
      </div>
    </div>
  );
}

export default AnalyticsCard;