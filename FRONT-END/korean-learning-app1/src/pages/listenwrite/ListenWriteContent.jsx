
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Volume2, AlertCircle,Check, X } from 'lucide-react';
import { useLessons } from '../../context/LessonContext';
import { useLearningProgress } from '../../context/useLearningProgress';

// Import shared components
import LearningResultScreen from '../../components/common/learning/LearningResultScreen';
import LearningHeader from '../../components/common/learning/LearningHeader';
import LearningProgressBar from '../../components/common/learning/LearningProgressBar';
import LearningStats from '../../components/common/learning/LearningStats';
import LearningProgressDots from '../../components/common/learning/LearningProgressDots';
import WordInfoTags from '../../components/common/learning/WordInfoTags';

const ListenWriteContent = () => {
  const { categoryId, lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, editLesson } = useLessons(categoryId);
  const inputRef = useRef(null);
  
  const [lesson, setLesson] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [needsRetry, setNeedsRetry] = useState(false);

  const {
    currentIndex,
    masteredCards,
    difficultCards,
    showResult,
    isReviewMode,
    updatedWords,
    score,
    currentWords,
    currentCard,
    progress,
    finalStudyTime,
    handleAnswer,
    handleFinishEarly,
    handleRestart,
    getDifficultyColor,
    getDifficultyLabel
  } = useLearningProgress(lesson, lesson, categoryId, lessonId, editLesson);

  useEffect(() => {
    const foundLesson = lessons.find(l => l.id === parseInt(lessonId));
    if (foundLesson) {
      setLesson(foundLesson);
    }
  }, [lessons, lessonId]);

  useEffect(() => {
    if (currentCard) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentCard]);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const speak = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;

        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 150);
      };

      if (speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          speak();
        };
      } else {
        speak();
      }
    }
  };

  const normalizeString = (str) => {
    return str.trim().replace(/\s+/g, '').toLowerCase();
  };

  const handleSubmit = () => {
    if (!userInput.trim() || isSubmitted) return;

    setIsSubmitted(true);
    const normalizedInput = normalizeString(userInput);
    const normalizedAnswer = normalizeString(currentCard.word);
    const correct = normalizedInput === normalizedAnswer;
    
    setIsCorrect(correct);
    handleSpeak(currentCard.word);

    if (correct) {
      setTimeout(() => {
        handleAnswer(!needsRetry);
        setUserInput('');
        setIsSubmitted(false);
        setIsCorrect(null);
        setShowHint(false);
        setNeedsRetry(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setUserInput('');
        setIsSubmitted(false);
        setIsCorrect(null);
        setNeedsRetry(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }, 2500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitted) {
      handleSubmit();
    }
  };

  const handleBackToCategory = () => {
    navigate(`/category/${categoryId}`);
  };

  const handleRestartClick = () => {
    handleRestart();
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setNeedsRetry(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Loading state
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Đang tải bài học...</div>
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
        totalWords={lesson.words?.length || 0}
        difficultCards={difficultCards}
        finalStudyTime={finalStudyTime}
        handleRestart={handleRestartClick}
        categoryId={categoryId}
        lessonId={lessonId}
        primaryColor="green"
        showStudyTime={false}
      />
    );
  }

  // No words
  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Bài học chưa có từ vựng</div>
          <button
            onClick={handleBackToCategory}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentWordData = updatedWords[currentCard.id] || currentCard;

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header - Using shared component */}
      <LearningHeader
        title="Nghe & Viết"
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
        colorScheme="green"
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats - Using shared component */}
        <LearningStats
          masteredCount={masteredCards.size}
          progress={progress}
          difficultCount={difficultCards.size}
          primaryColor="green"
        />

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="text-center mb-6 sm:mb-8">
            {/* Word Info Tags - Using shared component */}
            <WordInfoTags
              difficulty={currentWordData.difficulty}
              learned={currentWordData.learned}
              streak={currentWordData.streak}
              getDifficultyColor={getDifficultyColor}
              getDifficultyLabel={getDifficultyLabel}
            />

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Nghe và viết từ tiếng Hàn
            </h2>
            
            {/* Audio Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => handleSpeak(currentCard.word)}
                className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-6 rounded-full transition-all hover:shadow-lg transform hover:scale-105"
              >
                <Volume2 className="w-8 h-8 sm:w-12 sm:h-12" />
              </button>
            </div>

            {/* Meaning Display */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-4 sm:mb-6 border-2 border-emerald-200">
              <div className="text-sm text-gray-600 mb-1">Nghĩa của từ:</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700">
                {currentCard.meaning}
              </div>
            </div>

            {/* Hint Button */}
            {!needsRetry && (
              <button
                onClick={toggleHint}
                disabled={isSubmitted}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 mx-auto mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
              </button>
            )}

            {/* Retry Message */}
            {needsRetry && !isSubmitted && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
                <div className="text-orange-900 font-bold mb-2 flex items-center justify-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Hãy thử lại!</span>
                </div>
                <div className="text-orange-800 text-sm">
                  Đáp án đúng là: <strong className="text-xl text-green-700">{currentCard.word}</strong>
                  <br />
                  Hãy điền lại để ghi nhớ từ này tốt hơn
                </div>
              </div>
            )}

            {/* Hint */}
            {showHint && !isSubmitted && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-yellow-800">
                  <strong>Gợi ý:</strong> Từ có {currentCard.word.length} ký tự
                  {currentCard.word.length > 0 && ` và bắt đầu bằng "${currentCard.word[0]}"`}
                </div>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Nhập từ tiếng Hàn:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitted}
              className="w-full px-4 py-3 sm:py-4 text-xl sm:text-2xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="안녕하세요"
              autoComplete="off"
            />
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className={`w-full py-3 sm:py-4 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-base sm:text-lg ${
                needsRetry 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {needsRetry ? 'Thử lại' : 'Kiểm tra'}
            </button>
          )}

          {/* Feedback */}
          {isSubmitted && (
            <div className={`p-4 sm:p-6 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-start space-x-3">
                {isCorrect ? (
                  <>
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="text-green-800 font-bold text-lg mb-2">Chính xác!</div>
                      <div className="text-green-700">
                        Bạn đã viết đúng: <strong className="text-xl">{currentCard.word}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="text-red-800 font-bold text-lg mb-2">Chưa đúng!</div>
                      <div className="text-red-700 space-y-1">
                        <div>Bạn đã viết: <strong className="text-xl">{userInput}</strong></div>
                        <div>Đáp án đúng: <strong className="text-xl text-green-700">{currentCard.word}</strong></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Dots - Using shared component */}
        <LearningProgressDots
          currentWords={currentWords}
          currentIndex={currentIndex}
          masteredCards={masteredCards}
          difficultCards={difficultCards}
          updatedWords={updatedWords}
          primaryColor="green"
        />
      </main>
    </div>
  );
};

export default ListenWriteContent;