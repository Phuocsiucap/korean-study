// ✅ src/components/LearningResultScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, RotateCw } from 'lucide-react';

const LearningResultScreen = ({
  score,
  masteredCards,
  updatedWords,
  totalWords,
  difficultCards,
  finalStudyTime,
  handleRestart,
  categoryId,
  lessonId,
  primaryColor = 'purple', // purple, blue, pink, green
  showStudyTime = false
}) => {
  const navigate = useNavigate();
  
  const learnedCount = Object.values(updatedWords).filter(w => w.learned).length;
  
  const minutes = finalStudyTime ? Math.floor(finalStudyTime / 60) : 0;
  const seconds = finalStudyTime ? finalStudyTime % 60 : 0;
  const studyTimeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const colorClasses = {
    purple: 'text-purple-600 bg-purple-600 hover:bg-purple-700',
    blue: 'text-blue-600 bg-blue-600 hover:bg-blue-700',
    pink: 'text-pink-600 bg-pink-600 hover:bg-pink-700',
    green: 'text-green-600 bg-green-600 hover:bg-green-700'
  };

  const handleBackToCategory = () => {
    navigate(`/category/${categoryId}`);
  };

  // 🌟 Thêm lời khích lệ (giống ResultsScreen)
  const accuracy = totalWords > 0 ? Math.round((masteredCards.size / totalWords) * 100) : 0;

  const getResultEmoji = () => {
    if (accuracy >= 80) return '🎉';
    if (accuracy >= 60) return '👍';
    return '💪';
  };

  const getResultMessage = () => {
    if (accuracy >= 80) return 'Xuất sắc!';
    if (accuracy >= 60) return 'Tốt lắm!';
    return 'Cố gắng lên!';
  };

  const getEncouragement = () => {
    if (accuracy >= 80) return 'Bạn đã thành thạo bài học này!';
    if (accuracy >= 60) return 'Bạn đang tiến bộ rất tốt!';
    return 'Đừng bỏ cuộc, hãy thử lại nhé!';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
        
        {/* 🌟 Thêm phần lời khen */}
        <div className="mb-6">
          <div className="text-6xl mb-3">{getResultEmoji()}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{getResultMessage()}</h2>
          <p className="text-gray-600 text-sm">{getEncouragement()}</p>
        </div>

        {/* Phần kết quả */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
          <p className="text-gray-600">Bạn đã hoàn thành bài học</p>
        </div>
        
        <div className="mb-6">
          <div className={`text-5xl font-bold mb-2 ${colorClasses[primaryColor].split(' ')[0]}`}>
            {score}
          </div>
          <div className="text-gray-600">Điểm số</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">{masteredCards.size}</div>
            <div className="text-xs text-gray-600">Làm đúng</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600">{learnedCount}</div>
            <div className="text-xs text-gray-600">Đã thuộc</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">{totalWords}</div>
            <div className="text-xs text-gray-600">Tổng từ</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xl font-bold text-red-600">{difficultCards.size}</div>
            <div className="text-xs text-gray-600">Cần ôn</div>
          </div>
          
          {showStudyTime && finalStudyTime !== undefined && (
            <div className="bg-indigo-50 rounded-lg p-3 col-span-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">{studyTimeDisplay}</div>
              </div>
              <div className="text-xs text-gray-600">Thời gian học</div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleRestart} 
            className={`w-full text-white py-3 rounded-lg ${colorClasses[primaryColor].split(' ').slice(1).join(' ')}`}
          >
            <RotateCw className="w-5 h-5 inline mr-2" /> Học lại
          </button>
          {lessonId && (
            <button 
              onClick={() => navigate(`/lesson-mode/${categoryId}/${lessonId}`)} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Chọn bộ lọc khác
            </button>
          )}
          <button 
            onClick={handleBackToCategory} 
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningResultScreen;
