// src/components/LearningStats.jsx
import React from 'react';
import { Check, Star, X } from 'lucide-react';

const LearningStats = ({ 
  masteredCount, 
  progress, 
  difficultCount,
  primaryColor = 'purple'
}) => {
  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    pink: 'text-pink-600',
    green: 'text-green-600'
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
      <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-sm">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
          <span className="text-xs sm:text-sm text-gray-600">Đúng</span>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-green-600">{masteredCount}</div>
      </div>
      <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-sm">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses[primaryColor]}`} />
          <span className="text-xs sm:text-sm text-gray-600">Tiến độ</span>
        </div>
        <div className={`text-lg sm:text-2xl font-bold ${colorClasses[primaryColor]}`}>
          {Math.round(progress)}%
        </div>
      </div>
      <div className="bg-white rounded-lg p-2 sm:p-4 text-center shadow-sm">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
          <span className="text-xs sm:text-sm text-gray-600">Sai</span>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-red-600">{difficultCount}</div>
      </div>
    </div>
  );
};

export default LearningStats;