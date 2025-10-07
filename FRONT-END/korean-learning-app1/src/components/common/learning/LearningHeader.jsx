// src/components/LearningHeader.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LearningHeader = ({
  title,
  currentIndex,
  totalWords,
  isReviewMode,
  onBack,
  onFinish,
  showFinishButton = true
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Quay lại</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-bold text-gray-800">
              {isReviewMode ? '🔄 Ôn lại từ sai' : title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {currentIndex + 1} / {totalWords}
            </p>
          </div>
          
          {showFinishButton && !isReviewMode && (
            <button
              onClick={onFinish}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium"
            >
              Kết thúc
            </button>
          )}
          {(isReviewMode || !showFinishButton) && <div className="w-16 sm:w-24"></div>}
        </div>
      </div>
    </header>
  );
};

export default LearningHeader;