// src/components/modals/AddLessonModal.jsx
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const AddLessonModal = ({ isOpen, onClose, onSave, categoryName }) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    difficulty: 'Dễ',
    icon: '📚',
    words: [
      { word: '', meaning: '', difficulty: 1 }
    ]
  });

  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const difficultyOptions = ['Dễ', 'Trung bình', 'Khó'];
  const iconOptions = ['📚', '👋', '👤', '👨‍👩‍👧‍👦', '🔢', '🍽️', '🏠', '🎵', '🌟', '💼', '🚗', '🏥'];

  const handleInputChange = (field, value) => {
    setLessonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWordChange = (index, field, value) => {
    const newWords = [...lessonData.words];
    newWords[index][field] = value;
    setLessonData(prev => ({
      ...prev,
      words: newWords
    }));
  };

  const addWord = () => {
    setLessonData(prev => ({
      ...prev,
      words: [...prev.words, { word: '', meaning: '', difficulty: 1 }]
    }));
  };

  const removeWord = (index) => {
    if (lessonData.words.length > 1) {
      setLessonData(prev => ({
        ...prev,
        words: prev.words.filter((_, i) => i !== index)
      }));
    }
  };

  const handleBulkInput = () => {
    if (!bulkInput.trim()) {
      alert('Vui lòng nhập danh sách từ vựng');
      return;
    }

    const lines = bulkInput.trim().split('\n');
    const parsedWords = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(':');
      if (parts.length !== 2) {
        alert(`Dòng ${i + 1} không đúng định dạng. Vui lòng sử dụng format: "từ tiếng Hàn: nghĩa tiếng Việt"`);
        return;
      }

      const word = parts[0].trim();
      const meaning = parts[1].trim();

      if (!word || !meaning) {
        alert(`Dòng ${i + 1} có nội dung trống`);
        return;
      }

      parsedWords.push({
        word: word,
        meaning: meaning,
        difficulty: 1
      });
    }

    if (parsedWords.length > 0) {
      setLessonData(prev => ({
        ...prev,
        words: parsedWords
      }));
      setBulkInput('');
      setShowBulkInput(false);
      alert(`Đã thêm ${parsedWords.length} từ vựng thành công!`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!lessonData.title.trim()) {
      alert('Vui lòng nhập tên bài học');
      return;
    }
    
    if (!lessonData.description.trim()) {
      alert('Vui lòng nhập mô tả bài học');
      return;
    }

    // Check if all words are filled
    const hasEmptyWords = lessonData.words.some(word => 
      !word.word.trim() || !word.meaning.trim()
    );
    
    if (hasEmptyWords) {
      alert('Vui lòng điền đầy đủ tất cả từ vựng');
      return;
    }

    // Create lesson object
    const newLesson = {
      ...lessonData
     
    };

    onSave(newLesson);
    
    // Reset form
    setLessonData({
      title: '',
      description: '',
      difficulty: 'Dễ',
      icon: '📚',
      words: [{ word: '', meaning: '', difficulty: 1 }]
    });
    setBulkInput('');
    setShowBulkInput(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Thêm bài học mới - {categoryName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên bài học *
                </label>
                <input
                  type="text"
                  value={lessonData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="VD: Bài 1: Chào hỏi cơ bản"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <select
                  value={lessonData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {difficultyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả bài học *
              </label>
              <textarea
                value={lessonData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Mô tả nội dung và mục tiêu của bài học..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon bài học
              </label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`w-10 h-10 text-xl border-2 rounded-lg transition-colors ${
                      lessonData.icon === icon 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Words Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Từ vựng ({lessonData.words.length} từ)
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBulkInput(!showBulkInput)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <span>{showBulkInput ? 'Ẩn nhập nhanh' : '📝 Nhập nhanh'}</span>
                </button>
                <button
                  type="button"
                  onClick={addWord}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm từ</span>
                </button>
              </div>
            </div>

            {/* Bulk Input Section */}
            {showBulkInput && (
              <div className="mb-6 bg-white rounded-lg p-4 border-2 border-blue-200">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 Nhập nhiều từ cùng lúc
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Mỗi dòng một từ, định dạng: <code className="bg-gray-100 px-2 py-0.5 rounded text-blue-600">từ tiếng Hàn: nghĩa tiếng Việt</code>
                  </p>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="안녕하세요: xin chào&#10;사과: quả táo&#10;감사합니다: cảm ơn&#10;물: nước&#10;밥: cơm"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkInput('');
                      setShowBulkInput(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkInput}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    ✓ Xác nhận và thêm vào danh sách
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {lessonData.words.map((word, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Từ {index + 1}
                    </span>
                    {lessonData.words.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWord(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Tiếng Hàn *
                      </label>
                      <input
                        type="text"
                        value={word.word}
                        onChange={(e) => handleWordChange(index, 'word', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="안녕하세요"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Tiếng Việt *
                      </label>
                      <input
                        type="text"
                        value={word.meaning}
                        onChange={(e) => handleWordChange(index, 'meaning', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Xin chào"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Độ khó (1-5)
                      </label>
                      <select
                        value={word.difficulty}
                        onChange={(e) => handleWordChange(index, 'difficulty', parseInt(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value={1}>1 - Rất dễ</option>
                        <option value={2}>2 - Dễ</option>
                        <option value={3}>3 - Trung bình</option>
                        <option value={4}>4 - Khó</option>
                        <option value={5}>5 - Rất khó</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Lưu bài học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;