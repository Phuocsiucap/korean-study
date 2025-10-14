import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Mic, Volume2, Play, Pause, ChevronRight, Flag, RotateCcw, Check, X } from 'lucide-react';

const PronunciationTestScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [practiceMode, setPracticeMode] = useState('word'); // 'word' or 'sentence'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState({ points: 0, count: 0 });

  // Mock data
  const questions = [
    {
      id: 301,
      type: 'pronunciation',
      mode: 'word',
      text: '사과',
      meaning: 'quả táo',
      romanization: 'sa-gwa',
      reference_audio: 'https://cdn.example.com/tts/sa-gwa.mp3'
    },
    {
      id: 302,
      type: 'pronunciation',
      mode: 'word',
      text: '안녕하세요',
      meaning: 'xin chào',
      romanization: 'an-nyeong-ha-se-yo',
      reference_audio: 'https://cdn.example.com/tts/hello.mp3'
    },
    {
      id: 303,
      type: 'pronunciation',
      mode: 'sentence',
      text: '저는 한국어를 공부해요.',
      meaning: 'Tôi đang học tiếng Hàn.',
      romanization: 'jeo-neun han-gu-geo-reul gong-bu-hae-yo',
      reference_audio: 'https://cdn.example.com/tts/sentence1.mp3'
    },
    {
      id: 304,
      type: 'pronunciation',
      mode: 'sentence',
      text: '오늘 날씨가 좋아요.',
      meaning: 'Hôm nay thời tiết đẹp.',
      romanization: 'o-neul nal-ssi-ga jo-a-yo',
      reference_audio: 'https://cdn.example.com/tts/sentence2.mp3'
    }
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const maxRecordTime = 8;

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

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxRecordTime) {
            stopRecording();
            return maxRecordTime;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    setPronunciationScore(null);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    // Simulate pronunciation scoring
    const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100
    setTimeout(() => {
      setPronunciationScore(randomScore);
    }, 1000);
  };

  const playReference = () => {
    setIsPlayingReference(true);
    setTimeout(() => setIsPlayingReference(false), 2000);
  };

  const playUserRecording = () => {
    setIsPlayingUser(true);
    setTimeout(() => setIsPlayingUser(false), 2000);
  };

  const handleAccept = () => {
    if (pronunciationScore) {
      setTotalScore(prev => ({
        points: prev.points + pronunciationScore,
        count: prev.count + 1
      }));
    }
    setSubmitted(true);
  };

  const handleRetry = () => {
    setHasRecorded(false);
    setPronunciationScore(null);
    setRecordingTime(0);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setHasRecorded(false);
      setPronunciationScore(null);
      setSubmitted(false);
      setRecordingTime(0);
    } else {
      handleFinishTest();
    }
  };

  const handleSkip = () => {
    setTotalScore(prev => ({ ...prev, count: prev.count + 1 }));
    handleNext();
  };

  const handleFinishTest = () => {
    setShowResults(true);
  };

  const getPronunciationFeedback = (score) => {
    if (score >= 90) return { text: 'Xuất sắc! Phát âm rất chuẩn', color: 'text-green-600' };
    if (score >= 80) return { text: 'Tốt! Phát âm khá chính xác', color: 'text-blue-600' };
    if (score >= 70) return { text: 'Cần cải thiện: chú ý ngữ điệu', color: 'text-yellow-600' };
    return { text: 'Cần luyện tập thêm', color: 'text-red-600' };
  };

  if (showResults) {
    const avgScore = totalScore.count > 0 ? Math.round(totalScore.points / totalScore.count) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">{avgScore}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành bài kiểm tra!</h2>
              <p className="text-gray-600">Điểm trung bình phát âm của bạn</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{totalScore.count}</div>
                <div className="text-sm text-gray-600">Câu hoàn thành</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{avgScore}</div>
                <div className="text-sm text-gray-600">Điểm TB</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-600">{formatTime(600 - timeLeft)}</div>
                <div className="text-sm text-gray-600">Thời gian</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">📊 Đánh giá chi tiết</h3>
              <div className="space-y-3 text-sm text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Độ chính xác phát âm:</span>
                  <span className="font-bold text-gray-900">{avgScore >= 85 ? '✓ Tốt' : '~ Khá'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngữ điệu:</span>
                  <span className="font-bold text-gray-900">{avgScore >= 80 ? '✓ Tốt' : '○ Cần cải thiện'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tốc độ nói:</span>
                  <span className="font-bold text-gray-900">✓ Phù hợp</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
                Xem chi tiết từng câu
              </button>
              <button className="w-full bg-white border-2 border-red-300 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all">
                Luyện tập lại
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Thoát</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
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
              className="bg-gradient-to-r from-red-500 to-rose-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setPracticeMode('word')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  practiceMode === 'word'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Từ
              </button>
              <button
                onClick={() => setPracticeMode('sentence')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  practiceMode === 'sentence'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Câu
              </button>
            </div>
          </div>

          {/* Question Type Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {currentQ.mode === 'word' ? '🔤 Đọc từ' : '💬 Đọc câu'}
            </span>
          </div>

          {/* Prompt Area */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h2 className={`font-bold text-gray-900 mb-3 ${
                currentQ.mode === 'word' ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl'
              }`}>
                {currentQ.text}
              </h2>
              <p className="text-gray-500 text-lg mb-2">{currentQ.romanization}</p>
              <p className="text-gray-600 font-medium">{currentQ.meaning}</p>
            </div>

            {/* Reference Audio */}
            <button
              onClick={playReference}
              disabled={isPlayingReference}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isPlayingReference ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Đang phát...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>Nghe mẫu</span>
                </>
              )}
            </button>
          </div>

          {/* Recording Area */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-8 mb-6">
            <div className="flex flex-col items-center">
              {/* Mic Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={submitted}
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all transform ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 scale-110 animate-pulse'
                    : 'bg-gradient-to-br from-red-500 to-rose-600 hover:shadow-xl hover:scale-105'
                } ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Mic className="w-16 h-16 text-white" />
              </button>

              {/* Recording Timer */}
              {isRecording && (
                <div className="text-center mb-4">
                  <div className="text-3xl font-mono font-bold text-red-600">
                    {recordingTime.toFixed(1)}s
                  </div>
                  <div className="text-sm text-gray-600">Tối đa {maxRecordTime}s</div>
                </div>
              )}

              {/* Waveform */}
              {(isRecording || hasRecorded) && (
                <div className="flex items-center justify-center space-x-1 mb-4 h-16 w-full">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isRecording ? 'bg-red-500' : 'bg-gray-400'
                      } ${isRecording ? 'animate-pulse' : ''}`}
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Instructions */}
              {!isRecording && !hasRecorded && (
                <p className="text-gray-600 text-center">
                  Nhấn vào micro để bắt đầu ghi âm
                  <br />
                  <span className="text-sm text-gray-500">Bạn có tối đa {maxRecordTime} giây</span>
                </p>
              )}

              {/* Playback User Recording */}
              {hasRecorded && !isRecording && (
                <button
                  onClick={playUserRecording}
                  disabled={isPlayingUser}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all disabled:opacity-50 mb-4"
                >
                  {isPlayingUser ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Đang phát...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Nghe lại bản ghi</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Pronunciation Score */}
          {pronunciationScore !== null && (
            <div className="mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Điểm phát âm</span>
                  <div className="flex items-center space-x-2">
                    {pronunciationScore >= 80 ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-yellow-600" />
                    )}
                    <span className="text-3xl font-bold text-purple-600">{pronunciationScore}</span>
                  </div>
                </div>

                {/* Score Meter */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ${
                        pronunciationScore >= 90 ? 'bg-green-500' :
                        pronunciationScore >= 80 ? 'bg-blue-500' :
                        pronunciationScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pronunciationScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Feedback */}
                <div className={`text-center ${getPronunciationFeedback(pronunciationScore).color}`}>
                  <p className="font-semibold">
                    {getPronunciationFeedback(pronunciationScore).text}
                  </p>
                  {pronunciationScore < 80 && (
                    <p className="text-sm mt-2 text-gray-600">
                      💡 Lời khuyên: Nghe kỹ bản mẫu và chú ý đến âm đầu & ngữ điệu
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!submitted ? (
              <>
                {hasRecorded && pronunciationScore !== null ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Thử lại</span>
                    </button>
                    <button
                      onClick={handleAccept}
                      className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Chấp nhận điểm
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Bỏ qua
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
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

        {/* Tips */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            💡 Mẹo phát âm tốt hơn
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Nghe kỹ bản mẫu nhiều lần trước khi ghi âm</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Chú ý đến âm đầu và âm cuối của từng âm tiết</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Giữ nhịp độ vừa phải, không quá nhanh hoặc quá chậm</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Luyện tập ngữ điệu tự nhiên như người bản xứ</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PronunciationTestScreen;