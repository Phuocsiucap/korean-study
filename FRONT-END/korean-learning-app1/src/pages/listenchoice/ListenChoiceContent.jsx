// src/pages/ListenChoiceMode.jsx - Refactored
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Volume2, Check, X } from 'lucide-react';
import { useLessons } from '../../context/LessonContext';
import { useLearningProgress } from '../../context/useLearningProgress';

// Import shared components
import LearningResultScreen from '../../components/common/learning/LearningResultScreen';
import LearningHeader from '../../components/common/learning/LearningHeader';
import LearningProgressBar from '../../components/common/learning/LearningProgressBar';
import LearningStats from '../../components/common/learning/LearningStats';
import LearningProgressDots from '../../components/common/learning/LearningProgressDots';
import WordInfoTags from '../../components/common/learning/WordInfoTags';

const ListenChoiceContent = () => {
  const { categoryId, lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, editLesson } = useLessons(categoryId);
  
  const [lesson, setLesson] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answers, setAnswers] = useState([]);

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
      handleSpeak(currentCard.word);
    }
  }, [currentCard]);

  const generateAnswers = () => {
    if (!lesson?.words || !currentCard) return;

    const correctAnswer = currentCard.meaning;
    const otherWords = lesson.words.filter(w => w.id !== currentCard.id);
    
    let wrongAnswers = [];
    if (otherWords.length >= 3) {
      const shuffled = otherWords.sort(() => 0.5 - Math.random());
      wrongAnswers = shuffled.slice(0, 3).map(w => w.meaning);
    } else {
      wrongAnswers = otherWords.map(w => w.meaning);
      while (wrongAnswers.length < 3) {
        wrongAnswers.push(`Đáp án ${wrongAnswers.length + 1}`);
      }
    }

    const allAnswers = [correctAnswer, ...wrongAnswers];
    setAnswers(allAnswers.sort(() => 0.5 - Math.random()));
  };

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

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentCard.meaning;
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
  };

  // Loading state
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
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
        primaryColor="blue"
        showStudyTime={false}
      />
    );
  }

  // No words
  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Bài học chưa có từ vựng</div>
          <button
            onClick={handleBackToCategory}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      {/* Header - Using shared component */}
      <LearningHeader
        title="Nghe & Chọn"
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
        colorScheme="blue"
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats - Using shared component */}
        <LearningStats
          masteredCount={masteredCards.size}
          progress={progress}
          difficultCount={difficultCards.size}
          primaryColor="blue"
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
              Nghĩa của từ này là gì?
            </h2>
            
            {/* Audio Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleSpeak(currentCard.word)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 sm:p-4 rounded-full transition-all hover:shadow-lg"
              >
                <Volume2 className="w-8 h-8 sm:w-12 sm:h-12" />
              </button>
            </div>

            {/* Word Display */}
            <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-1">
              {currentCard.word}
            </div>
            <div className="text-gray-500 text-base sm:text-lg">
              {currentCard.pronunciation || `/${currentCard.word.toLowerCase()}/`}
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {answers.map((answer, idx) => {
              const isSelected = selectedAnswer === answer;
              const isCorrectAnswer = answer === currentCard.meaning;
              
              let bgColor = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
              if (isSelected) {
                if (isCorrect) {
                  bgColor = 'bg-green-100 border-green-500';
                } else {
                  bgColor = 'bg-red-100 border-red-500';
                }
              } else if (selectedAnswer && isCorrectAnswer) {
                bgColor = 'bg-green-100 border-green-500';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(answer)}
                  disabled={selectedAnswer !== null}
                  className={`${bgColor} border-2 rounded-xl p-3 sm:p-4 text-left transition-all hover:shadow-md disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center font-bold text-gray-700 text-sm sm:text-base">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-base sm:text-lg font-medium text-gray-900">
                        {answer}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <div>
                        {isCorrect ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <X className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    )}
                    
                    {selectedAnswer && !isSelected && isCorrectAnswer && (
                      <Check className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedAnswer && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Chính xác!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">
                      Sai rồi! Đáp án đúng là: <strong>{currentCard.meaning}</strong>
                    </span>
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
          primaryColor="blue"
        />
      </main>
    </div>
  );
};

export default ListenChoiceContent;

