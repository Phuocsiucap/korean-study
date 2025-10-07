// src/components/LearningProgressBar.jsx
import React from 'react';

const LearningProgressBar = ({ progress, isReviewMode, colorScheme = 'purple' }) => {
  const colorClasses = {
    purple: isReviewMode 
      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
      : 'bg-gradient-to-r from-purple-500 to-pink-500',
    blue: isReviewMode 
      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
      : 'bg-gradient-to-r from-blue-500 to-cyan-500',
    pink: isReviewMode 
      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
      : 'bg-gradient-to-r from-pink-500 to-rose-500',
    green: isReviewMode 
      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
      : 'bg-gradient-to-r from-green-500 to-emerald-500'
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${colorClasses[colorScheme]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LearningProgressBar;