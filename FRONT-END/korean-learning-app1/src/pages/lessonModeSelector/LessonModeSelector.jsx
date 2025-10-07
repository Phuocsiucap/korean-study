import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Headphones, PenTool, Volume2, Play, Settings } from 'lucide-react';
import LessonFilterModal from '../../components/modals/LessonFilterModal';
import { useLessons } from '../../context/LessonContext';

const LessonModeSelector = () => {
  const { categoryId, lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons } = useLessons(categoryId);
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const foundLesson = lessons.find(l => l.id === parseInt(lessonId));
    if (foundLesson) setCurrentLesson(foundLesson);
  }, [lessons, lessonId]);

  const learningModes = [
    {
      id: 'flashcard',
      name: 'Flashcard',
      description: 'Học từ vựng với thẻ ghi nhớ',
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      hoverColor: 'hover:border-indigo-400'
    },
    {
      id: 'listen-choice',
      name: 'Nghe & Chọn',
      description: 'Nghe và chọn đáp án đúng',
      icon: <Headphones className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-400'
    },
    {
      id: 'listen-write',
      name: 'Nghe & Viết',
      description: 'Nghe và viết đáp án',
      icon: <PenTool className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:border-green-400'
    },
    {
      id: 'listen-audio',
      name: 'Chọn Audio',
      description: 'Nghe và chọn âm thanh đúng',
      icon: <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      hoverColor: 'hover:border-pink-400'
    }
  ];

  const handleBack = () => {
    navigate(`/category/${categoryId}`);
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setShowFilterModal(true);
  };

  const handleStartWithFilters = (filters) => {
    if (!selectedMode) return;
    
    // Encode filters to pass as URL params
    const filterParams = new URLSearchParams({
      difficulty: filters.difficulty.join(','),
      streak: filters.streak,
      wordLimit: filters.wordLimit,
      includeUnlearned: filters.includeUnlearned,
      includeLearned: filters.includeLearned
    }).toString();
    
    // Navigate to the learning mode with filters
    navigate(`/${selectedMode.id}/${categoryId}/${lessonId}?${filterParams}`);
  };

  const totalWords = currentLesson?.words?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Quay lại</span>
            </button>
            
            <h1 className="text-base sm:text-xl font-bold text-gray-800">
              Chọn phương thức học
            </h1>
            
            <div className="w-16 sm:w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Info Banner */}
        {currentLesson && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{currentLesson.title}</h2>
                <p className="text-sm text-gray-600">{totalWords} từ vựng</p>
              </div>
              <div className="flex items-center space-x-2 text-purple-600">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Có thể tùy chỉnh</span>
              </div>
            </div>
          </div>
        )}

        {/* Learning Modes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8 max-w-4xl mx-auto">
          {learningModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              className={`${mode.bgColor} rounded-lg sm:rounded-2xl p-4 sm:p-8 border-2 ${mode.borderColor} ${mode.hoverColor} transition-all duration-300 hover:shadow-xl hover:scale-105 group text-left`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br ${mode.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {mode.icon}
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-3">
                {mode.name}
              </h3>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-6 leading-relaxed">
                {mode.description}
              </p>

              {/* Action */}
              <div className="flex items-center space-x-2 text-purple-600 font-semibold group-hover:text-purple-700">
                <Play className="w-3 h-3 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-base">Tùy chỉnh và bắt đầu</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 sm:mt-16 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
            💡 Gợi ý cho bạn
          </h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
            <p className="flex items-start">
              <span className="text-purple-600 font-bold mr-2">•</span>
              <span><strong>Flashcard:</strong> Phù hợp để học và ghi nhớ từ mới nhanh chóng</span>
            </p>
            <p className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span><strong>Nghe & Chọn:</strong> Rèn luyện kỹ năng nghe hiểu và phát âm</span>
            </p>
            <p className="flex items-start">
              <span className="text-green-600 font-bold mr-2">•</span>
              <span><strong>Nghe & Viết:</strong> Nâng cao kỹ năng chính tả và nghe</span>
            </p>
            <p className="flex items-start">
              <span className="text-pink-600 font-bold mr-2">•</span>
              <span><strong>Chọn Audio:</strong> Phân biệt âm thanh và phát âm chính xác</span>
            </p>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      <LessonFilterModal
        isOpen={showFilterModal}
        onClose={() => {
          setShowFilterModal(false);
          setSelectedMode(null);
        }}
        onStartLesson={handleStartWithFilters}
        totalWords={totalWords}
      />
    </div>
  );
};

export default LessonModeSelector;