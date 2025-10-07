// src/components/LearningProgressDots.jsx
import React from 'react';

const LearningProgressDots = ({
  currentWords,
  currentIndex,
  masteredCards,
  difficultCards,
  updatedWords,
  primaryColor = 'purple'
}) => {
  const activeColorClasses = {
    purple: 'bg-purple-600 ring-purple-300',
    blue: 'bg-blue-600 ring-blue-300',
    pink: 'bg-pink-600 ring-pink-300',
    green: 'bg-green-600 ring-green-300'
  };

  const learnedColorClasses = {
    purple: 'bg-purple-300',
    blue: 'bg-blue-300',
    pink: 'bg-pink-300',
    green: 'bg-green-300'
  };

  return (
    <>
      {/* Progress Dots */}
      <div className="flex justify-center flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {currentWords.map((card, idx) => {
          const wordData = updatedWords[card.id] || card;
          return (
            <div
              key={card.id}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                idx === currentIndex 
                  ? `${activeColorClasses[primaryColor]} scale-125 ring-2` 
                  : masteredCards.has(card.id)
                  ? 'bg-green-500'
                  : difficultCards.has(card.id)
                  ? 'bg-red-500'
                  : wordData.learned
                  ? learnedColorClasses[primaryColor]
                  : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-2 sm:gap-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Đúng</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Sai</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${learnedColorClasses[primaryColor]}`}></div>
          <span>Thuộc</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>Chưa</span>
        </div>
      </div>
    </>
  );
};

export default LearningProgressDots;