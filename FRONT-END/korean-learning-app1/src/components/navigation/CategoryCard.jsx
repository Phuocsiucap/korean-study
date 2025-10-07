import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import ProgressBar from '../common/home/ProgressBar';

const CategoryCard = ({ category, onSelectCategory }) => {
  const isLocked = category.progress === 0 && category.id == 0;
  
  return (
    <div 
      onClick={() => !isLocked && onSelectCategory(category)}
      className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
        isLocked ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {isLocked && (
        <div className="absolute top-4 right-4 bg-gray-100 rounded-full p-2">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
       <div className={`text-4xl bg-${category.color}-50 rounded-2xl p-3`}>
        {/* <div className={`text-4xl bg-blue-50 rounded-2xl p-3`}> */}
          {category.icon}
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold text-${category.color}-700`}>
             {/* <div className={`text-sm font-semibold ${category.textColor}`}></div> */}
            {category.completed}/{category.lesson} bài
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{category.description}</p>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{category.total_words} từ vựng</span>
          <span>{category.progress.toFixed(2)}%</span>
        </div>
        
        <ProgressBar progress={category.progress} color={`from-${category.color}-600 to-${category.color}-700`} />
        
        {/* <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>~{Math.ceil(category.total_words / 10)} phút</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-${category.color}-700`} />
        </div> */}
      </div>
    </div>
  );
};

export default CategoryCard;