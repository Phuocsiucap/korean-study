import React from 'react';
import { BookOpen, Clock, Star, CheckCircle, ChevronRight } from 'lucide-react';

const GrammarCard = ({ grammar, onSelectGrammar }) => {
  const getTypeColor = (type) => {
    const colors = {
      verb: 'from-green-500 to-green-600',
      adjective: 'from-blue-500 to-blue-600',
      noun: 'from-purple-500 to-purple-600',
      particle: 'from-pink-500 to-pink-600',
      sentence: 'from-orange-500 to-orange-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div 
      onClick={() => onSelectGrammar(grammar)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${grammar.completed ? 'from-green-500 to-green-600' : getTypeColor(grammar.type)}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${grammar.completed ? 'bg-green-100' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
              <BookOpen className={`w-6 h-6 ${grammar.completed ? 'text-green-600' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{grammar.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getTypeColor(grammar.type)} text-white`}>
                  {grammar.typeName}
                </span>
                <span className="text-xs text-gray-500">{grammar.levelName}</span>
              </div>
            </div>
          </div>
          {grammar.completed && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{grammar.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{grammar.duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-gray-700 font-medium">{grammar.exercises} bài tập</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-600" />
        </div>

        {grammar.progress > 0 && !grammar.completed && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Tiến độ</span>
              <span>{grammar.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getTypeColor(grammar.type)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${grammar.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarCard;