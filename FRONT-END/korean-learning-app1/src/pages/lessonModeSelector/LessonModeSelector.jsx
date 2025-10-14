import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Headphones, PenTool, Volume2, Play, Settings } from 'lucide-react';
import LessonFilterModal from '../../components/modals/LessonFilterModal';
import TestFilterModal from '../../components/modals/TestFilterModal';
import { useLessons } from '../../context/LessonContext';

const LessonModeSelector = () => {
  const { categoryId, lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons } = useLessons(categoryId);
  
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
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
      hoverColor: 'hover:border-indigo-400',
      type: 'practice'
    },
    {
      id: 'listen-choice',
      name: 'Nghe & Chọn',
      description: 'Nghe và chọn đáp án đúng',
      icon: <Headphones className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-400',
      type: 'practice'
    },
    {
      id: 'listen-write',
      name: 'Nghe & Viết',
      description: 'Nghe và viết đáp án',
      icon: <PenTool className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:border-green-400',
      type: 'practice'
    },
    {
      id: 'listen-audio',
      name: 'Chọn Audio',
      description: 'Nghe và chọn âm thanh đúng',
      icon: <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      hoverColor: 'hover:border-pink-400',
      type: 'practice'
    }
  ];

  const testModes = [
    {
      id: 'cloze-test',
      name: 'Điền từ',
      description: 'Hoàn thành câu với từ vựng phù hợp',
      icon: <PenTool className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:border-orange-400',
      type: 'test'
    },
    {
      id: 'listening-test',
      name: 'Nghe hiểu',
      description: 'Nghe đoạn hội thoại và trả lời câu hỏi',
      icon: <Headphones className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      borderColor: 'border-teal-200',
      hoverColor: 'hover:border-teal-400',
      type: 'test'
    },
    {
      id: 'pronunciation-test',
      name: 'Phát âm',
      description: 'Đọc từ và câu, kiểm tra phát âm',
      icon: <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:border-red-400',
      type: 'test'
    }
  ];

  const handleBack = () => {
    navigate(`/category/${categoryId}`);
  };

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    if (mode.type === 'practice') {
      setShowPracticeModal(true);
    } else {
      setShowTestModal(true);
    }
  };

  const handleStartWithPracticeFilters = (filters) => {
    if (!selectedMode) return;
    
    const filterParams = new URLSearchParams({
      difficulty: filters.difficulty.join(','),
      streak: filters.streak,
      wordLimit: filters.wordLimit,
      includeUnlearned: filters.includeUnlearned,
      includeLearned: filters.includeLearned
    }).toString();
    
    navigate(`/${selectedMode.id}/${categoryId}/${lessonId}?${filterParams}`);
  };

  const handleStartWithTestFilters = (filters) => {
    if (!selectedMode) return;
    
    const filterParams = new URLSearchParams({
      difficulty: filters.difficulty.join(','),
      streak: filters.streak,
      wordLimit: filters.wordLimit,
      questionCount: filters.questionCount,
      includeUnlearned: filters.includeUnlearned,
      includeLearned: filters.includeLearned
    }).toString();
    
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

        {/* Practice Section */}
        <div className="mb-6 sm:mb-8 max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
            Luyện tập
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {learningModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleSelectMode(mode)}
                className={`${mode.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 ${mode.borderColor} ${mode.hoverColor} transition-all duration-300 hover:shadow-lg hover:scale-105 group text-left`}
              >
                <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {mode.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                  {mode.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                  {mode.description}
                </p>
                <div className="flex items-center space-x-1 sm:space-x-2 text-purple-600 font-semibold group-hover:text-purple-700">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Tùy chỉnh và bắt đầu</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Test Section */}
        <div className="mb-6 sm:mb-8 max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <PenTool className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
            Kiểm tra
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {testModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleSelectMode(mode)}
                className={`${mode.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 ${mode.borderColor} ${mode.hoverColor} transition-all duration-300 hover:shadow-lg hover:scale-105 group text-left`}
              >
                <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {mode.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                  {mode.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                  {mode.description}
                </p>
                <div className="flex items-center space-x-1 sm:space-x-2 text-orange-600 font-semibold group-hover:text-orange-700">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Tùy chỉnh và bắt đầu</span>
                </div>
              </button>
            ))}
          </div>
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
              <span className="text-orange-600 font-bold mr-2">•</span>
              <span><strong>Điền từ:</strong> Kiểm tra khả năng sử dụng từ trong ngữ cảnh</span>
            </p>
            <p className="flex items-start">
              <span className="text-teal-600 font-bold mr-2">•</span>
              <span><strong>Bài kiểm tra:</strong> Cho phép tùy chỉnh số câu hỏi và mức độ</span>
            </p>
          </div>
        </div>
      </main>

      {/* Practice Filter Modal */}
      <LessonFilterModal
        isOpen={showPracticeModal}
        onClose={() => {
          setShowPracticeModal(false);
          setSelectedMode(null);
        }}
        onStartLesson={handleStartWithPracticeFilters}
        totalWords={totalWords}
      />

      {/* Test Filter Modal */}
      <TestFilterModal
        isOpen={showTestModal}
        onClose={() => {
          setShowTestModal(false);
          setSelectedMode(null);
        }}
        onStartTest={handleStartWithTestFilters}
        totalWords={totalWords}
      />
    </div>
  );
};

export default LessonModeSelector;