// src/pages/ListenAudioMode.jsx - Refactored
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Volume2, Check, X, Play} from 'lucide-react';
import { useLessons } from '../../context/LessonContext';
import { useLearningProgress } from '../../context/useLearningProgress';

// Import shared components
import LearningResultScreen from '../../components/common/learning/LearningResultScreen';
import LearningHeader from '../../components/common/learning/LearningHeader';
import LearningProgressBar from '../../components/common/learning/LearningProgressBar';
import LearningStats from '../../components/common/learning/LearningStats';
import LearningProgressDots from '../../components/common/learning/LearningProgressDots';
import WordInfoTags from '../../components/common/learning/WordInfoTags';

const ListenAudioContent = () => {
  const { categoryId, lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, editLesson } = useLessons(categoryId);
  
  const [lesson, setLesson] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [countdown, setCountdown] = useState(3);
  const [isPreloading, setIsPreloading] = useState(true);
  const autoPlayTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

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
      generateAnswers();
    }
  }, [currentCard]);

  useEffect(() => {
    if (answers.length > 0 && !selectedAnswer) {
      setIsPreloading(true);
      setCountdown(3);
      
      if ('speechSynthesis' in window && answers[0]) {
        const preloadUtterance = new SpeechSynthesisUtterance(answers[0].word);
        preloadUtterance.lang = 'ko-KR';
        preloadUtterance.volume = 0;
        window.speechSynthesis.speak(preloadUtterance);
      }

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setIsPreloading(false);
            startAutoPlay();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
  }, [answers, selectedAnswer]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const generateAnswers = () => {
    if (!lesson?.words || !currentCard) return;

    const correctAnswer = { word: currentCard.word, id: currentCard.id };
    const otherWords = lesson.words.filter(w => w.id !== currentCard.id);
    
    let wrongAnswers = [];
    if (otherWords.length >= 3) {
      const shuffled = otherWords.sort(() => 0.5 - Math.random());
      wrongAnswers = shuffled.slice(0, 3).map(w => ({ word: w.word, id: w.id }));
    } else {
      wrongAnswers = otherWords.map(w => ({ word: w.word, id: w.id }));
      while (wrongAnswers.length < 3) {
        wrongAnswers.push({ word: `예시 ${wrongAnswers.length + 1}`, id: `dummy-${wrongAnswers.length}` });
      }
    }

    const allAnswers = [correctAnswer, ...wrongAnswers];
    setAnswers(allAnswers.sort(() => 0.5 - Math.random()));
  };

  const handleSpeak = (text, callback) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      
      if (callback) {
        utterance.onend = callback;
      }
      
      window.speechSynthesis.speak(utterance);
    } else if (callback) {
      setTimeout(callback, 1500);
    }
  };

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
    playNextAnswer(0);
  };

  const playNextAnswer = (index) => {
    if (index >= answers.length) {
      setIsAutoPlaying(false);
      setCurrentPlayingIndex(-1);
      return;
    }

    setCurrentPlayingIndex(index);
    handleSpeak(answers[index].word, () => {
      autoPlayTimeoutRef.current = setTimeout(() => {
        playNextAnswer(index + 1);
      }, 1000);
    });
  };

  const handlePlayAnswer = (index) => {
    if (selectedAnswer !== null || isAutoPlaying || isPreloading) return;
    
    setCurrentPlayingIndex(index);
    handleSpeak(answers[index].word, () => {
      setTimeout(() => {
        setCurrentPlayingIndex(-1);
      }, 200);
    });
  };

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null || isAutoPlaying) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    setIsAutoPlaying(false);
    setCurrentPlayingIndex(-1);

    setSelectedAnswer(answer);
    const correct = answer.id === currentCard.id;
    setIsCorrect(correct);

    setTimeout(() => {
      handleAnswer(correct);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 1500);
  };

  const handleBackToCategory = () => {
    navigate(`/category/${categoryId}`);
  };

  const handleRestartClick = () => {
    handleRestart();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnswers([]);
    setIsAutoPlaying(false);
    setCurrentPlayingIndex(-1);
  };

  // Loading state
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center">
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
        primaryColor="pink"
        showStudyTime={false}
      />
    );
  }

  // No words
  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Bài học chưa có từ vựng</div>
          <button
            onClick={handleBackToCategory}
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Header - Using shared component */}
      <LearningHeader
        title="Chọn Audio"
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
        colorScheme="pink"
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats - Using shared component */}
        <LearningStats
          masteredCount={masteredCards.size}
          progress={progress}
          difficultCount={difficultCards.size}
          primaryColor="pink"
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
              Chọn audio phát âm đúng
            </h2>
            
            {/* Meaning Display */}
            <div className="bg-rose-50 rounded-xl p-4 sm:p-6 mb-6 border-2 border-rose-200">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">Nghĩa của từ:</div>
              <div className="text-2xl sm:text-4xl font-bold text-rose-700">
                {currentCard.meaning}
              </div>
            </div>

            {/* Countdown / Auto-play status */}
            {isPreloading && (
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg p-4 mb-4 border-2 border-pink-300">
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-pink-300 border-t-pink-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-pink-600">{countdown}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-pink-800">Chuẩn bị phát audio...</div>
                    <div className="text-xs text-pink-600">Đang tải âm thanh</div>
                  </div>
                </div>
              </div>
            )}

            {isAutoPlaying && !isPreloading && (
              <div className="text-sm text-pink-600 mb-4 flex items-center justify-center space-x-2">
                <Play className="w-4 h-4 animate-pulse" />
                <span>Đang phát audio tự động...</span>
              </div>
            )}

            {!isAutoPlaying && !isPreloading && selectedAnswer === null && (
              <div className="text-xs sm:text-sm text-gray-500 mb-4">
                Click vào nút để nghe lại âm thanh
              </div>
            )}
          </div>

          {/* Audio Answer Options */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {answers.map((answer, idx) => {
              const isSelected = selectedAnswer?.id === answer.id;
              const isCorrectAnswer = answer.id === currentCard.id;
              const isPlaying = currentPlayingIndex === idx;
              
              let bgColor = 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-rose-50 border-gray-200';
              let borderStyle = 'border-2';
              
              if (isPlaying) {
                bgColor = 'bg-gradient-to-br from-pink-100 to-rose-100 border-pink-400';
                borderStyle = 'border-4 animate-pulse';
              } else if (isSelected) {
                if (isCorrect) {
                  bgColor = 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500';
                  borderStyle = 'border-4';
                } else {
                  bgColor = 'bg-gradient-to-br from-red-100 to-rose-100 border-red-500';
                  borderStyle = 'border-4';
                }
              } else if (selectedAnswer && isCorrectAnswer) {
                bgColor = 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500';
                borderStyle = 'border-4';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(answer)}
                  disabled={selectedAnswer !== null || isAutoPlaying || isPreloading}
                  className={`${bgColor} ${borderStyle} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:shadow-xl disabled:cursor-not-allowed relative group`}
                >
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <div 
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                        isPlaying 
                          ? 'bg-pink-500 scale-110' 
                          : isSelected
                          ? isCorrect
                            ? 'bg-green-500'
                            : 'bg-red-500'
                          : 'bg-pink-400 group-hover:bg-pink-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAnswer(idx);
                      }}
                    >
                      {isPlaying ? (
                        <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                      ) : (
                        <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      )}
                    </div>
                    
                    <div className="text-base sm:text-lg font-bold text-gray-700">
                      {String.fromCharCode(65 + idx)}
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                        {isCorrect ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedAnswer && !isSelected && isCorrectAnswer && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedAnswer && (
            <div className={`mt-6 p-4 sm:p-6 rounded-xl ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-start space-x-3">
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-green-800 font-bold text-base sm:text-lg mb-1">Chính xác!</div>
                      <div className="text-sm sm:text-base text-green-700">
                        Bạn đã chọn đúng âm thanh của từ: <strong className="text-lg sm:text-xl">{currentCard.word}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-red-800 font-bold text-base sm:text-lg mb-1">Chưa đúng!</div>
                      <div className="text-sm sm:text-base text-red-700">
                        Đáp án đúng là: <strong className="text-lg sm:text-xl">{currentCard.word}</strong>
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
          primaryColor="pink"
        />
      </main>
    </div>
  );
};

export default ListenAudioContent;