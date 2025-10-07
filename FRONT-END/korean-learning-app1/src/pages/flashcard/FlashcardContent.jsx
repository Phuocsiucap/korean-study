// src/pages/FlashcardContent.jsx - Refactored
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Volume2, RotateCw, Check, X, ChevronLeft, ChevronRight, Trophy, Flame } from 'lucide-react';
import { useLessons } from '../../context/LessonContext';
import { useLearningProgress } from '../../context/useLearningProgress';
import { filterWords, parseFilterParams } from '../../utils/filterUtils';

// Import shared components
import LearningResultScreen from '../../components/common/learning/LearningResultScreen';
import LearningHeader from '../../components/common/learning/LearningHeader';
import LearningProgressBar from '../../components/common/learning/LearningProgressBar';
// import WordInfoTags from '../../components/common/learning/WordInfoTags';

const FlashcardContent = () => {
  const { categoryId, lessonId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { lessons, editLesson } = useLessons(categoryId);
  const [originalLesson, setOriginalLesson] = useState(null);
  const [filteredLesson, setFilteredLesson] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const foundLesson = lessons.find(l => l.id === parseInt(lessonId));
    if (foundLesson) {
      setOriginalLesson(foundLesson);
    }
  }, [lessons, lessonId]);

  useEffect(() => {
    if (originalLesson && originalLesson.words) {
      const filters = parseFilterParams(searchParams);
      const filtered = filterWords(originalLesson.words, filters);
      setFilteredLesson({
        ...originalLesson,
        words: filtered
      });
    }
  }, [originalLesson, searchParams]);

  const {
    currentIndex,
    currentWords,
    currentCard,
    progress,
    masteredCards,
    difficultCards,
    showResult,
    score,
    updatedWords,
    isReviewMode,
    finalStudyTime,
    handleAnswer,
    handleFinishEarly,
    handleRestart,
    nextCard,
    prevCard,
    getDifficultyColor,
    getDifficultyLabel
  } = useLearningProgress(filteredLesson, originalLesson, categoryId, lessonId, editLesson);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBackToCategory = () => {
    navigate(`/category/${categoryId}`);
  };

  // Loading state
  if (!originalLesson || !filteredLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Đang tải bài học...</div>
      </div>
    );
  }

  // No words after filtering
  if (filteredLesson.words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy từ vựng
          </h2>
          <p className="text-gray-600 mb-6">
            Không có từ nào phù hợp với bộ lọc bạn chọn. Vui lòng thử lại với bộ lọc khác.
          </p>
          <button
            onClick={() => navigate(`/lesson-mode/${categoryId}/${lessonId}`)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
          >
            Chọn lại bộ lọc
          </button>
        </div>
      </div>
    );
  }

  // Result screen - Using shared component
  if (showResult) {
    return (
      <LearningResultScreen
        score={score}
        masteredCards={masteredCards}
        updatedWords={updatedWords}
        totalWords={filteredLesson.words?.length || 0}
        difficultCards={difficultCards}
        finalStudyTime={finalStudyTime}
        handleRestart={handleRestart}
        categoryId={categoryId}
        lessonId={lessonId}
        primaryColor="purple"
        showStudyTime={true}
      />
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Bài học chưa có từ vựng</div>
          <button onClick={handleBackToCategory} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentWordData = updatedWords[currentCard.id] || currentCard;

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header - Using shared component */}
      <LearningHeader
        title={filteredLesson.title}
        currentIndex={currentIndex}
        totalWords={currentWords?.length || 0}
        isReviewMode={isReviewMode}
        onBack={handleBackToCategory}
        onFinish={() => handleFinishEarly(navigate)}
      />

      {/* Progress Bar - Using shared component */}
      <LearningProgressBar 
        progress={progress} 
        isReviewMode={isReviewMode}
        colorScheme="purple"
      />

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Flashcard */}
        <div className="relative mb-8" style={{ perspective: '1000px' }}>
          <div
            className={`relative w-full h-80 transition-transform duration-500 cursor-pointer`}
            style={{ 
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', 
              transformStyle: 'preserve-3d' 
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div 
              className="absolute w-full h-full bg-white rounded-xl shadow-xl p-6 flex flex-col" 
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex justify-between mb-4">
                <span className={`px-2 py-1 rounded-md text-xs border ${getDifficultyColor(currentWordData.difficulty)}`}>
                  {getDifficultyLabel(currentWordData.difficulty)}
                </span>
                <div className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-md border border-orange-200">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">{currentWordData.streak || 0}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold mb-2">{currentCard.word}</div>
                <div className="text-gray-500 text-lg mb-4">{currentCard.pronunciation}</div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleSpeak(currentCard.word); 
                  }} 
                  className="bg-purple-100 hover:bg-purple-200 p-3 rounded-full transition-colors"
                >
                  <Volume2 className="w-6 h-6 text-purple-600" />
                </button>
              </div>
              <div className="text-gray-400 text-xs text-center">Nhấn để xem nghĩa</div>
            </div>
            
            {/* Back */}
            <div 
              className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-xl p-6 flex flex-col"
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
              <div className="flex justify-between mb-4 text-white">
                <span className="px-2 py-1 rounded-md text-xs border border-white/30">
                  Cấp {currentWordData.difficulty}
                </span>
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-md">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentWordData.streak || 0}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-white text-center">
                <div className="text-3xl font-bold mb-4">{currentCard.meaning}</div>
                {currentCard.example && (
                  <div className="italic text-purple-100 text-lg">"{currentCard.example}"</div>
                )}
              </div>
              <div className="text-purple-100 text-xs text-center">Nhấn để xem từ vựng</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between mb-4">
          <button 
            onClick={prevCard} 
            disabled={currentIndex === 0} 
            className={`px-4 py-2 bg-white rounded-lg shadow ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFlipped(!isFlipped)} 
            className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button 
            onClick={nextCard} 
            disabled={currentIndex === currentWords.length - 1} 
            className={`px-4 py-2 bg-white rounded-lg shadow ${
              currentIndex === currentWords.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAnswer(false)} 
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            <X className="w-5 h-5 mr-2" /> Cần ôn
          </button>
          <button 
            onClick={() => handleAnswer(true)} 
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            <Check className="w-5 h-5 mr-2" /> Đã thuộc
          </button>
        </div>
      </main>
    </div>
  );
};

export default FlashcardContent;