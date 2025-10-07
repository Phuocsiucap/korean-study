// src/components/WordInfoTags.jsx
import React from 'react';
import { Flame } from 'lucide-react';

const WordInfoTags = ({ 
  difficulty, 
  learned, 
  streak,
  getDifficultyColor,
  getDifficultyLabel 
}) => {
  return (
    <div className="flex justify-center items-center space-x-2 mb-4">
      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
        {getDifficultyLabel(difficulty)}
      </span>
      {learned && (
        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
          ✓
        </span>
      )}
      <div className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-md border border-orange-200">
        <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
        <span className="text-xs sm:text-sm font-bold text-orange-600">{streak || 0}</span>
      </div>
    </div>
  );
};

export default WordInfoTags;