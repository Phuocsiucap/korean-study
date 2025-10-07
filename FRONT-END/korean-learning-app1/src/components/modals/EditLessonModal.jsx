// src/components/modals/EditLessonModal.jsx
import React, { useState, useEffect } from 'react';
import { X, BookOpen, Type, AlignLeft, BarChart3, Save, Plus, Trash2 } from 'lucide-react';

const EditLessonModal = ({ isOpen, onClose, onSave, lesson, categoryName }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Dễ',
    icon: '📚',
    words: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Emoji options for lesson icons
  const iconOptions = [
    '📚', '📖', '📝', '🎯', '🚀', '⭐', '💡', '🎓', 
    '🔥', '💪', '🌟', '🎪', '🎨', '🎵', '🌈', '⚡'
  ];

  const difficultyOptions = ['Dễ', 'Trung bình', 'Khó'];

  // Load lesson data when modal opens
  useEffect(() => {
    if (isOpen && lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        difficulty: lesson.difficulty || 'Dễ',
        icon: lesson.icon || '📚',
        words: lesson.words || [{ word: '', meaning: '', difficulty: 1 }]
      });
      setErrors({});
    }
  }, [isOpen, lesson]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleWordChange = (index, field, value) => {
    const newWords = [...formData.words];
    newWords[index][field] = value;
    setFormData(prev => ({
      ...prev,
      words: newWords
    }));
  };

  const addWord = () => {
    setFormData(prev => ({
      ...prev,
      words: [...prev.words, { word: '', meaning: '', difficulty: 1 }]
    }));
  };

  const removeWord = (index) => {
    if (formData.words.length > 1) {
      setFormData(prev => ({
        ...prev,
        words: prev.words.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tên bài học không được để trống';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    // Validate words
    const hasEmptyWords = formData.words.some(word => 
      !word.word.trim() || !word.meaning.trim()
    );
    
    if (hasEmptyWords) {
      newErrors.words = 'Vui lòng điền đầy đủ tất cả từ vựng';
    }

    if (formData.words.length === 0) {
      newErrors.words = 'Bài học phải có ít nhất 1 từ vựng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedLesson = {
        ...lesson,
        ...formData,
        word_count: formData.words.length
      };
      
      await onSave(updatedLesson);
      onClose();
    } catch (error) {
      console.error('Error updating lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa bài học</h2>
            <p className="text-sm text-gray-600 mt-1">
              Cập nhật thông tin cho bài học trong <span className="font-medium">{categoryName}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
              
              {/* Icon Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Biểu tượng bài học
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all hover:scale-110 ${
                        formData.icon === icon
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên bài học *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="VD: Bài 1: Chào hỏi cơ bản"
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ khó
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả bài học *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mô tả ngắn gọn về nội dung bài học..."
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Words Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Từ vựng ({formData.words.length} từ)
                </h3>
                <button
                  type="button"
                  onClick={addWord}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm từ</span>
                </button>
              </div>

              {errors.words && (
                <p className="mb-4 text-sm text-red-600">{errors.words}</p>
              )}

              <div className="space-y-4">
                {formData.words.map((word, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Từ {index + 1}
                      </span>
                      {formData.words.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWord(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={loading}
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
                          disabled={loading}
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
                          disabled={loading}
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
                          disabled={loading}
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLessonModal;