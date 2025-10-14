import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, HelpCircle, Check, X, Volume2, ChevronRight, Flag, Loader2 } from 'lucide-react';
import { useAIgen } from '../../../context/AIgen';
import { useLessons } from '../../../context/LessonContext';

const ClozeTestScreen = () => {
  const { Gen_cloze, loading: aiLoading } = useAIgen();
  const { categoryId, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { lessons, editLesson } = useLessons(categoryId);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Parse filters from URL
  const filters = {
    difficulty: searchParams.get('difficulty')?.split(',').filter(Boolean).map(Number) || [],
    streak: searchParams.get('streak') || 'all',
    wordLimit: parseInt(searchParams.get('wordLimit')) || 20,
    questionCount: parseInt(searchParams.get('questionCount')) || 10,
    includeUnlearned: searchParams.get('includeUnlearned') === 'true',
    includeLearned: searchParams.get('includeLearned') === 'true'
  };

  // Filter words based on user selection
  const filterWords = useCallback((words) => {
    if (!words || words.length === 0) return [];

    let filteredWords = [...words];

    // Filter by difficulty
    if (filters.difficulty.length > 0) {
      filteredWords = filteredWords.filter(w => 
        filters.difficulty.includes(w.difficulty)
      );
    }

    // Filter by streak
    if (filters.streak !== 'all') {
      filteredWords = filteredWords.filter(w => {
        const streak = w.streak || 0;
        if (filters.streak === 'low') return streak >= 0 && streak <= 1;
        if (filters.streak === 'medium') return streak >= 2 && streak <= 3;
        if (filters.streak === 'high') return streak >= 4;
        return true;
      });
    }

    // Filter by learned status
    if (!filters.includeUnlearned && !filters.includeLearned) {
      // If both unchecked, include all
      filteredWords = filteredWords;
    } else if (filters.includeUnlearned && !filters.includeLearned) {
      filteredWords = filteredWords.filter(w => !w.learned);
    } else if (!filters.includeUnlearned && filters.includeLearned) {
      filteredWords = filteredWords.filter(w => w.learned);
    }
    // If both checked, include all (no filter needed)

    // Shuffle and limit
    const shuffled = filteredWords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, filters.wordLimit);
  }, [filters]);

  // Load lesson data
  useEffect(() => {
    if (!lessons?.length || !lessonId) return;
    
    const lesson = lessons.find(l => l.id === parseInt(lessonId));
    if (!lesson) return;
    
    setCurrentLesson(lesson);
  }, [lessons, lessonId]);

  // Generate questions with filters
  const generateQuestions = useCallback(async (lesson) => {
    if (!lesson.words || lesson.words.length === 0) {
      console.error('No words found in lesson');
      return;
    }

    setIsGenerating(true);
    try {
      // Filter words based on user selection
      const filteredWords = filterWords(lesson.words);
      
      if (filteredWords.length === 0) {
        console.error('No words match the filter criteria');
        setQuestions([]);
        return;
      }

      const wordsList = filteredWords.map(w => w.word);
      
    //   const requestData = {
    //     words: wordsList,
    //     questionCount: filters.questionCount // Send question count to API
    //   };

      console.log('Generating questions with filters:', {
        totalWords: lesson.words.length,
        filteredWords: filteredWords.length,
        questionCount: filters.questionCount,
        filters
      });

      // Create promise with 90 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 90 seconds')), 90000)
      );

      const response = await Promise.race([
        Gen_cloze(wordsList, filters.questionCount),
        timeoutPromise
      ]);
      
      if (response.status === 200) {
        // Limit questions to requested count
        const limitedQuestions = response.data.quiz.slice(0, filters.questionCount);
        setQuestions(limitedQuestions);
        
        // Optional: Save to lesson
        // await editLesson(categoryId, lessonId, {
        //   ...lesson,
        //   clozeQuestions: limitedQuestions
        // });
      }
    } catch (error) {
      console.error('Failed to generate cloze questions:', error);
      if (error.message === 'Request timeout after 90 seconds') {
        alert('Yêu cầu quá lâu, vui lòng thử lại sau');
      }
      setQuestions([]);
    } finally {
      setIsGenerating(false);
    }
  }, [Gen_cloze, filterWords, filters.questionCount]);

  // Initialize test only once
  useEffect(() => {
    const initializeTest = async () => {
      if (!lessons || lessons.length === 0) return;
      
      const lesson = lessons.find(l => l.id === parseInt(lessonId));
      if (!lesson) {
        console.error('Lesson not found');
        return;
      }
      
      setCurrentLesson(lesson);
      
      // Always generate new questions based on filters
      // Don't use cached questions since filters might be different
      await generateQuestions(lesson);
    };

    initializeTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Timer countdown
  useEffect(() => {
    if (!showResults && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults, questions.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    const userAnswer = currentQ.mode === 'mcq' ? selectedChoice : answer.trim();
    const correct = userAnswer === currentQ.answer;
    setIsCorrect(correct);
    setSubmitted(true);
    
    if (correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAnswer('');
      setSelectedChoice(null);
      setSubmitted(false);
      setShowHint(false);
      setIsCorrect(false);
    } else {
      handleFinishTest();
    }
  };

  const handleSkip = () => {
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
    handleNext();
  };

  const handleFinishTest = () => {
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswer('');
    setSelectedChoice(null);
    setSubmitted(false);
    setShowHint(false);
    setIsCorrect(false);
    setTimeLeft(600);
    setShowResults(false);
    setScore({ correct: 0, total: 0 });
  };

  const handleBackToLessons = () => {
    navigate(`/category/${categoryId}`);
  };

  const playTTS = () => {
    console.log('Playing TTS for:', currentQ?.answer);
  };

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Loading state
  if (isGenerating || aiLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tạo câu hỏi...</h2>
          <p className="text-gray-600 mb-4">Vui lòng đợi trong giây lát (tối đa 90 giây)</p>
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
            <div className="text-sm text-gray-700 space-y-1">
              <p>📝 Số câu hỏi: <strong>{filters.questionCount}</strong></p>
              <p>📚 Số từ được chọn: <strong>{filters.wordLimit}</strong></p>
              {filters.difficulty.length > 0 && (
                <p>🎯 Độ khó: <strong>{filters.difficulty.join(', ')}</strong></p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No questions state
  if (!isGenerating && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tạo câu hỏi</h2>
          <p className="text-gray-600 mb-4">
            Không có từ vựng nào phù hợp với bộ lọc bạn đã chọn
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-left">
            <p className="text-gray-700 mb-2"><strong>Bộ lọc hiện tại:</strong></p>
            <ul className="space-y-1 text-gray-600">
              <li>• Số từ: {filters.wordLimit}</li>
              <li>• Số câu hỏi: {filters.questionCount}</li>
              {filters.difficulty.length > 0 && (
                <li>• Độ khó: {filters.difficulty.join(', ')}</li>
              )}
              <li>• Streak: {filters.streak}</li>
            </ul>
          </div>
          <button
            onClick={handleBackToLessons}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Quay lại và thử lại
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">{percentage}%</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành bài kiểm tra!</h2>
              <p className="text-gray-600">Bạn đã trả lời đúng {score.correct}/{score.total} câu</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{score.correct}</div>
                <div className="text-sm text-gray-600">Đúng</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600">{score.total - score.correct}</div>
                <div className="text-sm text-gray-600">Sai</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{formatTime(600 - timeLeft)}</div>
                <div className="text-sm text-gray-600">Thời gian</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-white border-2 border-orange-300 text-orange-600 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all"
              >
                Làm lại bài kiểm tra
              </button>
              <button
                onClick={handleBackToLessons}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Quay lại danh sách bài học
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBackToLessons}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Thoát</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                Câu {currentQuestion + 1}
              </span>
              <button 
                onClick={() => setShowHint(!showHint)}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Gợi ý</span>
              </button>
            </div>

            {showHint && (
              <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-purple-900 mb-1">Gợi ý:</p>
                    <p className="text-sm text-purple-700">
                      {currentQ.hints?.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-relaxed">
                {currentQ.prompt}
              </h2>
              <p className="text-gray-600">{currentQ.translation}</p>
            </div>
          </div>

          <div className="mb-6">
            {currentQ.mode === 'mcq' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.choices?.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => !submitted && setSelectedChoice(choice)}
                    disabled={submitted}
                    className={`p-4 rounded-xl border-2 text-lg font-semibold transition-all ${
                      submitted && choice === currentQ.answer
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : submitted && choice === selectedChoice && choice !== currentQ.answer
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : selectedChoice === choice
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:bg-orange-50'
                    } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{choice}</span>
                      {submitted && choice === currentQ.answer && (
                        <Check className="w-6 h-6 text-green-600" />
                      )}
                      {submitted && choice === selectedChoice && choice !== currentQ.answer && (
                        <X className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
                placeholder="Nhập câu trả lời bằng tiếng Hàn..."
                className={`w-full p-4 text-2xl border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  submitted
                    ? isCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : 'border-gray-300'
                } ${submitted ? 'cursor-not-allowed' : ''}`}
              />
            )}
          </div>

          {submitted && (
            <div className={`mb-6 p-4 rounded-xl border-l-4 ${
              isCorrect 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-start space-x-3">
                {isCorrect ? (
                  <Check className="w-6 h-6 text-green-600 mt-0.5" />
                ) : (
                  <X className="w-6 h-6 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold mb-2 ${
                    isCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}
                  </p>
                  {!isCorrect && (
                    <div className="space-y-2">
                      <p className="text-sm text-red-800">
                        <strong>Đáp án đúng:</strong> {currentQ.answer}
                      </p>
                      <p className="text-sm text-red-700">
                        {currentQ.exampleSentence}
                      </p>
                      <button
                        onClick={playTTS}
                        className="flex items-center space-x-2 text-red-700 hover:text-red-800"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Nghe phát âm</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!submitted ? (
              <>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={currentQ.mode === 'mcq' ? !selectedChoice : !answer.trim()}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>{currentQuestion < questions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleFinishTest}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span className="text-sm font-medium">Nộp bài sớm</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ClozeTestScreen;