import React from 'react';
import { ChevronRight } from 'lucide-react';
import GrammarCard from '../navigation/GammarCard';

const GrammarSection = ({ onNavigateToGrammar }) => {
  const grammarTopics = [
    {
      id: 1,
      title: "이다 / 아니다",
      type: "verb",
      typeName: "Động từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Động từ 'là' và 'không là' trong tiếng Hàn - Cách sử dụng cơ bản nhất",
      duration: "15 phút",
      exercises: 12,
      progress: 75,
      completed: false
    },
    {
      id: 2,
      title: "이/가 Trợ từ chủ ngữ",
      type: "particle",
      typeName: "Trợ từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Trợ từ đánh dấu chủ ngữ trong câu",
      duration: "20 phút",
      exercises: 15,
      progress: 0,
      completed: false
    },
    {
      id: 3,
      title: "ㅂ/습니다 Kết thúc",
      type: "sentence",
      typeName: "Mẫu câu",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Cách kết thúc câu trang trọng trong tiếng Hàn",
      duration: "18 phút",
      exercises: 10,
      progress: 100,
      completed: true
    }
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📖 Ngữ pháp</h2>
          <p className="text-gray-600 text-sm mt-1">Nắm vững nền tảng ngữ pháp tiếng Hàn</p>
        </div>
        <button
          onClick={onNavigateToGrammar}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grammarTopics.map(grammar => (
          <GrammarCard 
            key={grammar.id} 
            grammar={grammar}
            onSelectGrammar={onNavigateToGrammar}
          />
        ))}
      </div>
    </section>
  );
};

export default GrammarSection;