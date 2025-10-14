import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Play, Pause, Volume2, Eye, EyeOff, Check, X, ChevronRight, Flag, RotateCcw } from 'lucide-react';

const ListeningTestScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const audioRef = useRef(null);

  // Mock data
  const questions = [
    {
      id: 201,
      type: 'listening',
      audio_url: 'https://cdn.example.com/lesson1_dialog1.mp3',
      transcript: '안녕! 오늘 뭐 먹을래?',
      translation: 'Xin chào! Hôm nay ăn gì nhé?',
      questions: [
        {
          q_id: 'q1',
          type: 'mcq',
          prompt: '두 사람은 무엇을 먹을까요?',
          promptVi: 'Hai người sẽ ăn gì?',
          choices: ['김밥', '라면', '피자'],
          answer: '김밥'
        }
      ]
    },
    {
      id: 202,
      type: 'listening',
      audio_url: 'https://cdn.example.com/lesson1_dialog2.mp3',
      transcript: '지금 몇 시예요? 3시 30분이에요.',
      translation: 'Bây giờ mấy giờ rồi? 3 giờ 30 phút.',
      questions: [
        {
          q_id: 'q2',
          type: 'mcq',
          prompt: '지금 몇 시입니까?',
          promptVi: 'Bây giờ là mấy giờ?',
          choices: ['2시 30분', '3시 30분', '4시 30분'],
          answer: '3시 30분'
        },
        {
          q_id: 'q3',
          type: 'short',
          prompt: '대화는 무엇에 대해 이야기합니까?',
          promptVi: 'Cuộc hội thoại nói về điều gì?',
          answer: '시간'
        }
      ]
    }
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = () => {
    const speeds = [0.8, 1, 1.2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    let total = 0;

    currentQ.questions.forEach(q => {
      total++;
      const userAnswer = answers[q.q_id];
      if (userAnswer === q.answer) {
        correct++;
      }
    });

    setScore(prev => ({
      correct: prev.correct + correct,
      total: prev.total + total
    }));
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAnswers({});
      setSubmitted(false);
      setShowTranscript(false);
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      handleFinishTest();
    }
  };

  const handleSkip = () => {
    setScore(prev => ({
      ...prev,
      total: prev.total + currentQ.questions.length
    }));
    handleNext();
  };

  const handleFinishTest = () => {
    setShowResults(true);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  if (showResults) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="text-2xl font-bold text-blue-600">{formatTime(900 - timeLeft)}</div>
                <div className="text-sm text-gray-600">Thời gian</div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
                Xem lại câu sai
              </button>
              <button className="w-full bg-white border-2 border-teal-300 text-teal-600 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all">
                Làm lại bài kiểm tra
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Quay lại danh sách bài học
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Thoát</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-teal-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Audio Player */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
              </div>

              {/* Waveform Animation */}
              <div className="flex items-center justify-center space-x-1 mb-4 h-12">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-teal-500 rounded-full transition-all ${
                      isPlaying ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatTime(Math.floor(currentTime))}</span>
                  <span>{formatTime(Math.floor(duration))}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReplay}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm font-medium">Nghe lại</span>
                </button>

                <button
                  onClick={handleSpeedChange}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-200 transition-all"
                >
                  {playbackSpeed}x
                </button>

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
                >
                  {showTranscript ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="text-sm font-medium">Transcript</span>
                </button>
              </div>

              {/* Transcript */}
              {showTranscript && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-teal-200">
                  <p className="text-lg font-medium text-gray-900 mb-2">{currentQ.transcript}</p>
                  <p className="text-sm text-gray-600">{currentQ.translation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentQ.questions.map((q, idx) => (
              <div key={q.q_id} className="border-2 border-gray-200 rounded-xl p-4">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                    Câu hỏi {idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{q.prompt}</h3>
                <p className="text-gray-600 mb-4">{q.promptVi}</p>

                {q.type === 'mcq' ? (
                  <div className="space-y-2">
                    {q.choices.map((choice, cidx) => (
                      <button
                        key={cidx}
                        onClick={() => !submitted && handleAnswerChange(q.q_id, choice)}
                        disabled={submitted}
                        className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-all ${
                          submitted && choice === q.answer
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : submitted && choice === answers[q.q_id] && choice !== q.answer
                            ? 'bg-red-50 border-red-500 text-red-700'
                            : answers[q.q_id] === choice
                            ? 'bg-teal-50 border-teal-500 text-teal-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-teal-400 hover:bg-teal-50'
                        } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{choice}</span>
                          {submitted && choice === q.answer && (
                            <Check className="w-6 h-6 text-green-600" />
                          )}
                          {submitted && choice === answers[q.q_id] && choice !== q.answer && (
                            <X className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={answers[q.q_id] || ''}
                      onChange={(e) => handleAnswerChange(q.q_id, e.target.value)}
                      disabled={submitted}
                      placeholder="Nhập câu trả lời..."
                      className={`w-full p-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        submitted
                          ? answers[q.q_id] === q.answer
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                          : 'border-gray-300'
                      } ${submitted ? 'cursor-not-allowed' : ''}`}
                    />
                    {submitted && answers[q.q_id] !== q.answer && (
                      <p className="mt-2 text-sm text-red-700">
                        <strong>Đáp án đúng:</strong> {q.answer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
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
                  disabled={Object.keys(answers).length < currentQ.questions.length}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>{currentQuestion < questions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
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

export default ListeningTestScreen;