import React, { useState } from 'react';
import { X, Filter, BookOpen, Flame, Target, Info } from 'lucide-react';

const LessonFilterModal = ({ isOpen, onClose, onStartLesson, totalWords }) => {
  const [filters, setFilters] = useState({
    difficulty: [], // [1, 2, 3, 4, 5]
    streak: 'all', // 'all', 'low' (0-1), 'medium' (2-3), 'high' (4+)
    wordLimit: totalWords || 20, // số từ muốn học
    includeUnlearned: true,
    includeLearned: false
  });

  if (!isOpen) return null;

  const difficultyOptions = [
    { value: 1, label: 'Dễ', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 2, label: 'Trung bình', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 3, label: 'Khá', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 4, label: 'Khó', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { value: 5, label: 'Rất khó', color: 'bg-red-100 text-red-700 border-red-300' }
  ];

  const streakOptions = [
    { value: 'all', label: 'Tất cả', description: 'Không lọc theo streak' },
    { value: 'low', label: 'Thấp (0-1)', description: 'Từ cần luyện tập nhiều' },
    { value: 'medium', label: 'Trung bình (2-3)', description: 'Từ đang tiến bộ' },
    { value: 'high', label: 'Cao (4+)', description: 'Từ đã thành thạo' }
  ];

  const toggleDifficulty = (level) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(level)
        ? prev.difficulty.filter(d => d !== level)
        : [...prev.difficulty, level]
    }));
  };

  const handleStartLesson = () => {
    onStartLesson(filters);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      difficulty: [],
      streak: 'all',
      wordLimit: totalWords || 20,
      includeUnlearned: true,
      includeLearned: false
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tùy chỉnh bài học</h2>
              <p className="text-sm text-gray-600">Chọn từ vựng phù hợp với mục tiêu của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Độ khó */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Độ khó</span>
              <span className="text-gray-400 font-normal">(Chọn nhiều mức)</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {difficultyOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleDifficulty(option.value)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    filters.difficulty.includes(option.value)
                      ? option.color + ' border-opacity-100 scale-105'
                      : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {filters.difficulty.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">
                <Info className="w-3 h-3 inline mr-1" />
                Không chọn = tất cả mức độ
              </p>
            )}
          </div>

          {/* Streak */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Mức độ thành thạo (Streak)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {streakOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilters(prev => ({ ...prev, streak: option.value }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    filters.streak === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trạng thái học */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Trạng thái từ vựng</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={filters.includeUnlearned}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeUnlearned: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Từ chưa thuộc</div>
                  <div className="text-xs text-gray-600">Các từ vẫn đang học (learned = false)</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={filters.includeLearned}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeLearned: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Từ đã thuộc</div>
                  <div className="text-xs text-gray-600">Các từ đã hoàn thành (learned = true)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Số lượng từ */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-gray-900 mb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Số lượng từ muốn học</span>
              </div>
              <span className="text-purple-600 text-lg">{filters.wordLimit}</span>
            </label>
            <input
              type="range"
              min="1"
              max={totalWords || 50}
              step="1"
              value={filters.wordLimit}
              onChange={(e) => setFilters(prev => ({ ...prev, wordLimit: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 từ</span>
              <span>{totalWords || 50} từ</span>
            </div>
          </div>

          {/* Thông báo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Hệ thống sẽ chọn từ ngẫu nhiên</p>
                <p className="text-blue-700">
                  Dựa trên các bộ lọc bạn chọn, hệ thống sẽ tự động chọn ngẫu nhiên số lượng từ phù hợp để học.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Đặt lại bộ lọc
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleStartLesson}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              Bắt đầu học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonFilterModal;